using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Sidereal_Astrologer.Database.AppDbContextModels;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.AskAstrologyQuestion;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.GetChatHistory;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.Services;
using Xunit;

namespace Sidereal_Astrologer.Tests
{
    public class AstrologyChatIntegrationTests
    {
        private AppDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        private class MockMcpClient : IMcpAstrologyClient
        {
            public Task<string> GenerateInterpretationAsync(
                string question,
                SiderealContext siderealContext,
                CancellationToken cancellationToken = default)
            {
                return Task.FromResult($"✨ Test Sidereal Interpretation for '{question}' under {siderealContext.SunSign}");
            }
        }

        [Fact]
        public async Task EndToEndFlow_SubmittingQuestion_PersistsToDatabase_AndReturnsResponse()
        {
            // Arrange
            using var dbContext = CreateInMemoryDbContext();
            var calculator = new SiderealCalculator();
            var mcpClient = new MockMcpClient();
            var askLogger = NullLogger<AskAstrologyQuestionHandler>.Instance;
            var historyLogger = NullLogger<GetChatHistoryHandler>.Instance;

            var askHandler = new AskAstrologyQuestionHandler(dbContext, calculator, mcpClient, askLogger);
            var historyHandler = new GetChatHistoryHandler(dbContext, historyLogger);

            var request = new AskAstrologyQuestionRequest
            {
                UserName = "TestSeeker",
                Question = "What career path aligns with my Sidereal nakshatra?",
                BirthDate = new DateOnly(1995, 6, 21),
                BirthTime = new TimeOnly(10, 30),
                BirthPlace = "Yangon"
            };

            // Act - Send question (US-201 & US-202)
            var askResult = await askHandler.HandleAsync(request);

            // Assert
            Assert.True(askResult.IsSuccess);
            Assert.NotNull(askResult.Data);
            Assert.True(askResult.Data.ReadingId > 0);
            Assert.Contains("Test Sidereal Interpretation", askResult.Data.AiResponse);
            Assert.NotNull(askResult.Data.CalculatedSiderealData);

            // Verify directly in DbContext
            var readingInDb = await dbContext.AstrologyReadings.FirstOrDefaultAsync(r => r.ReadingId == askResult.Data.ReadingId);
            Assert.NotNull(readingInDb);
            Assert.Equal("What career path aligns with my Sidereal nakshatra?", readingInDb.UserInputText);
            Assert.Equal(askResult.Data.UserId, readingInDb.UserId);

            // Act - Retrieve history (US-202)
            var historyResult = await historyHandler.HandleAsync(new GetChatHistoryQuery
            {
                UserId = askResult.Data.UserId
            });

            // Assert history
            Assert.True(historyResult.IsSuccess);
            Assert.NotNull(historyResult.Data);
            Assert.Single(historyResult.Data.Readings);
            Assert.Equal(readingInDb.UserInputText, historyResult.Data.Readings[0].Question);
        }
    }
}
