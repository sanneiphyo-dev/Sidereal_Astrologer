using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sidereal_Astrologer.Domain.Features.Auth;

namespace Sidereal_Astrologer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Register a new Seeker account with birth chart coordinates.
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
        {
            var result = await _authService.RegisterAsync(request, cancellationToken);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(new { message = result.Message });
        }

        /// <summary>
        /// Authenticate a user by email/username and password.
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
        {
            var result = await _authService.LoginAsync(request, cancellationToken);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(new { message = result.Message });
        }

        /// <summary>
        /// Get user profile by user id.
        /// </summary>
        [HttpGet("me/{userId:int}")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProfile(int userId, CancellationToken cancellationToken)
        {
            var result = await _authService.GetProfileAsync(userId, cancellationToken);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return NotFound(new { message = result.Message });
        }
    }
}
