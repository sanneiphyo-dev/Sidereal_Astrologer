using System;
using System.Text.Json;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.Services
{
    public class SiderealCalculator : ISiderealCalculator
    {
        // Average Lahiri Ayanamsa for the 2020-2026 era (~24.16 degrees)
        private const double CurrentLahiriAyanamsa = 24.16;

        private static readonly string[] SiderealZodiacSigns =
        {
            "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)",
            "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
            "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)",
            "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
        };

        private static readonly string[] Nakshatras =
        {
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
            "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
            "Hasta", "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha",
            "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
            "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
        };

        public SiderealContext CalculateContext(DateOnly? birthDate, TimeOnly? birthTime, string? birthPlace)
        {
            var date = birthDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
            var time = birthTime ?? new TimeOnly(12, 0);

            // Compute approximate tropical Sun longitude (days from March 21 equinox)
            var dayOfYear = date.DayOfYear;
            double approxTropicalSunLon = ((dayOfYear - 80 + 365) % 365) * (360.0 / 365.25);
            if (approxTropicalSunLon < 0) approxTropicalSunLon += 360.0;

            // Apply Lahiri Ayanamsa to convert Tropical to Sidereal (Nirayana)
            double siderealSunLon = (approxTropicalSunLon - CurrentLahiriAyanamsa + 360.0) % 360.0;
            int sunSignIndex = (int)(siderealSunLon / 30.0) % 12;
            string sunSign = SiderealZodiacSigns[sunSignIndex];

            // Approximate Moon longitude based on days and hour
            double approxMoonLon = (siderealSunLon + (date.Day * 13.176) + (time.Hour * 0.55)) % 360.0;
            int moonSignIndex = (int)(approxMoonLon / 30.0) % 12;
            string moonSign = SiderealZodiacSigns[moonSignIndex];

            // 27 Nakshatras span 13° 20' (13.333°) each
            int nakshatraIndex = (int)(approxMoonLon / (360.0 / 27.0)) % 27;
            string nakshatra = Nakshatras[nakshatraIndex];

            string transitsSummary = $"Sidereal Sun: {sunSign} ({siderealSunLon % 30:F1}°), " +
                                     $"Sidereal Moon: {moonSign} ({approxMoonLon % 30:F1}°), " +
                                     $"Birth Nakshatra: {nakshatra}, " +
                                     $"Ayanamsa: Lahiri ({CurrentLahiriAyanamsa}°), Place: {birthPlace ?? "Default/Universal Coordinates"}";

            var dataObj = new
            {
                ayanamsa = "Lahiri (Chitra Paksha)",
                ayanamsaDegrees = CurrentLahiriAyanamsa,
                siderealSun = new { sign = sunSign, degree = Math.Round(siderealSunLon % 30, 2) },
                siderealMoon = new { sign = moonSign, degree = Math.Round(approxMoonLon % 30, 2) },
                nakshatra = nakshatra,
                birthDate = date.ToString("yyyy-MM-dd"),
                birthTime = time.ToString("HH:mm"),
                birthPlace = birthPlace ?? "Universal Coordinates"
            };

            return new SiderealContext(
                AyanamsaSystem: "Lahiri (Chitra Paksha)",
                AyanamsaDegrees: CurrentLahiriAyanamsa,
                SunSign: sunSign,
                MoonSign: moonSign,
                Nakshatra: nakshatra,
                TransitsSummary: transitsSummary,
                RawJson: JsonSerializer.Serialize(dataObj, new JsonSerializerOptions { WriteIndented = false })
            );
        }
    }
}
