using System;
using System.Collections.Generic;

namespace StartComputer.DAL.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public string OrderCode { get; set; } = null!;

    public Guid UserId { get; set; }

    public decimal TotalAmount { get; set; }

    public string? Status { get; set; }

    public string ShippingAddress { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual User User { get; set; } = null!;
}
