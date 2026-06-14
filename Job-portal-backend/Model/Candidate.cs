using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using System.Text.RegularExpressions;

namespace Job_portal_backend.Model
{
    [Index(nameof(Email), IsUnique = true)]
    [Index(nameof(MobileNo), IsUnique = true)]
    public class Candidate
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set;}
        [Required]
        public String Name { get; set;}
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
        ErrorMessage = "Invalid email format")]
        public string Email { get; set;}
        public string MobileNo { get; set;}
        public string Skills { get; set;}
        public int Experience { get; set;}
        public string ResumeUrl { get; set;}
    }
}
