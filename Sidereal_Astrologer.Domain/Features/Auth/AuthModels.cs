using System;

namespace Sidereal_Astrologer.Domain.Features.Auth
{
    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public DateOnly? BirthDate { get; set; }
        public TimeOnly? BirthTime { get; set; }
        public string? BirthPlace { get; set; }
    }

    public class LoginRequest
    {
        public string EmailOrName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? BirthDate { get; set; }
        public string? BirthTime { get; set; }
        public string? BirthPlace { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
