namespace Store.BLL.DTOs.User;

public class CreateUserRequest
{
    public string FullName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Phone { get; set; }

    public string? AdminRegistrationCode { get; set; }
}
