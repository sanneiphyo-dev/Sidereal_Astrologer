using System;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.AskAstrologyQuestion
{
    public class AskAstrologyQuestionResponse
    {
        public int ReadingId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public string? CalculatedSiderealData { get; set; }
        public string AiResponse { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
