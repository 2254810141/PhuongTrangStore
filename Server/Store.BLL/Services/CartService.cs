using Store.BLL.DTOs.Cart;
using Store.BLL.Interfaces;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.BLL.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IProductRepository _productRepository;

    public CartService(ICartRepository cartRepository, IProductRepository productRepository)
    {
        _cartRepository = cartRepository;
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<CartDto>> GetCartAsync(int userId)
    {
        EnsureValidUser(userId);
        var cartItems = await _cartRepository.GetCartItemsWithProductAsync(userId);
        return cartItems.Select(c => new CartDto
        {
            Id = c.Id,
            ProductId = c.ProductId,
            ProductName = c.Product.Name,
            ProductImage = c.Product.Image,
            ProductPrice = c.Product.Price ?? 0,
            Quantity = c.Quantity
        });
    }

    public async Task AddToCartAsync(int userId, AddToCartRequest request)
    {
        EnsureValidUser(userId);
        ValidateProductAndQuantity(request.ProductId, request.Quantity, allowZeroQuantity: false);

        var product = await _productRepository.GetByIdAsync(request.ProductId);
        if (product is null)
            throw new ArgumentException("Sản phẩm không tồn tại hoặc đã ngừng bán.");

        var cartItem = await _cartRepository.GetCartItemAsync(userId, request.ProductId);

        if (cartItem != null)
        {
            cartItem.Quantity += request.Quantity;
        }
        else
        {
            await _cartRepository.AddAsync(new Cart
            {
                UserId = userId,
                ProductId = request.ProductId,
                Quantity = request.Quantity
            });
        }

        await _cartRepository.SaveChangesAsync();
    }

    public async Task UpdateCartQuantityAsync(int userId, UpdateCartRequest request)
    {
        EnsureValidUser(userId);
        ValidateProductAndQuantity(request.ProductId, request.Quantity, allowZeroQuantity: true);

        var cartItem = await _cartRepository.GetCartItemAsync(userId, request.ProductId);

        if (cartItem != null)
        {
            if (request.Quantity > 0)
            {
                cartItem.Quantity = request.Quantity;
            }
            else
            {
                _cartRepository.Remove(cartItem);
            }
            await _cartRepository.SaveChangesAsync();
        }
    }

    public async Task RemoveFromCartAsync(int userId, int productId)
    {
        EnsureValidUser(userId);
        if (productId <= 0) throw new ArgumentException("ProductId không hợp lệ.");

        var cartItem = await _cartRepository.GetCartItemAsync(userId, productId);

        if (cartItem != null)
        {
            _cartRepository.Remove(cartItem);
            await _cartRepository.SaveChangesAsync();
        }
    }

    public async Task ClearCartAsync(int userId)
    {
        EnsureValidUser(userId);
        var cartItems = await _cartRepository.GetCartItemsWithProductAsync(userId);
        _cartRepository.RemoveRange(cartItems);
        await _cartRepository.SaveChangesAsync();
    }

    private static void EnsureValidUser(int userId)
    {
        if (userId <= 0)
            throw new UnauthorizedAccessException("Invalid user.");
    }

    private static void ValidateProductAndQuantity(int productId, int quantity, bool allowZeroQuantity)
    {
        if (productId <= 0) throw new ArgumentException("ProductId không hợp lệ.");
        if (allowZeroQuantity)
        {
            if (quantity < 0 || quantity > 999)
                throw new ArgumentException("Quantity phải trong khoảng 0..999.");
            return;
        }

        if (quantity <= 0 || quantity > 999)
            throw new ArgumentException("Quantity phải trong khoảng 1..999.");
    }
}
