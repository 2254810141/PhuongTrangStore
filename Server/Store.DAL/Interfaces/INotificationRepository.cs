using Store.DAL.Models;

namespace Store.DAL.Interfaces;

public interface INotificationRepository
{
    Task<List<Notification>> GetUnreadAsync();
    Task<int> GetUnreadCountAsync();
    Task<Notification?> GetByIdAsync(int id);
    Task<List<Notification>> GetLatestUnreadAsync(int take);
    Task<Notification> AddAsync(Notification notification);
    Task<int> MarkAsReadAsync(int id);
    Task<int> MarkAllAsReadAsync();
}

