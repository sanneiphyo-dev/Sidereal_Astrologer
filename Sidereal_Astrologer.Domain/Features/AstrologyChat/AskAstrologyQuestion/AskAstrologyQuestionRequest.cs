using System;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.AskAstrologyQuestion
{
    public class AskAstrologyQuestionRequest
    {
        public int? UserId { get; set; }
        public string Question { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public DateOnly? BirthDate { get; set; }
        public TimeOnly? BirthTime { get; set; }
        public string? BirthPlace { get; set; }
        public string? SessionId { get; set; }
    }
}
