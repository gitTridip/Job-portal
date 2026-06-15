using System;
using System.ComponentModel.DataAnnotations;

namespace Job_portal_backend.Model
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        // Mobile is now optional
        public string Mobile { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; }

        public DateTime CreatedOn { get; set; }
    }
}
