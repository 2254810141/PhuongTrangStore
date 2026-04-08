namespace StartComputer.DAL.Interfaces;
using StartComputer.DAL.Models;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<IEnumerable<Product>> SearchByNameAsync(string keyword);
    Task<Product?> GetByIdAsync(int productId);
    Task<Product>UpdateAsync(Product product);
    Task<Product> CreateAsync(Product product);
    Task<bool> DeleteAsync(int productId);
}