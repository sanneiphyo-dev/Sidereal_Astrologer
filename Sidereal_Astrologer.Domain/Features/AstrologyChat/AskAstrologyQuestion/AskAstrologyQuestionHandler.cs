using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sidereal_Astrologer.Database.AppDbContextModels;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.Services;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.AskAstrologyQuestion
{
    public interface IAskAstrologyQuestionHandler
    {
        Task<Result<AskAstrologyQuestionResponse>> HandleAsync(
            AskAstrologyQuestionRequest request,
            CancellationToken cancellationToken = default);
    }

    public class AskAstrologyQuestionHandler : IAskAstrologyQuestionHandler
    {
        private readonly AppDbContext _dbContext;
        private readonly ISiderealCalculator _calculator;
        private readonly IMcpAstrologyClient _mcpClient;
        private readonly ILogger<AskAstrologyQuestionHandler> _logger;

        public AskAstrologyQuestionHandler(
            AppDbContext dbContext,
            ISiderealCalculator calculator,
            IMcpAstrologyClient mcpClient,
            ILogger<AskAstrologyQuestionHandler> logger)
        {
            _dbContext = dbContext;
            _calculator = calculator;
            _mcpClient = mcpClient;
            _logger = logger;
        }

        public async Task<Result<AskAstrologyQuestionResponse>> HandleAsync(
            AskAstrologyQuestionRequest request,
            CancellationToken cancellationToken = default)
        {
            var validation = AskAstrologyQuestionValidator.Validate(request);
            if (!validation.IsSuccess)
            {
                return Result<AskAstrologyQuestionResponse>.ValidationError(validation.Message);
            }

            try
            {
                // 1. Resolve or create User
                var user = await ResolveOrCreateUserAsync(request, cancellationToken);

                // 2. Compute Sidereal Astrological Context
                var birthDate = request.BirthDate ?? user.BirthDate;
                var birthTime = request.BirthTime ?? user.BirthTime;
                var birthPlace = request.BirthPlace ?? user.BirthPlace;

                var siderealContext = _calculator.CalculateContext(birthDate, birthTime, birthPlace);

                // 3. Query MCP AI layer with the Sidereal Context & Question
                var aiResponse = await _mcpClient.GenerateInterpretationAsync(
                    request.Question.Trim(),
                    siderealContext,
                    cancellationToken);

                var sessionId = !string.IsNullOrWhiteSpace(request.SessionId)
                    ? request.SessionId.Trim()
                    : "session-" + Guid.NewGuid().ToString("N")[..12];

                // 4. Persist to Database via EF Core (US-202)
                var reading = new AstrologyReading
                {
                    UserId = user.UserId,
                    SessionId = sessionId,
                    UserInputText = request.Question.Trim(),
                    CalculatedSiderealData = siderealContext.RawJson,
                    AiResponse = aiResponse,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.AstrologyReadings.Add(reading);
                await _dbContext.SaveChangesAsync(cancellationToken);

                var response = new AskAstrologyQuestionResponse
                {
                    ReadingId = reading.ReadingId,
                    UserId = user.UserId,
                    SessionId = sessionId,
                    UserName = user.Name ?? "Seeker",
                    Question = reading.UserInputText,
                    CalculatedSiderealData = reading.CalculatedSiderealData,
                    AiResponse = reading.AiResponse,
                    CreatedAt = reading.CreatedAt ?? DateTime.UtcNow
                };

                return Result<AskAstrologyQuestionResponse>.Success(response, "Astrology reading generated and saved successfully.");
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("Astrology request was canceled or timed out.");
                return Result<AskAstrologyQuestionResponse>.SystemError("Request timed out while generating astrological interpretation. Please try again.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing the astrology question.");
                return Result<AskAstrologyQuestionResponse>.SystemError($"An error occurred while generating your reading: {ex.Message}");
            }
        }

        private async Task<User> ResolveOrCreateUserAsync(
            AskAstrologyQuestionRequest request,
            CancellationToken cancellationToken)
        {
            User? user = null;

            if (request.UserId.HasValue && request.UserId.Value > 0)
            {
                user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == request.UserId.Value, cancellationToken);
            }

            if (user == null)
            {
                // Check if default user exists, else create one
                var defaultUserName = !string.IsNullOrWhiteSpace(request.UserName) ? request.UserName.Trim() : "Seeker";
                user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Name == defaultUserName, cancellationToken);

                if (user == null)
                {
                    user = new User
                    {
                        Name = defaultUserName,
                        BirthDate = request.BirthDate ?? new DateOnly(1995, 6, 21),
                        BirthTime = request.BirthTime ?? new TimeOnly(10, 30),
                        BirthPlace = request.BirthPlace ?? "Yangon, Myanmar",
                        CreatedAt = DateTime.UtcNow
                    };
                    _dbContext.Users.Add(user);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                }
            }

            return user;
        }
    }
}
