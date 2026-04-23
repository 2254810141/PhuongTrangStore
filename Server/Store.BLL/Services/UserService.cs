using Store.BLL.DTOs.User;
using Store.BLL.Interfaces;
using Store.DAL.Interfaces;
using Store.DAL.Models;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace Store.BLL.Services;

public class UserService : IUserService
{
    private const string AdminRole = "admin";
    private const string CustomerRole = "customer";

    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly string _adminRegistrationCode;

    public UserService(IUserRepository userRepository, ITokenService tokenService, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _adminRegistrationCode = configuration["Admin:RegistrationCode"] ?? string.Empty;
    }

    private static string HashPassword(string password)
    {
        var hashedBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    public async Task<UserDto> CreateAsync(CreateUserRequest request)
    {
        if (request is null) throw new ArgumentException("Invalid request.");
        return await CreateUserByRoleAsync(request, CustomerRole);
    }

    public async Task<UserDto> RegisterAdminAsync(AdminRegisterRequest request)
    {
        if (request is null) throw new ArgumentException("Invalid request.");
        if (string.IsNullOrWhiteSpace(request.AdminRegistrationCode))
            throw new ArgumentException("Admin registration code is required.");
        if (!IsValidAdminRegistrationCode(request.AdminRegistrationCode))
            throw new UnauthorizedAccessException("Invalid admin registration code.");

        var adminRequest = new CreateUserRequest
        {
            FullName = request.FullName,
            Email = request.Email,
            Password = request.Password,
            Phone = request.Phone
        };

        return await CreateUserByRoleAsync(adminRequest, AdminRole);
    }
    

    private async Task<UserDto> CreateUserByRoleAsync(CreateUserRequest request, string role)
    {
        if (request is null) throw new ArgumentException("Invalid request.");
        if (string.IsNullOrWhiteSpace(request.FullName)) throw new ArgumentException("The full name cannot be left blank.");
        if (string.IsNullOrWhiteSpace(request.Email)) throw new ArgumentException("The email cannot be left blank.");
        if (string.IsNullOrWhiteSpace(request.Password)) throw new ArgumentException("The password cannot be left blank.");
        if (string.IsNullOrWhiteSpace(request.Phone)) throw new ArgumentException("The phone number cannot be left blank.");

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        
        if (await _userRepository.ExistsByEmailAsync(normalizedEmail))
             throw new ArgumentException("Email already exists.");

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            Password = HashPassword(request.Password),
            Phone = request.Phone.Trim(),
            Role = role
        };

        var created = await _userRepository.CreateAsync(user);

        return UserDataDto(created);
    }

    private bool IsValidAdminRegistrationCode(string? inputCode)
    {
        if (string.IsNullOrWhiteSpace(inputCode) || string.IsNullOrWhiteSpace(_adminRegistrationCode))
        {
            return false;
        }

        var inputBytes = Encoding.UTF8.GetBytes(inputCode.Trim());
        var configuredBytes = Encoding.UTF8.GetBytes(_adminRegistrationCode.Trim());

        if (inputBytes.Length != configuredBytes.Length)
        {
            return false;
        }

        return CryptographicOperations.FixedTimeEquals(inputBytes, configuredBytes);
    }

    public async Task<LoginUserRespond> LoginAsync(LoginUserRequest request)
    {
        var user = await AuthenticateUserAsync(request);
        return await BuildLoginResponseAsync(user);
    }

    public async Task<LoginUserRespond> LoginAdminAsync(LoginUserRequest request)
    {
        var user = await AuthenticateUserAsync(request);
        if (!string.Equals(user.Role, AdminRole, StringComparison.OrdinalIgnoreCase))
            throw new UnauthorizedAccessException("Admin account is required.");

        return await BuildLoginResponseAsync(user);
    }

    private async Task<User> AuthenticateUserAsync(LoginUserRequest request)
    {
        if (request is null) throw new ArgumentException("Invalid request.");
        if (string.IsNullOrWhiteSpace(request.Email)) throw new ArgumentException("Email is required.");
        if (string.IsNullOrWhiteSpace(request.Password)) throw new ArgumentException("Password is required.");

        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _userRepository.GetByEmailAsync(email);
        if (user is null) throw new UnauthorizedAccessException("Invalid email or password.");

        var incomingHash = HashPassword(request.Password);
        if (!string.Equals(user.Password, incomingHash, StringComparison.Ordinal))
            throw new UnauthorizedAccessException("Invalid email or password.");

        return user;
    }

    private async Task<LoginUserRespond> BuildLoginResponseAsync(User user)
    {
        var (accessToken, expiresAt) = _tokenService.GenerateAccessToken(user);
        var (refreshToken, refreshTokenHash, refreshTokenExpiresAt) = _tokenService.GenerateRefreshToken();

        await _userRepository.AddRefreshTokenAsync(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenHash,
            ExpiresAt = refreshTokenExpiresAt,
            CreatedAt = DateTime.UtcNow
        });
        await _userRepository.SaveChangesAsync();

        return new LoginUserRespond
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = expiresAt,
            User = UserDataDto(user)
        };
    }

    public async Task<LoginUserRespond> RefreshAsync(RefreshTokenRequest request)
    {
        if (request is null) throw new ArgumentException("Invalid request.");
        if (string.IsNullOrWhiteSpace(request.RefreshToken)) throw new ArgumentException("Refresh token is required.");

        var incomingHash = _tokenService.HashRefreshToken(request.RefreshToken);
        var currentToken = await _userRepository.GetRefreshTokenWithUserByHashAsync(incomingHash);
        if (currentToken is null || currentToken.User is null)
            throw new UnauthorizedAccessException("Invalid refresh token.");
        if (currentToken.RevokedAt.HasValue)
            throw new UnauthorizedAccessException("Refresh token has been revoked.");
        if (currentToken.ExpiresAt <= DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token has expired.");

        var user = currentToken.User;
        var (newAccessToken, newAccessTokenExpiresAt) = _tokenService.GenerateAccessToken(user);
        var (newRefreshToken, newRefreshTokenHash, newRefreshTokenExpiresAt) = _tokenService.GenerateRefreshToken();

        currentToken.RevokedAt = DateTime.UtcNow;
        currentToken.ReplacedByTokenHash = newRefreshTokenHash;

        await _userRepository.AddRefreshTokenAsync(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newRefreshTokenHash,
            ExpiresAt = newRefreshTokenExpiresAt,
            CreatedAt = DateTime.UtcNow
        });

        await _userRepository.SaveChangesAsync();

        return new LoginUserRespond
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = newAccessTokenExpiresAt,
            User = UserDataDto(user)
        };
    }

    public async Task LogoutAsync(RefreshTokenRequest request)
    {
        if (request is null) throw new ArgumentException("Invalid request.");
        if (string.IsNullOrWhiteSpace(request.RefreshToken)) throw new ArgumentException("Refresh token is required.");

        var incomingHash = _tokenService.HashRefreshToken(request.RefreshToken);
        var currentToken = await _userRepository.GetRefreshTokenWithUserByHashAsync(incomingHash);
        if (currentToken is null || currentToken.RevokedAt.HasValue)
        {
            return;
        }

        currentToken.RevokedAt = DateTime.UtcNow;
        await _userRepository.SaveChangesAsync();
    }

    private static UserDto UserDataDto(User p) => new()
    {
        Id = p.Id,
        FullName = p.FullName,
        Email = p.Email,
        Phone = p.Phone,
        Role = p.Role
    };

    
}
