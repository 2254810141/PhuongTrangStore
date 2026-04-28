using Microsoft.Extensions.Configuration;
using Store.BLL.DTOs.Order;
using Store.BLL.DTOs.Payment;
using Store.BLL.Interfaces;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.BLL.Services;

public class OrderService : IOrderService
{
    private const string DraftStatus = "draft";
    private const string ShipCodMethod = "shipcod";
    private const string VnPayMethod = "vnpay";
    private const string PendingConfirmStatus = "pending_confirm";
    private const string PendingPaymentStatus = "pending_payment";
    private const string ConfirmedStatus = "confirmed";
    private const string CancelledStatus = "cancelled";
    private const string ExpiredStatus = "expired";
    private static readonly TimeSpan PendingOrderLifetime = TimeSpan.FromMinutes(15);

    private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        DraftStatus,
        PendingConfirmStatus,
        PendingPaymentStatus,
        ConfirmedStatus,
        "shipping",
        "delivered",
        CancelledStatus,
        ExpiredStatus
    };

    private static readonly HashSet<string> ReusableStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        DraftStatus,
        PendingConfirmStatus,
        PendingPaymentStatus
    };

    private static readonly HashSet<string> CancelableStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        DraftStatus,
        PendingConfirmStatus,
        PendingPaymentStatus
    };

    private readonly ICartRepository _cartRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IVnPayService _vnPayService;
    private readonly string _vnpayReturnUrl;

    public OrderService(
        ICartRepository cartRepository,
        IOrderRepository orderRepository,
        IVnPayService vnPayService,
        IConfiguration configuration)
    {
        _cartRepository = cartRepository;
        _orderRepository = orderRepository;
        _vnPayService = vnPayService;
        _vnpayReturnUrl = configuration["VnPay:ReturnUrl"]
                          ?? throw new InvalidOperationException("VnPay:ReturnUrl is missing.");
    }

    public async Task<CheckoutResultDto> CheckoutCodAsync(int userId, CheckoutCodRequest request)
    {
        EnsureValidUser(userId);
        ValidateCustomerInfo(request.CustomerName, request.CustomerPhone, request.ShippingAddress);

        var cartItems = await _cartRepository.GetCartItemsWithProductAsync(userId);
        var reusableOrder = await GetReusablePendingOrderAsync(userId);
        var checkoutCartItems = ResolveCheckoutCartItems(cartItems, request.SelectedProductIds);

        if (checkoutCartItems.Count == 0)
        {
            if (request.SelectedProductIds.Count == 0 && reusableOrder is not null)
            {
                return MapCheckoutResult(reusableOrder);
            }

            throw new ArgumentException("Giỏ hàng trống.");
        }

        var itemPayload = checkoutCartItems.Select(c => (c.ProductId, c.Quantity, c.Product)).ToList();
        ValidateCartItems(itemPayload);

        var order = BuildAuthenticatedOrder(userId, request.CustomerName, request.CustomerPhone, request.CustomerEmail, request.ShippingAddress, ShipCodMethod, PendingConfirmStatus, reusableOrder, itemPayload.Sum(c => (c.Product.Price ?? 0m) * c.Quantity));
        var orderItems = BuildOrderItems(itemPayload);

        await _orderRepository.UpsertOrderWithItemsAsync(order, orderItems, checkoutCartItems);

        return MapCheckoutResult(order);
    }

    public async Task<CheckoutResultDto> CheckoutCodGuestAsync(CheckoutCodGuestRequest request)
    {
        ValidateCustomerInfo(request.CustomerName, request.CustomerPhone, request.ShippingAddress);

        if (request.Items is null || request.Items.Count == 0)
            throw new ArgumentException("Danh sách sản phẩm không được để trống.");

        var groupedItems = request.Items
            .GroupBy(i => i.ProductId)
            .Select(g => new CheckoutItemRequest
            {
                ProductId = g.Key,
                Quantity = g.Sum(x => x.Quantity)
            })
            .ToList();

        if (groupedItems.Any(i => i.ProductId <= 0 || i.Quantity <= 0))
            throw new ArgumentException("Dữ liệu sản phẩm không hợp lệ.");

        var productIds = groupedItems.Select(i => i.ProductId).ToList();
        var products = await _orderRepository.GetProductsByIdsAsync(productIds);

        if (products.Count != groupedItems.Count)
            throw new ArgumentException("Có sản phẩm không tồn tại.");

        var itemPayload = groupedItems
            .Select(i => (i.ProductId, i.Quantity, products.First(p => p.Id == i.ProductId)))
            .ToList();

        ValidateCartItems(itemPayload);

        var order = new Order
        {
            UserId = null,
            CustomerName = request.CustomerName.Trim(),
            CustomerPhone = request.CustomerPhone.Trim(),
            CustomerEmail = string.IsNullOrWhiteSpace(request.CustomerEmail) ? null : request.CustomerEmail.Trim(),
            ShippingAddress = request.ShippingAddress.Trim(),
            PaymentMethod = ShipCodMethod,
            Status = PendingConfirmStatus,
            TotalAmount = itemPayload.Sum(i => (i.Item3.Price ?? 0m) * i.Quantity),
            CreatedAt = DateTime.UtcNow
        };

        var orderItems = BuildOrderItems(itemPayload);

        await _orderRepository.CreateOrderWithItemsAsync(order, orderItems);

        return MapCheckoutResult(order);
    }

    public async Task<CheckoutVnPayResultDto> CheckoutVnPayAsync(int userId, CheckoutVnPayRequest request, string? clientIp)
    {
        EnsureValidUser(userId);
        ValidateCustomerInfo(request.CustomerName, request.CustomerPhone, request.ShippingAddress);

        var cartItems = await _cartRepository.GetCartItemsWithProductAsync(userId);
        var reusableOrder = await GetReusablePendingOrderAsync(userId);
        var checkoutCartItems = ResolveCheckoutCartItems(cartItems, request.SelectedProductIds);

        if (checkoutCartItems.Count == 0)
        {
            if (request.SelectedProductIds.Count == 0 &&
                reusableOrder is not null &&
                string.Equals(reusableOrder.PaymentMethod, VnPayMethod, StringComparison.OrdinalIgnoreCase))
            {
                return BuildVnPayResult(reusableOrder, clientIp);
            }

            throw new ArgumentException("Giỏ hàng trống.");
        }

        var itemPayload = checkoutCartItems.Select(c => (c.ProductId, c.Quantity, c.Product)).ToList();
        ValidateCartItems(itemPayload);

        var order = BuildAuthenticatedOrder(
            userId,
            request.CustomerName,
            request.CustomerPhone,
            request.CustomerEmail,
            request.ShippingAddress,
            VnPayMethod,
            PendingPaymentStatus,
            reusableOrder,
            itemPayload.Sum(c => (c.Product.Price ?? 0m) * c.Quantity));

        var orderItems = BuildOrderItems(itemPayload);

        await _orderRepository.UpsertOrderWithItemsAsync(order, orderItems);

        return BuildVnPayResult(order, clientIp);
    }

    public async Task<IEnumerable<OrderSummaryDto>> LookupOrdersByEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email là bắt buộc.");

        var orders = await _orderRepository.GetOrdersByEmailAsync(email);
        return orders.OrderByDescending(o => o.CreatedAt).Select(MapOrderSummary);
    }

    public async Task<OrderSummaryDto?> ConfirmVnPayOrderAsync(int orderId)
    {
        if (orderId <= 0) throw new ArgumentException("OrderId không hợp lệ.");

        var order = await _orderRepository.GetOrderWithItemsAsync(orderId);
        if (order is null)
            return null;

        if (!string.Equals(order.PaymentMethod, VnPayMethod, StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException("Đơn hàng này không phải thanh toán bằng VNPAY.");

        if (IsExpired(order, DateTime.UtcNow))
        {
            order.Status = ExpiredStatus;
            await _orderRepository.SaveChangesAsync();
            throw new ArgumentException("Đơn hàng đã hết hạn.");
        }

        if (string.Equals(order.Status, ConfirmedStatus, StringComparison.OrdinalIgnoreCase))
            return MapOrderSummary(order);

        order.Status = ConfirmedStatus;
        await _orderRepository.SaveChangesAsync();

        if (order.UserId.HasValue)
        {
            var cartItems = await _cartRepository.GetCartItemsWithProductAsync(order.UserId.Value);

            var orderProductIds = order.OrderItems
                .Where(x => x.ProductId.HasValue)
                .Select(x => x.ProductId!.Value)
                .ToHashSet();

            var cartsToRemove = cartItems
                .Where(c => orderProductIds.Contains(c.ProductId))
                .ToList();

            if (cartsToRemove.Count > 0)
            {
                _cartRepository.RemoveRange(cartsToRemove);
                await _cartRepository.SaveChangesAsync();
            }
        }

        return MapOrderSummary(order);
    }

    public async Task<IEnumerable<OrderSummaryDto>> GetMyOrdersAsync(int userId)
    {
        EnsureValidUser(userId);
        await ExpireStalePendingOrdersAsync(userId);
        var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);
        return orders.OrderByDescending(o => o.CreatedAt).Select(MapOrderSummary);
    }

    public async Task<OrderSummaryDto?> GetMyOrderByIdAsync(int userId, int orderId)
    {
        EnsureValidUser(userId);
        if (orderId <= 0) throw new ArgumentException("OrderId không hợp lệ.");

        await ExpireStalePendingOrdersAsync(userId);

        var order = await _orderRepository.GetOrderWithItemsByUserIdAsync(orderId, userId);
        return order is null ? null : MapOrderSummary(order);
    }

    public async Task<OrderSummaryDto?> CancelMyOrderAsync(int userId, int orderId)
    {
        EnsureValidUser(userId);
        if (orderId <= 0) throw new ArgumentException("OrderId không hợp lệ.");

        await ExpireStalePendingOrdersAsync(userId);

        var order = await _orderRepository.GetOrderWithItemsByUserIdAsync(orderId, userId);
        if (order is null)
            return null;

        if (string.Equals(order.Status, CancelledStatus, StringComparison.OrdinalIgnoreCase) ||
            string.Equals(order.Status, ExpiredStatus, StringComparison.OrdinalIgnoreCase))
        {
            return MapOrderSummary(order);
        }

        if (!CancelableStatuses.Contains(order.Status ?? string.Empty))
            throw new ArgumentException("Đơn hàng này không thể hủy.");

        order.Status = CancelledStatus;
        await _orderRepository.SaveChangesAsync();

        return MapOrderSummary(order);
    }

    public async Task<OrderSummaryDto?> GetOrderByIdAsync(int orderId)
    {
        if (orderId <= 0) throw new ArgumentException("OrderId không hợp lệ.");
        var order = await _orderRepository.GetOrderWithItemsAsync(orderId);
        return order is null ? null : MapOrderSummary(order);
    }

    public async Task UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequest request)
    {
        if (orderId <= 0) throw new ArgumentException("OrderId không hợp lệ.");
        if (request is null || string.IsNullOrWhiteSpace(request.Status))
            throw new ArgumentException("Status là bắt buộc.");

        var normalizedStatus = request.Status.Trim().ToLowerInvariant();
        if (!AllowedStatuses.Contains(normalizedStatus))
            throw new ArgumentException("Status không hợp lệ.");

        var order = await _orderRepository.GetOrderWithItemsAsync(orderId);
        if (order is null)
            throw new ArgumentException("Đơn hàng không tồn tại.");

        order.Status = normalizedStatus;
        await _orderRepository.SaveChangesAsync();
    }

    public async Task<OrderSummaryDto?> MarkVnPayOrderFailedAsync(int orderId)
    {
        if (orderId <= 0) throw new ArgumentException("OrderId không hợp lệ.");

        var order = await _orderRepository.GetOrderWithItemsAsync(orderId);
        if (order is null)
            return null;

        if (!string.Equals(order.PaymentMethod, VnPayMethod, StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException("Đơn hàng này không phải thanh toán bằng VNPAY.");

        if (string.Equals(order.Status, ConfirmedStatus, StringComparison.OrdinalIgnoreCase))
            return MapOrderSummary(order);

        order.Status = IsExpired(order, DateTime.UtcNow) ? ExpiredStatus : CancelledStatus;
        await _orderRepository.SaveChangesAsync();

        return MapOrderSummary(order);
    }

    private async Task ExpireStalePendingOrdersAsync(int userId)
    {
        var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);
        var now = DateTime.UtcNow;
        var changed = false;

        foreach (var order in orders)
        {
            if (IsExpired(order, now))
            {
                order.Status = ExpiredStatus;
                changed = true;
            }
        }

        if (changed)
        {
            await _orderRepository.SaveChangesAsync();
        }
    }

    private async Task<Order?> GetReusablePendingOrderAsync(int userId)
    {
        await ExpireStalePendingOrdersAsync(userId);

        var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);
        return orders
            .OrderByDescending(o => o.CreatedAt ?? DateTime.MinValue)
            .FirstOrDefault(o => ReusableStatuses.Contains(o.Status ?? string.Empty));
    }

    private static bool IsExpired(Order order, DateTime now)
    {
        var status = order.Status ?? string.Empty;
        if (!ReusableStatuses.Contains(status))
            return false;

        var createdAt = order.CreatedAt ?? now;
        return createdAt.Add(PendingOrderLifetime) <= now;
    }

    private static void EnsureValidUser(int userId)
    {
        if (userId <= 0)
            throw new UnauthorizedAccessException("Invalid user.");
    }

    private static void ValidateCustomerInfo(string? customerName, string? customerPhone, string? shippingAddress)
    {
        if (string.IsNullOrWhiteSpace(customerName))
            throw new ArgumentException("Tên khách hàng là bắt buộc.");
        if (string.IsNullOrWhiteSpace(customerPhone))
            throw new ArgumentException("Số điện thoại là bắt buộc.");
        if (string.IsNullOrWhiteSpace(shippingAddress))
            throw new ArgumentException("Địa chỉ giao hàng là bắt buộc.");
    }

    private static void ValidateCartItems(IReadOnlyCollection<(int ProductId, int Quantity, Product Product)> items)
    {
        foreach (var item in items)
        {
            if (item.ProductId <= 0 || item.Quantity <= 0)
                throw new ArgumentException("Dữ liệu sản phẩm không hợp lệ.");
            if (item.Product.IsActive.HasValue && !item.Product.IsActive.Value)
                throw new ArgumentException($"Sản phẩm '{item.Product.Name}' hiện không khả dụng.");
            if (item.Product.IsContactPrice.HasValue && item.Product.IsContactPrice.Value)
                throw new ArgumentException($"Sản phẩm '{item.Product.Name}' chưa hỗ trợ checkout online.");
        }
    }

    private static List<Cart> ResolveCheckoutCartItems(List<Cart> cartItems, IReadOnlyCollection<int>? selectedProductIds)
    {
        if (selectedProductIds is null || selectedProductIds.Count == 0)
        {
            return cartItems;
        }

        var selectedIds = selectedProductIds
            .Where(id => id > 0)
            .Distinct()
            .ToHashSet();

        if (selectedIds.Count == 0)
            throw new ArgumentException("Danh sách sản phẩm được chọn không hợp lệ.");

        var selectedItems = cartItems
            .Where(c => selectedIds.Contains(c.ProductId))
            .ToList();

        if (selectedItems.Count != selectedIds.Count)
            throw new ArgumentException("Có sản phẩm được chọn không tồn tại trong giỏ hàng.");

        return selectedItems;
    }

    private static List<OrderItem> BuildOrderItems<T>(IEnumerable<(int ProductId, int Quantity, T Product)> items) where T : Product
    {
        return items.Select(i => new OrderItem
        {
            ProductId = i.ProductId,
            Quantity = i.Quantity,
            Price = i.Product.Price ?? 0m
        }).ToList();
    }

    private static Order BuildAuthenticatedOrder(
        int userId,
        string customerName,
        string customerPhone,
        string? customerEmail,
        string shippingAddress,
        string paymentMethod,
        string status,
        Order? reusableOrder,
        decimal totalAmount)
    {
        var now = DateTime.UtcNow;
        var order = reusableOrder ?? new Order
        {
            CreatedAt = now
        };

        order.UserId = userId;
        order.CustomerName = customerName.Trim();
        order.CustomerPhone = customerPhone.Trim();
        order.CustomerEmail = string.IsNullOrWhiteSpace(customerEmail) ? null : customerEmail.Trim();
        order.ShippingAddress = shippingAddress.Trim();
        order.PaymentMethod = paymentMethod;
        order.Status = status;
        order.TotalAmount = totalAmount;
        order.CreatedAt ??= now;

        return order;
    }

    private CheckoutResultDto MapCheckoutResult(Order order)
    {
        return new CheckoutResultDto
        {
            OrderId = order.Id,
            TotalAmount = order.TotalAmount ?? 0m,
            PaymentMethod = order.PaymentMethod ?? ShipCodMethod,
            Status = order.Status ?? PendingConfirmStatus,
            CreatedAt = order.CreatedAt ?? DateTime.UtcNow
        };
    }

    private CheckoutVnPayResultDto BuildVnPayResult(Order order, string? clientIp)
    {
        var now = DateTime.UtcNow;
        var expiresAt = now.Add(PendingOrderLifetime);

        var paymentUrl = _vnPayService.CreatePaymentUrl(new VnPayCreatePaymentRequest
        {
            OrderId = order.Id,
            Amount = order.TotalAmount ?? 0m,
            OrderInfo = $"Thanh toán đơn hàng #{order.Id}",
            ClientIp = clientIp ?? "127.0.0.1",
            ReturnUrl = _vnpayReturnUrl,
            CreatedAt = now,
            ExpireAt = expiresAt
        });

        return new CheckoutVnPayResultDto
        {
            OrderId = order.Id,
            TotalAmount = order.TotalAmount ?? 0m,
            PaymentMethod = VnPayMethod,
            Status = order.Status ?? PendingPaymentStatus,
            PaymentUrl = paymentUrl,
            CreatedAt = now,
            ExpiresAt = expiresAt
        };
    }

    private static OrderSummaryDto MapOrderSummary(Order order)
    {
        return new OrderSummaryDto
        {
            OrderId = order.Id,
            TotalAmount = order.TotalAmount ?? 0m,
            PaymentMethod = order.PaymentMethod ?? ShipCodMethod,
            Status = order.Status ?? PendingConfirmStatus,
            CreatedAt = order.CreatedAt ?? DateTime.UtcNow,
            Items = order.OrderItems.Select(oi => new OrderItemSummaryDto
            {
                ProductId = oi.ProductId ?? 0,
                ProductName = oi.Product?.Name ?? string.Empty,
                ProductImage = oi.Product?.Image,
                Price = oi.Price,
                Quantity = oi.Quantity ?? 0
            }).ToList()
        };
    }
}