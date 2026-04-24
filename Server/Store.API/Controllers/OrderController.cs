using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.BLL.DTOs.Order;
using Store.BLL.Interfaces;

namespace Store.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [Authorize]
    [HttpPost("checkout/cod")]
    public async Task<ActionResult<CheckoutResultDto>> CheckoutCodAsync([FromBody] CheckoutCodRequest request)
    {
        try
        {
            var userId = GetUserId();
            var result = await _orderService.CheckoutCodAsync(userId, request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("checkout/cod/guest")]
    public async Task<ActionResult<CheckoutResultDto>> CheckoutCodGuestAsync([FromBody] CheckoutCodGuestRequest request)
    {
        try
        {
            var result = await _orderService.CheckoutCodGuestAsync(request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<OrderSummaryDto>>> GetMyOrdersAsync()
    {
        try
        {
            var userId = GetUserId();
            var orders = await _orderService.GetMyOrdersAsync(userId);
            return Ok(orders);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("my/{orderId:int}")]
    public async Task<ActionResult<OrderSummaryDto>> GetMyOrderByIdAsync(int orderId)
    {
        try
        {
            var userId = GetUserId();
            var order = await _orderService.GetMyOrderByIdAsync(userId, orderId);
            if (order is null) return NotFound();
            return Ok(order);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "admin")]
    [HttpGet("{orderId:int}")]
    public async Task<ActionResult<OrderSummaryDto>> GetOrderByIdAsync(int orderId)
    {
        try
        {
            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order is null) return NotFound();
            return Ok(order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "admin")]
    [HttpPatch("{orderId:int}/status")]
    public async Task<IActionResult> UpdateOrderStatusAsync(int orderId, [FromBody] UpdateOrderStatusRequest request)
    {
        try
        {
            await _orderService.UpdateOrderStatusAsync(orderId, request);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)
                          ?? User.FindFirst(JwtRegisteredClaimNames.Sub)
                          ?? User.FindFirst("sub");

        return int.TryParse(userIdClaim?.Value, out var userId) ? userId : 0;
    }
}
