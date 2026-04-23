using Microsoft.EntityFrameworkCore;
using Store.BLL.DTOs.Cart;
using Store.BLL.Interfaces;
using Store.DAL.Models;

namespace Store.BLL.Services;

public class CartService : ICartService
{
    private readonly AppDbContext _context;

    public CartService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CartDto>> GetCartAsync(int userId)
    {
        return await _context.Carts
            .Where(c => c.UserId == userId)
            .Include(c => c.Product)
            .Select(c => new CartDto
            {
                Id = c.Id,
                ProductId = c.ProductId,
                ProductName = c.Product.Name,
                ProductImage = c.Product.Image,
                ProductPrice = c.Product.Price ?? 0,
                Quantity = c.Quantity
            })
            .ToListAsync();
    }

    public async Task AddToCartAsync(int userId, AddToCartRequest request)
    {
        var cartItem = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == request.ProductId);

        if (cartItem != null)
        {
            cartItem.Quantity += request.Quantity;
        }
        else
        {
            _context.Carts.Add(new Cart
            {
                UserId = userId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            });
        }

        await _context.SaveChangesAsync();
    }

    public async Task UpdateCartQuantityAsync(int userId, UpdateCartRequest request)
    {
        var cartItem = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == request.ProductId);

        if (cartItem != null)
        {
            if (request.Quantity > 0)
            {
                cartItem.Quantity = request.Quantity;
            }
            else
            {
                _context.Carts.Remove(cartItem);
            }
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveFromCartAsync(int userId, int productId)
    {
        var cartItem = await _context.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

        if (cartItem != null)
        {
            _context.Carts.Remove(cartItem);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearCartAsync(int userId)
    {
        var cartItems = await _context.Carts
            .Where(c => c.UserId == userId)
            .ToListAsync();

        _context.Carts.RemoveRange(cartItems);
        await _context.SaveChangesAsync();
    }
}

