using StartComputer.BLL.DTOs;
using StartComputer.BLL.Interfaces;
using StartComputer.DAL.Interfaces;
using StartComputer.DAL.Models;

namespace StartComputer.BLL.Services;

public class AccessoryService : IAccessoryService
{
    private readonly IAccessoryRepository _accessoryRepository;

    public AccessoryService(IAccessoryRepository accessoryRepository)
    {
        _accessoryRepository = accessoryRepository;
    }

    public async Task<IEnumerable<AccessoryDto>> GetAllAsync()
    {
        var accessories = await _accessoryRepository.GetAllAsync();
        return accessories.Select(MapToDto);
    }

    public async Task<IEnumerable<AccessoryDto>> GetByKeywordAsync(string? keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return await GetAllAsync();
        }

        var result = await _accessoryRepository.SearchByNameAsync(keyword.Trim());
        return result.Select(MapToDto);
    }

    private static AccessoryDto MapToDto(Accessory p) => new()
    {
        AccessoryId = p.AccessoryId,
        AccessoryName = p.AccessoryName,
        Description = p.Description,
        ImageUrl = p.ImageUrl,
        Price = p.Price,
        StockQuantity = p.StockQuantity,
        IsActive = p.IsActive
    };
}