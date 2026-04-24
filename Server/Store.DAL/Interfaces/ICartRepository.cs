using Store.DAL.Models;

namespace Store.DAL.Interfaces;

public interface ICartRepository
{
    Task<List<Cart>> GetCartItemsWithProductAsync(int userId);
    Task<Cart?> GetCartItemAsync(int userId, int productId);
    Task AddAsync(Cart cart);
    void Remove(Cart cart);
    void RemoveRange(IEnumerable<Cart> carts);
    Task SaveChangesAsync();
}

