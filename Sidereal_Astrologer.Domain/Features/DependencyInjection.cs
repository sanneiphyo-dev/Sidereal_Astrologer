using Microsoft.Extensions.DependencyInjection;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.AskAstrologyQuestion;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.GetChatHistory;
using Sidereal_Astrologer.Domain.Features.AstrologyChat.Services;

namespace Sidereal_Astrologer.Domain.Features
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddAstrologyDomainServices(this IServiceCollection services)
        {
            // Astrological calculation & MCP services
            services.AddSingleton<ISiderealCalculator, SiderealCalculator>();
            services.AddHttpClient<IMcpAstrologyClient, McpAstrologyClient>();

            // Vertical Slice Handlers
            services.AddScoped<IAskAstrologyQuestionHandler, AskAstrologyQuestionHandler>();
            services.AddScoped<IGetChatHistoryHandler, GetChatHistoryHandler>();
            services.AddScoped<Auth.IAuthService, Auth.AuthService>();

            return services;
        }
    }
}
