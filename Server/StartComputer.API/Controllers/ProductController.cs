using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using StartComputer.BLL.Interfaces;
using StartComputer.BLL.Services;


namespace StartComputer.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    // constructor
    private readonly IProductService _productService;
    
    // DI trong .net



    public ProductController(IProductService productService)
    {
        _productService = productService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? keyword)
    {
        if (string.IsNullOrEmpty(keyword))
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }
        var searchResult = await _productService.SearchByNameAsync(keyword);
        return Ok(searchResult);
    }
    
}