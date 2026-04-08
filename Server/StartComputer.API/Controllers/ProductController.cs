using Microsoft.AspNetCore.Mvc;
using StartComputer.BLL.DTOs;
using StartComputer.BLL.Interfaces;


namespace StartComputer.API.Controllers;

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

    [HttpGet("search")]
    public async Task<IActionResult> SearchByName([FromQuery] string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return BadRequest("Từ khóa tìm kiếm không được để trống.");
        }

        var products = await _productService.SearchByNameAsync(keyword);
        return Ok(products);
    }

    [HttpPut("{productId:int}")]
    public async Task<IActionResult> Update(int productId, [FromBody] UpdateProductRequest request)
    {
        try
        {
            var updated = await _productService.UpdateAsync(productId, request);
            if (updated is null) return NotFound("Không tìm thấy sản phẩm ");

            return Ok(updated);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}