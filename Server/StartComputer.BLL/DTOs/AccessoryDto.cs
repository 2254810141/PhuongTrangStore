namespace StartComputer.BLL.DTOs;

public class AccessoryDto
{
    public int AccessoryId { get; set; }

    public string AccessoryName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? ImageUrl { get; set; }

    public decimal Price { get; set; }

    public int? StockQuantity { get; set; }

    public bool? IsActive { get; set; }
}