using System;
using System.Collections.Generic;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.GetChatHistory
{
    public class ChatReadingItemDto
    {
        public int ReadingId { get; set; }
        public int UserId { get; set; }
        public string SessionId { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public string? CalculatedSiderealData { get; set; }
        public string AiResponse { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class ChatSessionDto
    {
        public string SessionId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
        public int MessageCount { get; set; }
        public List<ChatReadingItemDto> Messages { get; set; } = new();
    }

    public class GetChatHistoryResponse
    {
        public int UserId { get; set; }
        public List<ChatReadingItemDto> Readings { get; set; } = new();
        public List<ChatSessionDto> Sessions { get; set; } = new();
    }
}
