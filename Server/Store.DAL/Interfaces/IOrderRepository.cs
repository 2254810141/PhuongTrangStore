using Store.DAL.Models;

namespace Store.DAL.Interfaces;

public interface IOrderRepository
{
    Task<List<Product>> GetProductsByIdsAsync(IEnumerable<int> productIds);
    Task CreateOrderWithItemsAsync(Order order, IEnumerable<OrderItem> orderItems, IEnumerable<Cart>? cartsToClear = null);
    Task<List<Order>> GetOrdersByUserIdAsync(int userId);
    Task<Order?> GetOrderWithItemsAsync(int orderId);
    Task<Order?> GetOrderWithItemsByUserIdAsync(int orderId, int userId);
    Task SaveChangesAsync();
}
