namespace Store.BLL.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string htmlBody);
    Task SendOrderEmailsAsync(string? customerEmail, string customerName, int orderId, decimal totalAmount);
}