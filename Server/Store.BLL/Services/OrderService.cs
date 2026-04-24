using Store.BLL.DTOs.Order;
using Store.BLL.Interfaces;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.BLL.Services;

public class OrderService : IOrderService
{
    private const string ShipCodMethod = "shipcod";
    private const string PendingConfirmStatus = "pending_confirm";

    private static readonly HashSet<string> AllowedStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "pending_confirm",
        "confirmed",
        "shipping",
        "delivered",
        "cancelled"
    };

    private readonly ICartRepository _cartRepository;
    private readonly IOrderRepository _orderRepository;

    public OrderService(ICartRepository cartRepository, IOrderRepository orderRepository)
    {
        _cartRepository = cartRepository;
        _orderRepository = orderRepository;
    }

    public async Task<CheckoutResultDto> CheckoutCodAsync(int userId, CheckoutCodRequest request)
    {
        if (userId <= 0) throw new UnauthorizedAccessException("Invalid user.");
        ValidateCustomerInfo(request.CustomerName, request.CustomerPhone, request.ShippingAddress);

        var cartItems = await _cartRepository.GetCartItemsWithProductAsync(userId);

        if (cartItems.Count == 0)
            throw new ArgumentException("Giỏ hàng trống.");

        ValidateCartItems(cartItems.Select(c => (c.ProductId, c.Quantity, c.Product)).ToList());

        var order = new Order
        {
            UserId = userId,
            CustomerName = request.CustomerName.Trim(),
            CustomerPhone = request.CustomerPhone.Trim(),
            CustomerEmail = string.IsNullOrWhiteSpace(request.CustomerEmail) ? null : request.CustomerEmail.Trim(),
            ShippingAddress = request.ShippingAddress.Trim(),
            PaymentMethod = ShipCodMethod,
            Status = PendingConfirmStatus,
            TotalAmount = cartItems.Sum(c => (c.Product.Price ?? 0m) * c.Quantity),
            CreatedAt = DateTime.UtcNow
        };

        var orderItems = cartItems.Select(c => new OrderItem
        {
            ProductId = c.ProductId,
            Quantity = c.Quantity,
            Price = c.Product.Price ?? 0m
        }).ToList();

        await _orderRepository.CreateOrderWithItemsAsync(order, orderItems, cartItems);

        return new CheckoutResultDto
        {
            OrderId = order.Id,
            TotalAmount = order.TotalAmount ?? 0m,
            PaymentMethod = order.PaymentMethod ?? ShipCodMethod,
            Status = order.Status ?? PendingConfirmStatus,
            CreatedAt = order.CreatedAt ?? DateTime.UtcNow
        };
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

        var orderItems = itemPayload.Select(i => new OrderItem
        {
            ProductId = i.ProductId,
            Quantity = i.Quantity,
            Price = i.Item3.Price ?? 0m
        }).ToList();

        await _orderRepository.CreateOrderWithItemsAsync(order, orderItems);

        return new CheckoutResultDto
        {
            OrderId = order.Id,
            TotalAmount = order.TotalAmount ?? 0m,
            PaymentMethod = order.PaymentMethod ?? ShipCodMethod,
            Status = order.Status ?? PendingConfirmStatus,
            CreatedAt = order.CreatedAt ?? DateTime.UtcNow
        };
    }

    public async Task<IEnumerable<OrderSummaryDto>> GetMyOrdersAsync(int userId)
    {
        if (userId <= 0) throw new UnauthorizedAccessException("Invalid user.");
        var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);
        return orders.Select(MapOrderSummary);
    }

    public async Task<OrderSummaryDto?> GetMyOrderByIdAsync(int userId, int orderId)
    {
        if (userId <= 0) throw new UnauthorizedAccessException("Invalid user.");
        if (orderId <= 0) throw new ArgumentException("OrderId không hợp lệ.");

        var order = await _orderRepository.GetOrderWithItemsByUserIdAsync(orderId, userId);
        return order is null ? null : MapOrderSummary(order);
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
                Price = oi.Price,
                Quantity = oi.Quantity ?? 0
            }).ToList()
        };
    }
}
