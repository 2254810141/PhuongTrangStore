namespace Store.DAL.Repositories;
using Store.DAL.Models;
using Microsoft.EntityFrameworkCore;
using Store.DAL.Interfaces;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products
            .Where(p => p.IsActive != false)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchByNameAsync(string keyword)
    {
        var key = keyword.Trim();
        return await _context.Products
            .Where(p => p.IsActive != false && p.Name.Contains(key))
            .ToListAsync();
    }

    public Task<Product?> GetByIdAsync(int productId)
    {
        return _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && p.IsActive != false);
    }

    public async Task<Product> UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product> CreateAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteAsync(int productId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == productId && p.IsActive != false);

        if (product is null) return false;

        product.IsActive = false; 
        await _context.SaveChangesAsync();
        return true;
    }
}
