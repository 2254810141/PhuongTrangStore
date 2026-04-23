using Store.DAL.Models;

namespace Store.BLL.Interfaces;

public interface ITokenService
{
    (string AccessToken, DateTime ExpiresAt) GenerateAccessToken(User user);
    (string RefreshToken, string RefreshTokenHash, DateTime ExpiresAt) GenerateRefreshToken();
    string HashRefreshToken(string refreshToken);
}