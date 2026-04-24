using Microsoft.EntityFrameworkCore;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.DAL.Repositories;

public class CartRepository : ICartRepository
{
    private readonly AppDbContext _context;

    public CartRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cart>> GetCartItemsWithProductAsync(int userId)
    {
        return await _context.Carts
            .Where(c => c.UserId == userId)
            .Include(c => c.Product)
            .ToListAsync();
    }

    public async Task<Cart?> GetCartItemAsync(int userId, int productId)
    {
        return await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);
    }

    public async Task AddAsync(Cart cart)
    {
        await _context.Carts.AddAsync(cart);
    }

    public void Remove(Cart cart)
    {
        _context.Carts.Remove(cart);
    }

    public void RemoveRange(IEnumerable<Cart> carts)
    {
        _context.Carts.RemoveRange(carts);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}

