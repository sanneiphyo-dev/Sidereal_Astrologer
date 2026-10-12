using Sidereal_Astrologer.Domain.Features.AstrologyChat.AskAstrologyQuestion;
using Xunit;

namespace Sidereal_Astrologer.Tests
{
    public class ValidationTests
    {
        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void Validate_EmptyOrWhitespace_FailsValidation(string? invalidQuestion)
        {
            var request = new AskAstrologyQuestionRequest
            {
                Question = invalidQuestion!
            };

            var result = AskAstrologyQuestionValidator.Validate(request);

            Assert.False(result.IsSuccess);
            Assert.True(result.IsValidationError);
            Assert.Contains("empty", result.Message, System.StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public void Validate_ValidQuestion_Succeeds()
        {
            var request = new AskAstrologyQuestionRequest
            {
                Question = "What is my Sidereal ascendant and career path?"
            };

            var result = AskAstrologyQuestionValidator.Validate(request);

            Assert.True(result.IsSuccess);
            Assert.False(result.IsError);
        }
    }
}
