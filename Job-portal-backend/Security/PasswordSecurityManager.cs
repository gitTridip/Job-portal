using Job_portal_backend.Model;
using Microsoft.AspNetCore.Identity;

namespace Job_portal_backend.Security
{
    public class PasswordSecurityManager
    {
        public static void EncodePassword(User user)
        {
            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, user.Password);
        }
    }
}
