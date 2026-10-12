using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Sidereal_Astrologer.Database.AppDbContextModels;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AstrologyReading> AstrologyReadings { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Server=.;Database=Astrologer;User Id=sa;Password=sasa@123;TrustServerCertificate=True;");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AstrologyReading>(entity =>
        {
            entity.HasKey(e => e.ReadingId).HasName("PK__Astrolog__8091F95AE7661CD2");

            entity.Property(e => e.ReadingId).HasColumnName("reading_id");
            entity.Property(e => e.AiResponse).HasColumnName("ai_response");
            entity.Property(e => e.CalculatedSiderealData).HasColumnName("calculated_sidereal_data");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.UserInputText).HasColumnName("user_input_text");
            entity.Property(e => e.SessionId)
                .HasMaxLength(64)
                .HasColumnName("session_id");

            entity.HasOne(d => d.User).WithMany(p => p.AstrologyReadings)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Readings_Users");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__B9BE370F219040A4");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.BirthDate).HasColumnName("birth_date");
            entity.Property(e => e.BirthPlace)
                .HasMaxLength(150)
                .HasColumnName("birth_place");
            entity.Property(e => e.BirthTime).HasColumnName("birth_time");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("created_at");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .HasColumnName("email");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(256)
                .HasColumnName("password_hash");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
