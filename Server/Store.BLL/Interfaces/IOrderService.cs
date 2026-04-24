using Store.BLL.DTOs.Order;

namespace Store.BLL.Interfaces;

public interface IOrderService
{
    Task<CheckoutResultDto> CheckoutCodAsync(int userId, CheckoutCodRequest request);
    Task<CheckoutResultDto> CheckoutCodGuestAsync(CheckoutCodGuestRequest request);
    Task<IEnumerable<OrderSummaryDto>> GetMyOrdersAsync(int userId);
    Task<OrderSummaryDto?> GetMyOrderByIdAsync(int userId, int orderId);
    Task<OrderSummaryDto?> GetOrderByIdAsync(int orderId);
    Task UpdateOrderStatusAsync(int orderId, UpdateOrderStatusRequest request);
}
