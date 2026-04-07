namespace StartComputer.DAL.Interfaces;
using StartComputer.DAL.Models;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<IEnumerable<Product>> SearchByNameAsync(string Keyword);
    Task<Product?> GetByIdAsync(int ProductId);
    Task<Product>UpdateAsync(Product product);

}