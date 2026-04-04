namespace StartComputer.DAL.Interfaces;
using StartComputer.DAL.Models;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
}