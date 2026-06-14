using Job_portal_backend.Model;
using Job_portal_backend.Security;
using Microsoft.EntityFrameworkCore;

namespace Job_portal_backend.Context
{
    public class UsersContext : DbContext
    {
        public DbSet<User> users {  get; set; }
        public UsersContext(DbContextOptions<UsersContext> options):base(options)
        {
            
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            User user = new User()
            { Id = 1, Name = "Admin", Email = "admin@email.com", Mobile = "6798765687", Password = "admin@123",CreatedOn=DateTime.UtcNow, Role = "admin" };
            PasswordSecurityManager.EncodePassword(user);
            modelBuilder.Entity<User>().HasData(user);

            // Example candidate seed (optional)
            User candidate = new User()
            { Id = 2, Name = "Candidate", Email = "candidate@email.com", Mobile = "6789012345", Password = "candidate@123",CreatedOn=DateTime.UtcNow, Role = "candidate" };
            PasswordSecurityManager.EncodePassword(candidate);
            modelBuilder.Entity<User>().HasData(candidate);
        }
    }
}
