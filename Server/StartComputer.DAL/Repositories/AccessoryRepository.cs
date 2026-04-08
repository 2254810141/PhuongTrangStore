namespace StartComputer.DAL.Repositories;
using StartComputer.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using StartComputer.DAL.Models;

public class AccessoryRepository : IAccessoryRepository
{
    private readonly AppDbContext _context;

    public AccessoryRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<Accessory>> GetAllAsync()
    {
        return await _context.Accessories.Where(p => p.IsActive == true) .ToListAsync();
    }

    public async Task<IEnumerable<Accessory>> SearchByNameAsync(string keyword)
    {
        var key = keyword.Trim();
        return await _context.Accessories.Where(a => a.AccessoryName.Contains(key) && a.IsActive == true).ToListAsync();
    }

    public async Task<Accessory?> GetByIdAsync(int accessoryId)
    {
        return await _context.Accessories.Where(a => a.AccessoryId == accessoryId).FirstOrDefaultAsync();
    }

    public async Task<Accessory?> CreateAsync(Accessory accessory)
    {
        _context.Accessories.Add(accessory);
        await _context.SaveChangesAsync();
        return accessory;
    }

    public async Task<Accessory?> UpdateAsync(Accessory accessory)
    {
        _context.Accessories.Update(accessory);
        await _context.SaveChangesAsync();
        return accessory;
    }

    public async Task<bool> DeleteAsync(int accessoryId)
    {
        var accessory = await _context.Accessories.FirstOrDefaultAsync(p => p.AccessoryId == accessoryId && p.IsActive == true);
        if (accessory is null) return false;
        
        accessory.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }
}