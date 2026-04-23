using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Store.BLL.DTOs.Brand;
using Store.BLL.Interfaces;

namespace Store.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandController : ControllerBase
{
    private readonly IBrandService _brandService;

    public BrandController(IBrandService brandService)
    {
        _brandService = brandService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var brands = await _brandService.GetAllAsync();
        return Ok(brands);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var brand = await _brandService.GetByIdAsync(id);
            if (brand is null) return NotFound("No brand found.");
            return Ok(brand);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateBrandRequest? request)
    {
        if (request is null) return BadRequest("Invalid data submitted.");

        try
        {
            var created = await _brandService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBrandRequest? request)
    {
        if (request is null) return BadRequest("Invalid data submitted.");

        try
        {
            var updated = await _brandService.UpdateAsync(id, request);
            if (updated is null) return NotFound("No brand found.");
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var deleted = await _brandService.DeleteAsync(id);
            if (!deleted) return NotFound("No brand found.");
            return Ok("Deleted successfully.");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

