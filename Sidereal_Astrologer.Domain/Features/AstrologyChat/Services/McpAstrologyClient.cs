using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.Services
{
    public class McpAstrologyClient : IMcpAstrologyClient
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<McpAstrologyClient> _logger;

        public McpAstrologyClient(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<McpAstrologyClient> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> GenerateInterpretationAsync(
            string question,
            SiderealContext siderealContext,
            CancellationToken cancellationToken = default)
        {
            var mcpEndpoint = _configuration["McpSettings:ServerUrl"];
            var apiKey = _configuration["McpSettings:ApiKey"];

            if (!string.IsNullOrWhiteSpace(mcpEndpoint))
            {
                try
                {
                    return await CallMcpServerAsync(mcpEndpoint, apiKey, question, siderealContext, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to connect to MCP Server at {Endpoint}. Falling back to internal Sidereal Astrological Engine.", mcpEndpoint);
                }
            }

            // Fallback: Internal Sidereal Interpretation Engine
            return GenerateInternalSiderealReading(question, siderealContext);
        }

        private async Task<string> CallMcpServerAsync(
            string endpoint,
            string? apiKey,
            string question,
            SiderealContext context,
            CancellationToken cancellationToken)
        {
            var payload = new
            {
                jsonrpc = "2.0",
                method = "tools/call",
                @params = new
                {
                    name = "interpret_sidereal_horoscope",
                    arguments = new
                    {
                        question = question,
                        ayanamsa = context.AyanamsaSystem,
                        ayanamsaDegrees = context.AyanamsaDegrees,
                        sunSign = context.SunSign,
                        moonSign = context.MoonSign,
                        nakshatra = context.Nakshatra,
                        transits = context.TransitsSummary
                    }
                },
                id = Guid.NewGuid().ToString()
            };

            using var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
            if (!string.IsNullOrEmpty(apiKey))
            {
                request.Headers.Add("Authorization", $"Bearer {apiKey}");
            }
            request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);
            using var doc = JsonDocument.Parse(responseJson);

            // Extract text from MCP response format
            if (doc.RootElement.TryGetProperty("result", out var resultElement))
            {
                if (resultElement.TryGetProperty("content", out var contentArray) && contentArray.GetArrayLength() > 0)
                {
                    var first = contentArray[0];
                    if (first.TryGetProperty("text", out var textProp))
                    {
                        return textProp.GetString() ?? string.Empty;
                    }
                }
            }

            return responseJson;
        }

        private static string GenerateInternalSiderealReading(string question, SiderealContext context)
        {
            var lowerQ = question.ToLowerInvariant();
            var sb = new StringBuilder();

            sb.AppendLine("### ✨ Sidereal Astrological Interpretation");
            sb.AppendLine();
            sb.AppendLine($"**Sidereal Chart Alignment ({context.AyanamsaSystem} - {context.AyanamsaDegrees:F2}°):**");
            sb.AppendLine($"- ☀️ **Sun in {context.SunSign}**: Indicates your primary solar essence and soul purpose in the fixed constellations.");
            sb.AppendLine($"- 🌙 **Moon in {context.MoonSign}**: Governs your intuitive mind, emotional stability, and subconscious reactions.");
            sb.AppendLine($"- 🌟 **Birth Nakshatra ({context.Nakshatra})**: Highlights your karmic direction and energetic temperament.");
            sb.AppendLine();

            if (lowerQ.Contains("career") || lowerQ.Contains("job") || lowerQ.Contains("work") || lowerQ.Contains("business"))
            {
                sb.AppendLine("#### 💼 Career & Dharma Analysis");
                sb.AppendLine($"With your Sidereal Sun in {context.SunSign} and the influence of {context.Nakshatra}, your 10th house karmic vector emphasizes purposeful leadership, methodical perseverance, and authentic service. Planetary transits suggest a transformative phase where staying grounded and aligning with long-term goals yields stable success.");
            }
            else if (lowerQ.Contains("love") || lowerQ.Contains("relationship") || lowerQ.Contains("marriage") || lowerQ.Contains("partner"))
            {
                sb.AppendLine("#### ❤️ Love & Relationships Analysis");
                sb.AppendLine($"Your Sidereal Moon positioned in {context.MoonSign} underscores emotional depth and the need for heartfelt trust in relationships. Under the current asterism of {context.Nakshatra}, harmony is fostered through transparent communication and allowing emotional vulnerabilities to be met with compassionate understanding.");
            }
            else if (lowerQ.Contains("health") || lowerQ.Contains("mind") || lowerQ.Contains("spirit") || lowerQ.Contains("peace"))
            {
                sb.AppendLine("#### 🌿 Health, Mind & Vitality");
                sb.AppendLine($"The alignment of your Sidereal Sun and Moon indicates an active period of mental recalibration. The energy of {context.Nakshatra} calls for mindful grounding practices, honoring rest cycles, and harmonizing your circadian rhythm with natural planetary hours.");
            }
            else
            {
                sb.AppendLine("#### 🔮 Reading on Your Inquiry");
                sb.AppendLine($"In answering *\"{question.Trim()}\"*, the sidereal calculations reveal that current celestial currents are nudging you toward self-reflection and decisive clarity. With the lunar energy rooted in {context.MoonSign}, intuition is your sharpest guide right now. Rely on disciplined discernment over impulsive choices.");
            }

            sb.AppendLine();
            sb.AppendLine("#### 🪐 Astrological Guidance");
            sb.AppendLine("- **Favorable Energy**: Focus on steady alignment with your authentic truth.");
            sb.AppendLine("- **Remedy/Contemplation**: Meditate during the planetary hour of Jupiter or Sun for clarity.");

            return sb.ToString().Trim();
        }
    }
}
