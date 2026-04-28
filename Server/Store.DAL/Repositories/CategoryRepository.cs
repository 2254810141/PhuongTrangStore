using Microsoft.EntityFrameworkCore;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.DAL.Repositories;

public class CategoryRepository : IcategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllCategories()
    {
        return await _context.Categories
            .Where(c => c.IsActive == true)
            .ToListAsync();
    }

    public Task<Category?> GetCategoryById(int id)
    {
        return _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive == true);
    }

    public async Task<Category> CreateAsync(Category category)
    {
        category.IsActive ??= true;
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<Category> UpdateAsync(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive == true);

        if (category is null)
        {
            return false;
        }

        category.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}

