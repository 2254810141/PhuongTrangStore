namespace Store.BLL.DTOs.User;

public class UserDto
{
    public int Id { get; set; }
    
    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string Role { get; set; } = null!;
}
