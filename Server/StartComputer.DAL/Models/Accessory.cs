using System;
using System.Collections.Generic;

namespace StartComputer.DAL.Models;

public partial class Accessory
{
    public int AccessoryId { get; set; }

    public string AccessoryName { get; set; } = null!;

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public decimal Price { get; set; }

    public int? StockQuantity { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
