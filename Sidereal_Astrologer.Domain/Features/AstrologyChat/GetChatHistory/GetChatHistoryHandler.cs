using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sidereal_Astrologer.Database.AppDbContextModels;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.GetChatHistory
{
    public interface IGetChatHistoryHandler
    {
        Task<Result<GetChatHistoryResponse>> HandleAsync(
            GetChatHistoryQuery query,
            CancellationToken cancellationToken = default);
    }

    public class GetChatHistoryHandler : IGetChatHistoryHandler
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<GetChatHistoryHandler> _logger;

        public GetChatHistoryHandler(AppDbContext dbContext, ILogger<GetChatHistoryHandler> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<Result<GetChatHistoryResponse>> HandleAsync(
            GetChatHistoryQuery query,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var readings = await _dbContext.AstrologyReadings
                    .AsNoTracking()
                    .Where(r => r.UserId == query.UserId)
                    .OrderBy(r => r.CreatedAt)
                    .Take(Math.Max(1, Math.Min(500, query.Limit)))
                    .Select(r => new ChatReadingItemDto
                    {
                        ReadingId = r.ReadingId,
                        UserId = r.UserId,
                        SessionId = string.IsNullOrEmpty(r.SessionId) ? "session-" + r.ReadingId : r.SessionId,
                        Question = r.UserInputText,
                        CalculatedSiderealData = r.CalculatedSiderealData,
                        AiResponse = r.AiResponse,
                        CreatedAt = r.CreatedAt ?? DateTime.UtcNow
                    })
                    .ToListAsync(cancellationToken);

                var sessions = readings
                    .GroupBy(r => r.SessionId)
                    .Select(group =>
                    {
                        var orderedMessages = group.OrderBy(m => m.CreatedAt).ToList();
                        var firstMessage = orderedMessages.First();
                        var lastMessage = orderedMessages.Last();
                        return new ChatSessionDto
                        {
                            SessionId = group.Key,
                            Title = firstMessage.Question,
                            CreatedAt = firstMessage.CreatedAt,
                            LastUpdatedAt = lastMessage.CreatedAt,
                            MessageCount = orderedMessages.Count,
                            Messages = orderedMessages
                        };
                    })
                    .OrderByDescending(s => s.LastUpdatedAt)
                    .ToList();

                var response = new GetChatHistoryResponse
                {
                    UserId = query.UserId,
                    Readings = readings,
                    Sessions = sessions
                };

                return Result<GetChatHistoryResponse>.Success(response, $"Retrieved {sessions.Count} sessions with {readings.Count} total readings.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load chat history for user {UserId}", query.UserId);
                return Result<GetChatHistoryResponse>.SystemError($"Unable to load chat history: {ex.Message}");
            }
        }
    }
}
