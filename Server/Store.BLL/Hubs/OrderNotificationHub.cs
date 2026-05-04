using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Store.BLL.Hubs;

[Authorize(Roles = "admin")]
public class OrderNotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        // Thêm admin vào group "Admins" khi kết nối
        await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Xóa admin khỏi group khi ngắt kết nối
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Admins");
        await base.OnDisconnectedAsync(exception);
    }

    // Client có thể gọi để test connection
    public async Task SendMessage(string message)
    {
        await Clients.Caller.SendAsync("ReceiveMessage", message);
    }
}

