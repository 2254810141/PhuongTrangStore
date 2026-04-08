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
    
    public async Task<IEnumerable<ProductDto>>GetAllAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Select(ProductDataDto);
    }

    public async Task<IEnumerable<ProductDto>> SearchByNameAsync(string keyword)
    {

        var products = await _productRepository.SearchByNameAsync(keyword.Trim());
        return products.Select(ProductDataDto);
    }

    public async Task<ProductDto?> UpdateAsync(int productId, UpdateProductRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ProductName))
        {
            throw new ArgumentException("Ten san pham khong duoc de trong.");
        }

        if (request.Price < 0)
        {
            throw new ArgumentException("Gia san pham khong hop le.");
        }

        if (request.StockQuantity.HasValue && request.StockQuantity.Value < 0)
        {
            throw new ArgumentException("So luong ton kho khong hop le.");
        }
        

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
    
    public static ProductDto ProductDataDto(Product p) => new()
    {
        ProductId = p.ProductId,
        ProductName = p.ProductName,
        Price = p.Price,
        StockQuantity = p.StockQuantity,
        ProductsImages = p.ProductsImages,
        IsActive = p.IsActive
    };
}