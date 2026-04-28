using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Store.BLL.DTOs.Order;

public class CheckoutCodRequest
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

public class CheckoutItemRequest
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, 999)]
    public int Quantity { get; set; }
}

public class CheckoutCodGuestRequest
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

    [MinLength(1)]
    public List<CheckoutItemRequest> Items { get; set; } = new();
}

public class CheckoutResultDto
{
    public int OrderId { get; set; }
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

public class OrderItemSummaryDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public string? ProductImage { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class OrderSummaryDto
{
    public int OrderId { get; set; }
    public decimal TotalAmount { get; set; }
    public string PaymentMethod { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public List<OrderItemSummaryDto> Items { get; set; } = new();
}

public class UpdateOrderStatusRequest
{
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = null!;
}

public class OrderLookupRequest
{
    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = null!;
}

