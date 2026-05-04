namespace Store.BLL.DTOs.Notification;

public class UnreadNotificationResultDto
{
    public int Count { get; set; }
    public List<NotificationDto> Items { get; set; } = new();
}

