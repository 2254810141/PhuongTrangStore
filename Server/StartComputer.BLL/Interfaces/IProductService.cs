using StartComputer.BLL.DTOs;
namespace StartComputer.BLL.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync();
    Task<IEnumerable<ProductDto>> GetByKeywordAsync(string? keyword);
    Task<ProductDto?> UpdateAsync(int productId, UpdateProductRequest request);
}