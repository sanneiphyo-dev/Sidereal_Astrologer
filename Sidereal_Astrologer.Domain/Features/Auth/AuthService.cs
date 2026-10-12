using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sidereal_Astrologer.Database.AppDbContextModels;

namespace Sidereal_Astrologer.Domain.Features.Auth
{
    public interface IAuthService
    {
        Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
        Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
        Task<Result<AuthResponse>> GetProfileAsync(int userId, CancellationToken cancellationToken = default);
    }

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<AuthService> _logger;

        public AuthService(AppDbContext dbContext, ILogger<AuthService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return Result<AuthResponse>.ValidationError("Name is required.");
            }
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return Result<AuthResponse>.ValidationError("Email is required.");
            }
            if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
            {
                return Result<AuthResponse>.ValidationError("Password must be at least 6 characters long.");
            }

            var trimmedEmail = request.Email.Trim().ToLowerInvariant();
            var trimmedName = request.Name.Trim();

            // Check if user with same email exists
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(
                u => (u.Email != null && u.Email.ToLower() == trimmedEmail) || u.Name == trimmedName,
                cancellationToken);

            if (existingUser != null)
            {
                return Result<AuthResponse>.ValidationError("A user with this email or name already exists.");
            }

            var passwordHash = HashPassword(request.Password);

            var user = new User
            {
                Name = trimmedName,
                Email = trimmedEmail,
                PasswordHash = passwordHash,
                BirthDate = request.BirthDate ?? new DateOnly(1995, 6, 21),
                BirthTime = request.BirthTime ?? new TimeOnly(12, 0),
                BirthPlace = !string.IsNullOrWhiteSpace(request.BirthPlace) ? request.BirthPlace.Trim() : "Yangon, Myanmar",
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync(cancellationToken);

            var token = GenerateToken(user);
            return Result<AuthResponse>.Success(MapToResponse(user, token), "Registration successful.");
        }

        public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(request.EmailOrName))
            {
                return Result<AuthResponse>.ValidationError("Email or username is required.");
            }
            if (string.IsNullOrWhiteSpace(request.Password))
            {
                return Result<AuthResponse>.ValidationError("Password is required.");
            }

            var input = request.EmailOrName.Trim().ToLowerInvariant();

            var user = await _dbContext.Users.FirstOrDefaultAsync(
                u => (u.Email != null && u.Email.ToLower() == input) || (u.Name != null && u.Name.ToLower() == input),
                cancellationToken);

            if (user == null)
            {
                return Result<AuthResponse>.ValidationError("Invalid credentials. User not found.");
            }

            // Verify password
            if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                var inputHash = HashPassword(request.Password);
                if (user.PasswordHash != inputHash)
                {
                    return Result<AuthResponse>.ValidationError("Invalid credentials. Incorrect password.");
                }
            }

            var token = GenerateToken(user);
            return Result<AuthResponse>.Success(MapToResponse(user, token), "Login successful.");
        }

        public async Task<Result<AuthResponse>> GetProfileAsync(int userId, CancellationToken cancellationToken = default)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
            if (user == null)
            {
                return Result<AuthResponse>.ValidationError("User not found.");
            }

            var token = GenerateToken(user);
            return Result<AuthResponse>.Success(MapToResponse(user, token));
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "_sidereal_salt_2026"));
            return Convert.ToBase64String(bytes);
        }

        private static string GenerateToken(User user)
        {
            var raw = $"{user.UserId}:{user.Email ?? user.Name}:{DateTime.UtcNow.Ticks}";
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(raw));
        }

        private static AuthResponse MapToResponse(User user, string token)
        {
            return new AuthResponse
            {
                UserId = user.UserId,
                Name = user.Name ?? "Seeker",
                Email = user.Email ?? string.Empty,
                BirthDate = user.BirthDate.ToString("yyyy-MM-dd"),
                BirthTime = user.BirthTime?.ToString("HH:mm") ?? "12:00",
                BirthPlace = user.BirthPlace ?? "Yangon, Myanmar",
                Token = token
            };
        }
    }
}
