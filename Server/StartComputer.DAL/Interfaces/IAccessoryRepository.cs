namespace StartComputer.DAL.Interfaces;
using StartComputer.DAL.Models;
public interface IAccessoryRepository
{
    Task<IEnumerable<Accessory>> GetAllAsync();
    Task<IEnumerable<Accessory>>SearchByNameAsync(string keyword);
}