using StartComputer.BLL.Interfaces;
using StartComputer.DAL.Interfaces;
using StartComputer.BLL.DTOs;
using StartComputer.DAL.Models;

namespace StartComputer.BLL.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Select(ProductDataDto);
    }

    public async Task<ProductDto?> GetByIdAsync(int productId)
    {
        if (productId <= 0) throw new ArgumentException("Invalid product id.");
        var product = await _productRepository.GetByIdAsync(productId);
        return product is null ? null : ProductDataDto(product);
    }

    public async Task<IEnumerable<ProductDto>> SearchByNameAsync(string keyword)
    {
        var products = await _productRepository.SearchByNameAsync(keyword.Trim());
        return products.Select(ProductDataDto);
    }

    public async Task<ProductDto?> UpdateAsync(int productId, UpdateProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ProductName))
            throw new ArgumentException("The product name cannot be left blank.");

        if (request.Price < 0)
            throw new ArgumentException("Invalid product price.");

        if (request.StockQuantity.HasValue && request.StockQuantity.Value < 0)
            throw new ArgumentException("Invalid inventory quantity.");

        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null) return null;

        product.BrandId = request.BrandId;
        product.ProductName = request.ProductName.Trim();
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.ProductsImages = request.ProductsImages;
        product.IsActive = request.IsActive;

        var updated = await _productRepository.UpdateAsync(product);
        return ProductDataDto(updated);
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest request)
    {
        if (request.Price < 0) throw new ArgumentException("Invalid product price.");
        if (string.IsNullOrWhiteSpace(request.ProductName))
            throw new ArgumentException("The product name cannot be left blank.");
        if (request.StockQuantity.HasValue && request.StockQuantity.Value < 0)
            throw new ArgumentException("Invalid inventory quantity.");

        var product = new Product
        {
            BrandId = request.BrandId,
            ProductName = request.ProductName.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            ProductsImages = request.ProductsImages,
            IsActive = request.IsActive ?? true
        };

        var created = await _productRepository.CreateAsync(product);
        return ProductDataDto(created);
    }

    public async Task<bool> DeleteAsync(int productId)
    {
        if (productId <= 0) throw new ArgumentException("Invalid product id.");
        return await _productRepository.DeleteAsync(productId);
    }

    private static ProductDto ProductDataDto(Product p) => new()
    {
        ProductId = p.ProductId,
        ProductName = p.ProductName,
        Price = p.Price,
        StockQuantity = p.StockQuantity,
        ProductsImages = p.ProductsImages,
        IsActive = p.IsActive
    };
}
