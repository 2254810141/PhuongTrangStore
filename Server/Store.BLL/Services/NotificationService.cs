using Store.BLL.DTOs.Notification;
using Store.BLL.Interfaces;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.BLL.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;

    public NotificationService(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<UnreadNotificationResultDto> GetUnreadAsync(int take = 5)
    {
        var unreadNotifications = await _notificationRepository.GetUnreadAsync();
        var count = unreadNotifications.Count;

        var items = unreadNotifications
            .Take(Math.Max(1, take))
            .Select(MapToDto)
            .ToList();

        return new UnreadNotificationResultDto
        {
            Count = count,
            Items = items
        };
    }

    public async Task<NotificationDto?> GetByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("NotificationId không hợp lệ.");
        }

        var notification = await _notificationRepository.GetByIdAsync(id);
        return notification is null ? null : MapToDto(notification);
    }

    public async Task<NotificationDto> CreateAsync(CreateNotificationRequest request)
    {
        if (request is null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            throw new ArgumentException("Title là bắt buộc.");
        }

        if (string.IsNullOrWhiteSpace(request.Message))
        {
            throw new ArgumentException("Message là bắt buộc.");
        }

        var entity = new Notification
        {
            Title = request.Title.Trim(),
            Message = request.Message.Trim(),
            OrderId = request.OrderId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _notificationRepository.AddAsync(entity);
        return MapToDto(created);
    }

    public async Task<int> MarkAsReadAsync(int? id)
    {
        return id.HasValue
            ? await _notificationRepository.MarkAsReadAsync(id.Value)
            : await _notificationRepository.MarkAllAsReadAsync();
    }

    private static NotificationDto MapToDto(Notification notification)
    {
        return new NotificationDto
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            OrderId = notification.OrderId,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
    }
}

