using System;
using System.Collections.Generic;

namespace Sidereal_Astrologer.Database.AppDbContextModels;

public partial class User
{
    public int UserId { get; set; }

    public string? Name { get; set; }

    public DateOnly BirthDate { get; set; }

    public TimeOnly? BirthTime { get; set; }

    public string? BirthPlace { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<AstrologyReading> AstrologyReadings { get; set; } = new List<AstrologyReading>();
}
