using Microsoft.EntityFrameworkCore;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.DAL.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly AppDbContext _context;
    private DbSet<Notification> Notifications => _context.Set<Notification>();

    public NotificationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Notification>> GetUnreadAsync()
    {
        return await Notifications
            .AsNoTracking()
            .Where(notification => !notification.IsRead)
            .OrderByDescending(notification => notification.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync()
    {
        return await Notifications.CountAsync(notification => !notification.IsRead);
    }

    public async Task<Notification?> GetByIdAsync(int id)
    {
        return await Notifications.FirstOrDefaultAsync(notification => notification.Id == id);
    }

    public async Task<List<Notification>> GetLatestUnreadAsync(int take)
    {
        return await Notifications
            .AsNoTracking()
            .Where(notification => !notification.IsRead)
            .OrderByDescending(notification => notification.CreatedAt)
            .Take(take)
            .ToListAsync();
    }

    public async Task<Notification> AddAsync(Notification notification)
    {
        await Notifications.AddAsync(notification);
        await _context.SaveChangesAsync();
        return notification;
    }

    public async Task<int> MarkAsReadAsync(int id)
    {
        var notification = await Notifications.FirstOrDefaultAsync(item => item.Id == id);
        if (notification is null || notification.IsRead)
        {
            return 0;
        }

        notification.IsRead = true;
        await _context.SaveChangesAsync();
        return 1;
    }

    public async Task<int> MarkAllAsReadAsync()
    {
        var unreadNotifications = await Notifications.Where(notification => !notification.IsRead).ToListAsync();
        if (unreadNotifications.Count == 0)
        {
            return 0;
        }

        foreach (var notification in unreadNotifications)
        {
            notification.IsRead = true;
        }

        await _context.SaveChangesAsync();
        return unreadNotifications.Count;
    }
}


