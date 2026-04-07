using System;
using System.Collections.Generic;

namespace StartComputer.DAL.Models;

public partial class CartItem
{
    public int CartItemId { get; set; }

    public Guid UserId { get; set; }

    public int? ProductId { get; set; }

    public int? AccessoryId { get; set; }

    public int Quantity { get; set; }

    public DateTime? AddedAt { get; set; }

    public virtual Accessory? Accessory { get; set; }

    public virtual Product? Product { get; set; }

    public virtual User User { get; set; } = null!;
}
