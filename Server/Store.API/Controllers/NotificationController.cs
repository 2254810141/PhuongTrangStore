using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.BLL.Interfaces;

namespace Store.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize(Roles = "admin")]
public class NotificationController : ControllerBase
{
	private readonly INotificationService _notificationService;

	public NotificationController(INotificationService notificationService)
	{
		_notificationService = notificationService;
	}

	[HttpGet("unread")]
	public async Task<IActionResult> GetUnreadAsync()
	{
		var result = await _notificationService.GetUnreadAsync(5);
		return Ok(new
		{
			success = true,
			count = result.Count,
			items = result.Items
		});
	}

	[HttpPost("mark-as-read/{id?}")]
	public async Task<IActionResult> MarkAsReadAsync(int? id)
	{
		var updatedCount = await _notificationService.MarkAsReadAsync(id);
		return Ok(new
		{
			success = true,
			updatedCount
		});
	}
}
