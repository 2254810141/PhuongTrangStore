namespace StartComputer.DAL.Interfaces;
using StartComputer.DAL.Models;
public interface IAccessoryRepository
{
    Task<IEnumerable<Accessory>> GetAllAsync();
    Task<IEnumerable<Accessory>>SearchByNameAsync(string keyword);
    Task<Accessory?> GetByIdAsync(int accessoryId);
    Task<Accessory?> CreateAsync(Accessory accessory);
    Task<Accessory?> UpdateAsync(Accessory accessory);
    Task <bool>DeleteAsync(int accessoryId);
}