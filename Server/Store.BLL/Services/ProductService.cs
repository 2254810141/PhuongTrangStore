using Store.BLL.Interfaces;
using Store.DAL.Interfaces;
using Store.BLL.DTOs.Product;
using Store.DAL.Models;

namespace Store.BLL.Services;

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
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("The product name cannot be left blank.");

        if (request.Price.HasValue && request.Price.Value < 0)
            throw new ArgumentException("Invalid product price.");

        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null) return null;

        product.CategoryId = request.CategoryId;
        product.BrandId = request.BrandId;
        product.Name = request.Name.Trim();
        product.Price = request.Price;
        product.IsContactPrice = request.IsContactPrice;
        product.IsActive = request.IsActive;
        product.Image = request.Image;
        product.Description = request.Description;

        var updated = await _productRepository.UpdateAsync(product);
        return ProductDataDto(updated);
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest request)
    {
        if (request.Price.HasValue && request.Price.Value < 0)
            throw new ArgumentException("Invalid product price.");

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("The product name cannot be left blank.");

        var product = new Product
        {
            CategoryId = request.CategoryId,
            BrandId = request.BrandId,
            Name = request.Name.Trim(),
            Price = request.Price,
            IsContactPrice = request.IsContactPrice ?? false,
            IsActive = request.IsActive ?? true,
            Image = request.Image,
            Description = request.Description
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
        Id = p.Id,
        CategoryId = p.CategoryId,
        BrandId = p.BrandId,
        Name = p.Name,
        Price = p.Price,
        IsContactPrice = p.IsContactPrice,
        IsActive = p.IsActive,
        Image = p.Image,
        Description = p.Description
    };
}

