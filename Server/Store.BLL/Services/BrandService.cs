using Store.BLL.DTOs.Brand;
using Store.BLL.Interfaces;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.BLL.Services;

public class BrandService : IBrandService
{
    private readonly IBrandRepository _brandRepository;

    public BrandService(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;
    }

    public async Task<IEnumerable<BrandDto>> GetAllAsync()
    {
        var brands = await _brandRepository.GetAllAsync();
        return brands.Select(MapToDto);
    }

    public async Task<BrandDto?> GetByIdAsync(int id)
    {
        if (id <= 0) throw new ArgumentException("Invalid brand id.");

        var brand = await _brandRepository.GetByIdAsync(id);
        return brand is null ? null : MapToDto(brand);
    }

    public async Task<BrandDto> CreateAsync(CreateBrandRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("The brand name cannot be left blank.");

        var brand = new Brand
        {
            Name = request.Name.Trim(),
            IsActive = request.IsActive ?? true
        };

        var created = await _brandRepository.CreateAsync(brand);
        return MapToDto(created);
    }

    public async Task<BrandDto?> UpdateAsync(int id, UpdateBrandRequest request)
    {
        if (id <= 0) throw new ArgumentException("Invalid brand id.");

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("The brand name cannot be left blank.");

        var brand = await _brandRepository.GetByIdAsync(id);
        if (brand is null) return null;

        brand.Name = request.Name.Trim();
        if (request.IsActive.HasValue)
        {
            brand.IsActive = request.IsActive.Value;
        }

        var updated = await _brandRepository.UpdateAsync(brand);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (id <= 0) throw new ArgumentException("Invalid brand id.");
        return await _brandRepository.DeleteAsync(id);
    }

    private static BrandDto MapToDto(Brand brand) => new()
    {
        Id = brand.Id,
        Name = brand.Name,
        IsActive = brand.IsActive
    };
}


