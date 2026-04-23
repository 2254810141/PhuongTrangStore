namespace Store.BLL.DTOs.Brand;

public class UpdateBrandRequest
{
    public string Name { get; set; } = string.Empty;
    public bool? IsActive { get; set; }
}

