using System;
using System.Collections.Generic;

namespace Server.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public int BrandId { get; set; }

    public string ProductName { get; set; } = null!;

    public decimal Price { get; set; }

    public int? StockQuantity { get; set; }

    public string? ProductsImages { get; set; }

    public bool? IsActive { get; set; }

    public virtual Brand Brand { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ProductSpec? ProductSpec { get; set; }
}
