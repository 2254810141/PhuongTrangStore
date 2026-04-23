using System;
using System.Collections.Generic;

namespace Store.DAL.Models;

public partial class Order
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string CustomerName { get; set; } = null!;

    public string CustomerPhone { get; set; } = null!;

    public string? CustomerEmail { get; set; }

    public string ShippingAddress { get; set; } = null!;

    public decimal? TotalAmount { get; set; }

    public string? PaymentMethod { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual User? User { get; set; }
}

