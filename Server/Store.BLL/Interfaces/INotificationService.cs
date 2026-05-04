using Store.BLL.DTOs.Notification;

namespace Store.BLL.Interfaces;

public interface INotificationService
{
    Task<UnreadNotificationResultDto> GetUnreadAsync(int take = 5);
    Task<NotificationDto?> GetByIdAsync(int id);
    Task<NotificationDto> CreateAsync(CreateNotificationRequest request);
    Task<int> MarkAsReadAsync(int? id);
}

