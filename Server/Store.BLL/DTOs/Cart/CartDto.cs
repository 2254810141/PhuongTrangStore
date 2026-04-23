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
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class UpdateCartRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

