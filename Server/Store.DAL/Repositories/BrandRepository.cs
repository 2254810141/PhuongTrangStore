using Store.DAL.Interfaces;
using Store.DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Store.DAL.Repositories;

public class BrandRepository : IBrandRepository
{
    private readonly AppDbContext _context;
    public BrandRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Brand>> GetAllAsync()
    {
        return await _context.Brands
            .Where(b => b.IsActive != false)
            .ToListAsync();
    }

    public Task<Brand?> GetByIdAsync(int id)
    {
        return _context.Brands
            .FirstOrDefaultAsync(b => b.Id == id && b.IsActive != false);
    }

    public async Task<Brand> CreateAsync(Brand brand)
    {
        brand.IsActive ??= true;
        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();
        return brand;
    }

    public async Task<Brand> UpdateAsync(Brand brand)
    {
        _context.Brands.Update(brand);
        await _context.SaveChangesAsync();
        return brand;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var brand = await _context.Brands
            .FirstOrDefaultAsync(b => b.Id == id && b.IsActive != false);

        if (brand is null)
        {
            return false;
        }

        brand.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}