using System.Threading;
using System.Threading.Tasks;

namespace Sidereal_Astrologer.Domain.Features.AstrologyChat.Services
{
    public interface IMcpAstrologyClient
    {
        Task<string> GenerateInterpretationAsync(
            string question,
            SiderealContext siderealContext,
            CancellationToken cancellationToken = default);
    }
}
