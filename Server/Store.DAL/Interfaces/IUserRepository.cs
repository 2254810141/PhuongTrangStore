namespace Store.DAL.Interfaces;
using Store.DAL.Models;

public interface IUserRepository
{
    Task<User> CreateAsync(User user);
    Task<bool> ExistsByEmailAsync(string email);
    Task<bool> ExistsByRoleAsync(string role);
    Task<User?> GetByEmailAsync(string email);
    Task AddRefreshTokenAsync(RefreshToken refreshToken);
    Task<RefreshToken?> GetRefreshTokenWithUserByHashAsync(string tokenHash);
    Task SaveChangesAsync();
}
