using System;

namespace Store.DAL.Models;

public partial class Notification
{
	public int Id { get; set; }

	public string Title { get; set; } = null!;

	public string Message { get; set; } = null!;

	public int? OrderId { get; set; }

	public bool IsRead { get; set; }

	public DateTime CreatedAt { get; set; }

	public virtual Order? Order { get; set; }
}
