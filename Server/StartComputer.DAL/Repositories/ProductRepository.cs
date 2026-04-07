namespace StartComputer.DAL.Repositories;
using StartComputer.DAL.Models;
using Microsoft.EntityFrameworkCore;
using StartComputer.DAL.Interfaces;
public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task<IEnumerable<Product>> SearchByNameAsync(string keyword)
    {
        var key = keyword.Trim();
        return await _context.Products.Where(p => p.ProductName.Contains(key)).ToListAsync();
    }

    public Task<Product?> GetByIdAsync(int ProductId)
    {
        return _context.Products.FirstOrDefaultAsync(p => p.ProductId == ProductId);
    }

    public async Task<Product> UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await _context.SaveChangesAsync();
        return product;
    }
}