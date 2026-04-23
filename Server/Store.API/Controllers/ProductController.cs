using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Store.BLL.DTOs.Product;
using Store.BLL.Interfaces;

namespace Store.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllAsync();
        return Ok(products);
    }

    [HttpGet("{productId:int}")]
    public async Task<IActionResult> GetById(int productId)
    {
        try
        {
            var product = await _productService.GetByIdAsync(productId);
            if (product is null) return NotFound("No product found.");
            return Ok(product);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchByName([FromQuery] string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
            return BadRequest("The search keyword must not be left blank.");

        var products = await _productService.SearchByNameAsync(keyword);
        return Ok(products);
    }

    [HttpPut("{productId:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(int productId, [FromBody] UpdateProductRequest? request)
    {
        if (request is null) return BadRequest("Invalid data submitted.");

        try
        {
            var updated = await _productService.UpdateAsync(productId, request);
            if (updated is null) return NotFound("No product found.");
            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest? request)
    {
        if (request is null) return BadRequest("Invalid data submitted.");

        try
        {
            var created = await _productService.CreateAsync(request);
            return CreatedAtAction(nameof(GetById), new { productId = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{productId:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int productId)
    {
        try
        {
            var deleted = await _productService.DeleteAsync(productId);
            if (!deleted) return NotFound("No product found.");
            return Ok("Deleted successfully.");
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

