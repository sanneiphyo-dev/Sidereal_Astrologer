using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Sidereal_Astrologer.Database.AppDbContextModels;
using Sidereal_Astrologer.Domain.Features;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure EF Core DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=.;Database=Astrologer;User Id=sa;Password=sasa@123;TrustServerCertificate=True;";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register Domain & Vertical Slice services (Calculations, MCP Client, Handlers)
builder.Services.AddAstrologyDomainServices();

// Configure CORS for Frontend Integration (US-301)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configure OpenAPI & Swagger UI (US-301)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
object value = builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Sidereal Astrology & MCP Assistant API",
        Version = "v1",
        Description = "Web API for Sidereal Astrological interpretation and chat history orchestrated via Model Context Protocol (MCP) and EF Core."
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Sidereal Astrology API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
