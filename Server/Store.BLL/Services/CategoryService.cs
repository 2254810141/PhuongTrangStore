using Store.BLL.DTOs.Category;
using Store.BLL.Interfaces;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.BLL.Services;

public class CategoryService : ICategoryService
{
    private readonly IcategoryRepository _categoryRepository;

    public CategoryService(IcategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllCategories();
        return categories.Select(MapToDto);
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        if (id <= 0) throw new ArgumentException("Invalid category id.");

        var category = await _categoryRepository.GetCategoryById(id);
        return category is null ? null : MapToDto(category);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("The category name cannot be left blank.");

        var category = new Category
        {
            Name = request.Name.Trim(),
            IsActive = request.IsActive ?? true
        };

        var created = await _categoryRepository.CreateAsync(category);
        return MapToDto(created);
    }

    public async Task<CategoryDto?> UpdateAsync(int id, UpdateCategoryRequest request)
    {
        if (id <= 0) throw new ArgumentException("Invalid category id.");

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("The category name cannot be left blank.");

        var category = await _categoryRepository.GetCategoryById(id);
        if (category is null) return null;

        category.Name = request.Name.Trim();
        if (request.IsActive.HasValue)
        {
            category.IsActive = request.IsActive.Value;
        }

        var updated = await _categoryRepository.UpdateAsync(category);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (id <= 0) throw new ArgumentException("Invalid category id.");
        return await _categoryRepository.DeleteAsync(id);
    }

    private static CategoryDto MapToDto(Category category) => new()
    {
        Id = category.Id,
        Name = category.Name,
        IsActive = category.IsActive
    };
}


