using System;
using System.Collections.Generic;

namespace Store.DAL.Models;

public partial class Cart
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}

