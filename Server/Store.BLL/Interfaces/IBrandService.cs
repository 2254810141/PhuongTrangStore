using Store.BLL.DTOs.Brand;

namespace Store.BLL.Interfaces;

public interface IBrandService
{
    Task<IEnumerable<BrandDto>> GetAllAsync();
    Task<BrandDto?> GetByIdAsync(int id);
    Task<BrandDto> CreateAsync(CreateBrandRequest request);
    Task<BrandDto?> UpdateAsync(int id, UpdateBrandRequest request);
    Task<bool> DeleteAsync(int id);
}

