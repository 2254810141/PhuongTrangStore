namespace StartComputer.BLL.DTOs;

public class UpdateProductRequest
{
    public int BrandId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int? StockQuantity { get; set; }
    public string? ProductsImages { get; set; }
    public bool? IsActive { get; set; }
}