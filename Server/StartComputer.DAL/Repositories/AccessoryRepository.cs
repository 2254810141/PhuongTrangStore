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
        return await _context.Accessories.ToListAsync();
    }

    public async Task<IEnumerable<Accessory>> SearchByNameAsync(string keyword)
    {
        var key = keyword.Trim();
        return await _context.Accessories.Where(a => a.AccessoryName.Contains(key)).ToListAsync();
    }
}