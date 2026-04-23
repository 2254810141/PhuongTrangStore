using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Store.BLL.Interfaces;
using Store.DAL.Models;

namespace Store.BLL.Services;

public class JwtTokenService : ITokenService
{
    private readonly string _jwtKey;
    private readonly string? _issuer;
    private readonly string? _audience;
    private readonly int _accessTokenMinutes;
    private readonly int _refreshTokenDays;

    public JwtTokenService(IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection("Jwt");
        _jwtKey = jwtSection["Key"] ?? throw new InvalidOperationException("Jwt:Key is missing.");
        _issuer = jwtSection["Issuer"];
        _audience = jwtSection["Audience"];
        _accessTokenMinutes = int.TryParse(jwtSection["AccessTokenMinutes"], out var accessMinutes) ? accessMinutes : 60;
        _refreshTokenDays = int.TryParse(jwtSection["RefreshTokenDays"], out var refreshDays) ? refreshDays : 7;
    }

    public (string AccessToken, DateTime ExpiresAt) GenerateAccessToken(User user)
    {
        var expiresAt = DateTime.UtcNow.AddMinutes(_accessTokenMinutes);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(JwtRegisteredClaimNames.Name, user.FullName),
            new(ClaimTypes.Role, string.IsNullOrWhiteSpace(user.Role) ? "customer" : user.Role),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials);

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
        return (accessToken, expiresAt);
    }

    public (string RefreshToken, string RefreshTokenHash, DateTime ExpiresAt) GenerateRefreshToken()
    {
        var bytes = new byte[64];
        RandomNumberGenerator.Fill(bytes);
        var refreshToken = Convert.ToBase64String(bytes);
        var refreshTokenHash = HashRefreshToken(refreshToken);
        var expiresAt = DateTime.UtcNow.AddDays(_refreshTokenDays);
        return (refreshToken, refreshTokenHash, expiresAt);
    }

    public string HashRefreshToken(string refreshToken)
    {
        var hashedBytes = SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken));
        return Convert.ToBase64String(hashedBytes);
    }
}


