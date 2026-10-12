namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.GetChatHistory
{
    public class GetChatHistoryQuery
    {
        public int UserId { get; set; } = 1;
        public int Limit { get; set; } = 50;
    }
}
