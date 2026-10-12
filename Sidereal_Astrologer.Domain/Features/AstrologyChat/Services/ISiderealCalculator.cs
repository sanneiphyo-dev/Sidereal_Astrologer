using System;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.Services
{
    public record SiderealContext(
        string AyanamsaSystem,
        double AyanamsaDegrees,
        string SunSign,
        string MoonSign,
        string Nakshatra,
        string TransitsSummary,
        string RawJson
    );

    public interface ISiderealCalculator
    {
        SiderealContext CalculateContext(DateOnly? birthDate, TimeOnly? birthTime, string? birthPlace);
    }
}
