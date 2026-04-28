using Store.BLL.DTOs.Order;
using Store.BLL.DTOs.Payment;

namespace Store.BLL.Interfaces;

public interface IOrderService
{
    Task<CheckoutResultDto> CheckoutCodAsync(int userId, CheckoutCodRequest request);
    Task<CheckoutResultDto> CheckoutCodGuestAsync(CheckoutCodGuestRequest request);
    Task<CheckoutVnPayResultDto> CheckoutVnPayAsync(int userId, CheckoutVnPayRequest request, string? clientIp);
    Task<IEnumerable<OrderSummaryDto>> LookupOrdersByEmailAsync(string email);
    Task<OrderSummaryDto?> ConfirmVnPayOrderAsync(int orderId);
    Task<OrderSummaryDto?> MarkVnPayOrderFailedAsync(int orderId);
    Task<IEnumerable<OrderSummaryDto>> GetMyOrdersAsync(int userId);
    Task<OrderSummaryDto?> GetMyOrderByIdAsync(int userId, int orderId);
    Task<OrderSummaryDto?> CancelMyOrderAsync(int userId, int orderId);
    Task<OrderSummaryDto?> GetOrderByIdAsync(int orderId);
    Task UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequest request);
}
