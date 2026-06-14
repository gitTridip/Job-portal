using System;
using System.ComponentModel.DataAnnotations;

namespace Job_portal_backend.Model
{
    public class DriveCreateDto
    {
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
    }

    public class DriveUpdateDto : DriveCreateDto
    {
        // reuse fields; client should not set CreatedBy/CreatedOn
    }

    public class DriveReadDto
    {
        public int DriveId { get; set; }
        public string Title { get; set; }
        public string CompanyName { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public DateOnly DriveDate { get; set; }
        public TimeOnly ReportingTime { get; set; }
        public string QualificationRequired { get; set; }
        public string ExperienceRequired { get; set; }
        public string ContactPerson { get; set; }
        public string ContactEmail { get; set; }
        public string Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public int AdminId { get; set; }
    }

    public class DriveDto
    {
        public int DriveId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public int AdminId { get; set; }
    }
}
