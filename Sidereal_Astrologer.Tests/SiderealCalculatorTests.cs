using System;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.Services;
using Xunit;

namespace Sidereal_Astrologer.Tests
{
    public class SiderealCalculatorTests
    {
        [Fact]
        public void CalculateContext_ReturnsValidLahiriAyanamsaAndPlanetaryData()
        {
            var calculator = new SiderealCalculator();
            var birthDate = new DateOnly(1995, 6, 21);
            var birthTime = new TimeOnly(10, 30);
            var birthPlace = "Yangon, Myanmar";

            var context = calculator.CalculateContext(birthDate, birthTime, birthPlace);

            Assert.NotNull(context);
            Assert.Contains("Lahiri", context.AyanamsaSystem);
            Assert.True(context.AyanamsaDegrees > 24.0);
            Assert.False(string.IsNullOrWhiteSpace(context.SunSign));
            Assert.False(string.IsNullOrWhiteSpace(context.MoonSign));
            Assert.False(string.IsNullOrWhiteSpace(context.Nakshatra));
            Assert.Contains(birthPlace, context.TransitsSummary);
            Assert.Contains("ayanamsa", context.RawJson);
        }
    }
}
