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
    public async Task<IActionResult> GetAll([FromQuery] string? keyword)
    {
        var accessories = await _accessoryService.GetByKeywordAsync(keyword);
        return Ok(accessories);
    }
}