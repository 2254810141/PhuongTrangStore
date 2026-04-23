using Store.DAL.Models;

namespace Store.DAL.Interfaces;

public interface IBrandRepository
{
    Task<IEnumerable<Brand>> GetAllAsync();
    Task<Brand?> GetByIdAsync(int id);
    Task<Brand> CreateAsync(Brand brand);
    Task<Brand> UpdateAsync(Brand brand);
    Task<bool> DeleteAsync(int id);
}