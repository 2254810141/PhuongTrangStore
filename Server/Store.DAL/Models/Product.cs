using System;
using System.Collections.Generic;

namespace Store.DAL.Models;

public partial class Product
{
    public int Id { get; set; }

    public int? CategoryId { get; set; }

    public int? BrandId { get; set; }

    public string Name { get; set; } = null!;

    public decimal? Price { get; set; }

    public bool? IsContactPrice { get; set; }

    public bool? IsActive { get; set; }

    public string? Image { get; set; }

    public string? Description { get; set; }

    public virtual Brand? Brand { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();
}
