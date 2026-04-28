using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Store.BLL.DTOs.Payment;

public class CheckoutVnPayRequest
{
    [Required]
    [StringLength(255)]
    public string CustomerName { get; set; } = null!;

    [Required]
    [StringLength(20)]
    public string CustomerPhone { get; set; } = null!;

    [EmailAddress]
    [StringLength(255)]
    public string? CustomerEmail { get; set; }

    [Required]
    public string ShippingAddress { get; set; } = null!;

    public List<int> SelectedProductIds { get; set; } = new();
}

public class CheckoutVnPayResultDto
{
    public int OrderId { get; set; }
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string PaymentUrl { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}

public class VnPayCreatePaymentRequest
{
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string OrderInfo { get; set; } = null!;
    public string ClientIp { get; set; } = "127.0.0.1";
    public string ReturnUrl { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime ExpireAt { get; set; }
}