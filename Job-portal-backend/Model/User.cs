using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Job_portal_backend.Model
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mobile number is required.")]
        public string Mobile { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }

        public DateTime CreatedOn { get; set; }
    }
}
