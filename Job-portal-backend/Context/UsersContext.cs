using System;
using Job_portal_backend.Model;
using Job_portal_backend.Security;
using Microsoft.EntityFrameworkCore;

namespace Job_portal_backend.Context
{
    public class UsersContext : DbContext
    {
        public DbSet<User> users { get; set; }
        public DbSet<Drive> drives { get; set; }

        public UsersContext(DbContextOptions<UsersContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Use SQL default for CreatedOn to keep model deterministic
            modelBuilder.Entity<User>().Property(x => x.CreatedOn).HasDefaultValueSql("GETUTCDATE()");

            // Configure Drive entity in the same context
            modelBuilder.Entity<Drive>(entity =>
            {
                entity.HasKey(d => d.DriveId);
                entity.Property(d => d.Title).IsRequired().HasMaxLength(200);
                entity.Property(d => d.CompanyName).IsRequired().HasMaxLength(200);
                entity.Property(d => d.Description).IsRequired();
                entity.Property(d => d.City).IsRequired().HasMaxLength(100);
                entity.Property(d => d.Venue).IsRequired().HasMaxLength(300);
                entity.Property(d => d.DriveDate).IsRequired();
                entity.Property(d => d.ReportingTime).IsRequired();
                entity.Property(d => d.QualificationRequired).IsRequired().HasMaxLength(200);
                entity.Property(d => d.ExperienceRequired).IsRequired().HasMaxLength(100);
                entity.Property(d => d.ContactPerson).IsRequired().HasMaxLength(100);
                entity.Property(d => d.ContactEmail).IsRequired();
                entity.Property(d => d.Status).IsRequired().HasDefaultValue("Active");
                entity.Property(d => d.CreatedOn).HasDefaultValueSql("GETUTCDATE()");

                entity.HasOne(d => d.Admin)
                      .WithMany()
                      .HasForeignKey(d => d.AdminId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Email).IsRequired();
                entity.Property(e => e.Password).IsRequired();
                entity.Property(e => e.Role).IsRequired();
                entity.Property(e => e.Mobile).IsRequired(false); // Make Mobile nullable

                
            });
        }
    }
}
