using Microsoft.AspNetCore.Mvc;
using Store.BLL.Interfaces;

namespace Store.API.Controllers;

[ApiController]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly IVnPayService _vnPayService;
    private readonly IOrderService _orderService;

    public PaymentController(IVnPayService vnPayService, IOrderService orderService)
    {
        _vnPayService = vnPayService;
        _orderService = orderService;
    }

    [HttpGet("vnpay-return")]
    public async Task<IActionResult> VnPayReturn()
    {
        var query = Request.Query.ToDictionary(
            x => x.Key,
            x => x.Value.ToString(),
            StringComparer.OrdinalIgnoreCase);

        if (!_vnPayService.ValidateSignature(query))
        {
            return BadRequest(new
            {
                success = false,
                message = "The VNPAY signature is invalid."
            });
        }

        var responseCode = query.GetValueOrDefault("vnp_ResponseCode");
        var txnRef = query.GetValueOrDefault("vnp_TxnRef");

        if (!int.TryParse(txnRef, out var orderId))
        {
            return BadRequest(new
            {
                success = false,
                message = "Oder code invalid."
            });
        }

        if (responseCode == "00")
        {
            var order = await _orderService.ConfirmVnPayOrderAsync(orderId);
            return Redirect($"http://localhost:5173/orders?payment=success&orderId={orderId}");
            /*
            return Ok(new
            {
                success = true,
                message = "Checkout Vnpay success",
                order
            });
            */
        }

        await _orderService.MarkVnPayOrderFailedAsync(orderId);

        return Redirect($"http://localhost:5173/orders?payment=failed&orderId={orderId}");
        /*
        return Ok(new
        {
            success = false,
            message = "Checkout VNPAY failed or canceled.",
            orderId
        });
        */
    }

    [HttpGet("vnpay-ipn")]
    public async Task<IActionResult> VnPayIpn()
    {
        var query = Request.Query.ToDictionary(
            x => x.Key,
            x => x.Value.ToString(),
            StringComparer.OrdinalIgnoreCase);

        if (!_vnPayService.ValidateSignature(query))
        {
            return Ok(new
            {
                RspCode = "97",
                Message = "Invalid signature"
            });
        }

        var responseCode = query.GetValueOrDefault("vnp_ResponseCode");
        var txnRef = query.GetValueOrDefault("vnp_TxnRef");

        if (!int.TryParse(txnRef, out var orderId))
        {
            return Ok(new
            {
                RspCode = "01",
                Message = "OrderId invalid"
            });
        }

        if (responseCode == "00")
        {
            var order = await _orderService.ConfirmVnPayOrderAsync(orderId);

            if (order is null)
            {
                return Ok(new
                {
                    RspCode = "01",
                    Message = "Order not found"
                });
            }

            return Ok(new
            {
                RspCode = "00",
                Message = "Confirm Success"
            });
        }

        return Ok(new
        {
            RspCode = "00",
            Message = "Payment failed but IPN received"
        });
    }
}
