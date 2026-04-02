namespace StartComputer.DAL.Interfaces;
using Server.Models;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
}