using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.BLL.DTOs.Cart;
using Store.BLL.Interfaces;
using System.Security.Claims;

namespace Store.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return 0;
        return int.Parse(userIdClaim.Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var cart = await _cartService.GetCartAsync(userId);
        return Ok(cart);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        var userId = GetUserId();
        await _cartService.AddToCartAsync(userId, request);
        return Ok(new { message = "Sản phẩm đã được thêm vào giỏ hàng" });
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateQuantity([FromBody] UpdateCartRequest request)
    {
        var userId = GetUserId();
        await _cartService.UpdateCartQuantityAsync(userId, request);
        return Ok(new { message = "Cập nhật số lượng thành công" });
    }

    [HttpDelete("remove/{productId}")]
    public async Task<IActionResult> RemoveFromCart(int productId)
    {
        var userId = GetUserId();
        await _cartService.RemoveFromCartAsync(userId, productId);
        return Ok(new { message = "Đã xóa sản phẩm khỏi giỏ hàng" });
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        await _cartService.ClearCartAsync(userId);
        return Ok(new { message = "Giỏ hàng đã được làm trống" });
    }
}

