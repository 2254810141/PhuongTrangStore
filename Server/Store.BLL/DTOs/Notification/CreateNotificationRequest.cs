namespace Store.BLL.DTOs.Notification;

public class CreateNotificationRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int? OrderId { get; set; }
}

