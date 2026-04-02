namespace StartComputer.DAL.Repositories;
using Server.Models;
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
}