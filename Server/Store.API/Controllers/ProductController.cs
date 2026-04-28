using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.BLL.DTOs.Product;
using Store.BLL.Interfaces;

namespace Store.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ICloudinaryUploadService _cloudinaryUploadService;

    public ProductController(IProductService productService, ICloudinaryUploadService cloudinaryUploadService)
    {
        _productService = productService;
        _cloudinaryUploadService = cloudinaryUploadService;
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
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(int productId, [FromForm] UpdateProductFormRequest? form)
    {
        if (form is null) return BadRequest("Invalid data submitted.");

        try
        {
            if (form.ImageFile is not null)
            {
                await using var stream = form.ImageFile.OpenReadStream();
                form.Image = await _cloudinaryUploadService.UploadImageAsync(
                    stream,
                    form.ImageFile.FileName,
                    form.ImageFile.ContentType,
                    "phuongtrang-store/products");
            }

            var updated = await _productService.UpdateAsync(productId, form);
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
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] CreateProductFormRequest? form)
    {
        if (form is null) return BadRequest("Invalid data submitted.");

        try
        {
            if (form.ImageFile is not null)
            {
                await using var stream = form.ImageFile.OpenReadStream();
                form.Image = await _cloudinaryUploadService.UploadImageAsync(
                    stream,
                    form.ImageFile.FileName,
                    form.ImageFile.ContentType,
                    "phuongtrang-store/products");
            }

            var created = await _productService.CreateAsync(form);
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

