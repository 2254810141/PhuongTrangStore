using Microsoft.AspNetCore.Mvc;
using StartComputer.BLL.Interfaces;

namespace StartComputer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccessoryController : ControllerBase
{
    private readonly IAccessoryService  _accessoryService;

    public AccessoryController(IAccessoryService accessoryService)
    {
        _accessoryService = accessoryService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var accessories = await _accessoryService.GetAllAsync();
        return Ok(accessories);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchByName([FromQuery] string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return BadRequest("Từ khóa tìm kiếm không được để trống.");
        }

        var accessories = await _accessoryService.SearchByNameAsync(keyword);
        return Ok(accessories);
    }
}