using Store.BLL.DTOs.User;

namespace Store.BLL.Interfaces;

public interface IUserService
{
    Task<UserDto>CreateAsync(CreateUserRequest request);
    Task<UserDto> RegisterAdminAsync(AdminRegisterRequest request);
    Task<LoginUserRespond> LoginAsync(LoginUserRequest request);
    Task<LoginUserRespond> LoginAdminAsync(LoginUserRequest request);
    Task<LoginUserRespond> RefreshAsync(RefreshTokenRequest request);
    Task LogoutAsync(RefreshTokenRequest request);

}
