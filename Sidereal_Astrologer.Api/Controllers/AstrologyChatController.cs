using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.AskAstrologyQuestion;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.GetChatHistory;

namespace Sidereal_Astrologer.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AstrologyChatController : ControllerBase
    {
        private readonly IAskAstrologyQuestionHandler _askQuestionHandler;
        private readonly IGetChatHistoryHandler _getHistoryHandler;

        public AstrologyChatController(
            IAskAstrologyQuestionHandler askQuestionHandler,
            IGetChatHistoryHandler getHistoryHandler)
        {
            _askQuestionHandler = askQuestionHandler;
            _getHistoryHandler = getHistoryHandler;
        }

        /// <summary>
        /// Ask a question about Sidereal astrology and receive an interpretation processed via MCP.
        /// </summary>
        [HttpPost("ask")]
        [ProducesResponseType(typeof(AskAstrologyQuestionResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AskQuestion(
            [FromBody] AskAstrologyQuestionRequest request,
            CancellationToken cancellationToken)
        {
            var result = await _askQuestionHandler.HandleAsync(request, cancellationToken);

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }

            if (result.IsValidationError)
            {
                return BadRequest(new { message = result.Message });
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new { message = result.Message });
        }

        /// <summary>
        /// Retrieve past astrological queries and readings for a user.
        /// </summary>
        [HttpGet("history/{userId:int}")]
        [ProducesResponseType(typeof(GetChatHistoryResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetHistory(
            int userId,
            [FromQuery] int limit = 50,
            CancellationToken cancellationToken = default)
        {
            var query = new GetChatHistoryQuery { UserId = userId, Limit = limit };
            var result = await _getHistoryHandler.HandleAsync(query, cancellationToken);

            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new { message = result.Message });
        }

        /// <summary>
        /// Health check for the Sidereal Astrology API.
        /// </summary>
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new
            {
                status = "Healthy",
                service = "Sidereal Astrology API & MCP Orchestrator",
                timestamp = System.DateTime.UtcNow
            });
        }
    }
}
