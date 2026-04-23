using Store.BLL.DTOs.Product;
namespace Store.BLL.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync();
    Task<ProductDto?> GetByIdAsync(int productId);
    Task<IEnumerable<ProductDto>> SearchByNameAsync(string keyword);
    Task<ProductDto?> UpdateAsync(int productId, UpdateProductRequest request);
    Task<ProductDto> CreateAsync(CreateProductRequest request);
    Task<bool> DeleteAsync(int productId);
}
