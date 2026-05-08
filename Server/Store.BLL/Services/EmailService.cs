using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Store.BLL.Interfaces;

namespace Store.BLL.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

     public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        var smtpHost = _configuration["Email:SmtpHost"];
        var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
        var smtpUser = _configuration["Email:Username"];
        var smtpPass = _configuration["Email:Password"];
        var fromEmail = _configuration["Email:FromEmail"];
        var fromName = _configuration["Email:FromName"] ?? "PhuongTrangStore";

        if (string.IsNullOrWhiteSpace(smtpHost) ||
            string.IsNullOrWhiteSpace(smtpUser) ||
            string.IsNullOrWhiteSpace(smtpPass) ||
            string.IsNullOrWhiteSpace(fromEmail))
        {
            throw new InvalidOperationException("Email configuration is incomplete.");
        }

        using var message = new MailMessage
        {
            From = new MailAddress(fromEmail, fromName),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };

        message.To.Add(toEmail);

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            Credentials = new NetworkCredential(smtpUser, smtpPass),
            EnableSsl = true
        };

        await client.SendMailAsync(message);
    }

    public async Task SendOrderEmailsAsync(string? customerEmail, string customerName, int orderId, decimal totalAmount)
    {
        var adminEmail = _configuration["Email:AdminEmail"];

        var subject = $"Đơn hàng mới #{orderId}";
        var body = $@"
            <h3>Xác nhận đơn hàng #{orderId}</h3>
            <p>Khách hàng: <b>{customerName}</b></p>
            <p>Tổng tiền: <b>{totalAmount:n0}</b></p>
            <p>Cảm ơn bạn đã đặt hàng tại Kim Khi Tuấn Ngọc.</p>";

        var tasks = new List<Task>();

        if (!string.IsNullOrWhiteSpace(customerEmail))
        {
            tasks.Add(SendEmailAsync(customerEmail, subject, body));
        }

        if (!string.IsNullOrWhiteSpace(adminEmail))
        {
            var adminBody = $@"
                <h3>ĐƠN HÀNG MỚI</h3>
                <p>Mã đơn: <b>#{orderId}</b></p>
                <p>Khách hàng: <b>{customerName}</b></p>
                <p>Tổng tiền: <b>{totalAmount:n0}</b></p>
                <p>Email khách: {customerEmail ?? "(không có)"}</p>";

            tasks.Add(SendEmailAsync(adminEmail, subject, adminBody));
        }

        await Task.WhenAll(tasks);
    }
}