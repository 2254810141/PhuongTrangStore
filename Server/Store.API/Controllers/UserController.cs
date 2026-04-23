using Microsoft.AspNetCore.Mvc;
using Store.BLL.Interfaces;
using Store.BLL.DTOs.User;

namespace Store.API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
        private readonly IUserService _userService;
    
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
    
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> RegisterAsync([FromBody] CreateUserRequest request)
        {
            try
            {
                var createdUser = await _userService.CreateAsync(request);
                return StatusCode(StatusCodes.Status201Created, createdUser);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Backward-compatible alias for older clients.
        [HttpPost("create")]
        public Task<ActionResult<UserDto>> CreateAsync([FromBody] CreateUserRequest request)
        {
            return RegisterAsync(request);
        }

        [HttpPost("admin/register")]
        public async Task<ActionResult<UserDto>> RegisterAdminAsync([FromBody] AdminRegisterRequest request)
        {
            try
            {
                var createdUser = await _userService.RegisterAdminAsync(request);
                return StatusCode(StatusCodes.Status201Created, createdUser);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("login")]
                public async Task<ActionResult<LoginUserRespond>> LoginAsync([FromBody] LoginUserRequest request)
        {
            try
            {
                var user = await _userService.LoginAsync(request);
                return Ok(user);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("admin/login")]
        public async Task<ActionResult<LoginUserRespond>> LoginAdminAsync([FromBody] LoginUserRequest request)
        {
            try
            {
                var user = await _userService.LoginAdminAsync(request);
                return Ok(user);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<LoginUserRespond>> RefreshAsync([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var tokens = await _userService.RefreshAsync(request);
                return Ok(tokens);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogoutAsync([FromBody] RefreshTokenRequest request)
        {
            try
            {
                await _userService.LogoutAsync(request);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
}
