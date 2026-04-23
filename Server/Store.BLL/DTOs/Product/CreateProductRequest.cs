namespace Store.BLL.DTOs.Product;

public class CreateProductRequest
{
    public int? CategoryId { get; set; }
    public int? BrandId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal? Price { get; set; }
    public bool? IsContactPrice { get; set; }
    public bool? IsActive { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
}
