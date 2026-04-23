using Store.BLL.DTOs.Cart;

namespace Store.BLL.Interfaces;

public interface ICartService
{
    Task<IEnumerable<CartDto>> GetCartAsync(int userId);
    Task AddToCartAsync(int userId, AddToCartRequest request);
    Task UpdateCartQuantityAsync(int userId, UpdateCartRequest request);
    Task RemoveFromCartAsync(int userId, int productId);
    Task ClearCartAsync(int userId);
}

