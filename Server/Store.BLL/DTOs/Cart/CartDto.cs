using System.ComponentModel.DataAnnotations;

namespace Store.BLL.DTOs.Cart;

public class CartDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public string? ProductImage { get; set; }
    public decimal ProductPrice { get; set; }
    public int Quantity { get; set; }
}

public class AddToCartRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "ProductId must be greater than 0.")]
    public int ProductId { get; set; }

    [Range(1, 999, ErrorMessage = "Quantity must be between 1 and 999.")]
    public int Quantity { get; set; }
}

public class UpdateCartRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "ProductId must be greater than 0.")]
    public int ProductId { get; set; }

    [Range(0, 999, ErrorMessage = "Quantity must be between 0 and 999.")]
    public int Quantity { get; set; }
}
