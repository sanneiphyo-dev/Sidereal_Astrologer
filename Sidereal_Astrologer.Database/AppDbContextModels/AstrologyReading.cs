using System;
using System.Collections.Generic;

namespace Sidereal_Astrologer.Database.AppDbContextModels;

public partial class AstrologyReading
{
    public int ReadingId { get; set; }

    public int UserId { get; set; }

    public string UserInputText { get; set; } = null!;

    public string? CalculatedSiderealData { get; set; }

    public string AiResponse { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public string? SessionId { get; set; }

    public virtual User User { get; set; } = null!;
}
