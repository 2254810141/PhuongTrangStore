using StartComputer.BLL.Interfaces;
using StartComputer.DAL.Interfaces;
using StartComputer.BLL.DTOs;
using Server.Models;


namespace StartComputer.BLL.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }
    
    public async Task<IEnumerable<ProductDto>>GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Select(p => new ProductDto
        {
            ProductId = p.ProductId,
            ProductName = p.ProductName,
            Price = p.Price,
            StockQuantity = p.StockQuantity,
            ProductsImages = p.ProductsImages,
            IsActive = p.IsActive
        });
    }
}