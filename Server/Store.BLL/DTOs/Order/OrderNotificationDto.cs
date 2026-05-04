namespace Store.BLL.DTOs.Order;

public class OrderNotificationDto
{
    public int OrderId { get; set; }
    public string? OrderCode { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public string? ShippingAddress { get; set; }
    public decimal TotalAmount { get; set; }
    public string? PaymentMethod { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? ItemCount { get; set; }
}

