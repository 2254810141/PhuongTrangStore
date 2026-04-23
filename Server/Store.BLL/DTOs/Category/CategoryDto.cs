namespace Store.BLL.DTOs.Category;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool? IsActive { get; set; }
}

