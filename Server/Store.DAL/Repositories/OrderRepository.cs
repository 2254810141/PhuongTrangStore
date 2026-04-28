using Microsoft.EntityFrameworkCore;
using Store.DAL.Interfaces;
using Store.DAL.Models;

namespace Store.DAL.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    private static readonly HashSet<string> PendingStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "draft",
        "pending_confirm",
        "pending_payment"
    };

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetProductsByIdsAsync(IEnumerable<int> productIds)
    {
        var ids = productIds.Distinct().ToList();
        return await _context.Products
            .Where(p => ids.Contains(p.Id))
            .ToListAsync();
    }

    public async Task CreateOrderWithItemsAsync(Order order, IEnumerable<OrderItem> orderItems, IEnumerable<Cart>? cartsToClear = null)
    {
        await UpsertOrderWithItemsAsync(order, orderItems, cartsToClear);
    }

    public async Task UpsertOrderWithItemsAsync(Order order, IEnumerable<OrderItem> orderItems, IEnumerable<Cart>? cartsToClear = null)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        var normalizedItems = orderItems.ToList();

        if (order.Id <= 0)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
        }
        else
        {
            if (_context.Entry(order).State == EntityState.Detached)
            {
                _context.Orders.Attach(order);
            }

            _context.Entry(order).State = EntityState.Modified;

            var existingItems = order.OrderItems.ToList();
            if (existingItems.Count > 0)
            {
                _context.OrderItems.RemoveRange(existingItems);
            }

            await _context.SaveChangesAsync();
        }

        foreach (var item in normalizedItems)
        {
            item.OrderId = order.Id;
        }

        await _context.OrderItems.AddRangeAsync(normalizedItems);

        if (cartsToClear is not null)
        {
            _context.Carts.RemoveRange(cartsToClear);
        }

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    }

    public async Task<Order?> GetLatestPendingOrderByUserIdAsync(int userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId && o.Status != null && PendingStatuses.Contains(o.Status))
            .OrderByDescending(o => o.CreatedAt)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Order>> GetOrdersByEmailAsync(string email)
    {
        var normalizedEmail = email.Trim();

        return await _context.Orders
            .Where(o =>  o.CustomerEmail != null && o.CustomerEmail == normalizedEmail)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Order>> GetOrdersByUserIdAsync(int userId)
    {
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetOrderWithItemsAsync(int orderId)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);
    }

    public async Task<Order?> GetOrderWithItemsByUserIdAsync(int orderId, int userId)
    {
        return await _context.Orders
            .Where(o => o.Id == orderId && o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
