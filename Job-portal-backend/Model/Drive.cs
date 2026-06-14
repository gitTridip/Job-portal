using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Job_portal_backend.Model
{
    public class Drive
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DriveId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        [MaxLength(200)]
        public string CompanyName { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [MaxLength(100)]
        public string City { get; set; }

        [Required]
        [MaxLength(300)]
        public string Venue { get; set; }

        [Required]
        public DateOnly DriveDate { get; set; }

        [Required]
        public TimeOnly ReportingTime { get; set; }

        [Required]
        [MaxLength(200)]
        public string QualificationRequired { get; set; }

        [Required]
        [MaxLength(100)]
        public string ExperienceRequired { get; set; }

        [Required]
        [MaxLength(100)]
        public string ContactPerson { get; set; }

        [Required]
        [EmailAddress]
        public string ContactEmail { get; set; }

        [Required]
        public string Status { get; set; } = "Active";

        // Foreign key to User
        public int AdminId { get; set; }

        [ForeignKey(nameof(AdminId))]
        public User Admin { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedOn { get; set; }
    }
}
