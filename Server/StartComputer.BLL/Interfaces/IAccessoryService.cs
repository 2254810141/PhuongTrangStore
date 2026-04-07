namespace StartComputer.BLL.Interfaces;
using StartComputer.BLL.DTOs;

public interface IAccessoryService
{
    Task<IEnumerable<AccessoryDto>> GetAllAsync();
    Task<IEnumerable<AccessoryDto>> GetByKeywordAsync(string? keyword);
}