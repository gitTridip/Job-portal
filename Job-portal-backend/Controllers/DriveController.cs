using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Job_portal_backend.Context;
using Job_portal_backend.Model;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Job_portal_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriveController : ControllerBase
    {
        private readonly UsersContext _context;

        public DriveController(UsersContext context)
        {
            _context = context;
        }

        // GET /api/drives
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Get()
        {
            var drives = await _context.drives.Include(d => d.Admin).AsNoTracking().ToListAsync();
            var result = drives.Select(d => new DriveReadDto
            {
                DriveId = d.DriveId,
                Title = d.Title,
                CompanyName = d.CompanyName,
                Description = d.Description,
                City = d.City,
                Venue = d.Venue,
                DriveDate = d.DriveDate,
                ReportingTime = d.ReportingTime,
                QualificationRequired = d.QualificationRequired,
                ExperienceRequired = d.ExperienceRequired,
                ContactPerson = d.ContactPerson,
                ContactEmail = d.ContactEmail,
                Status = d.Status,
                AdminId = d.AdminId,
                CreatedOn = d.CreatedOn,
                UpdatedOn = d.UpdatedOn
            }).ToList();

            return Ok(new Model.ApiResponse<object>("success", result));
        }

        // GET /api/drives/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var d = await _context.drives.Include(d => d.Admin).AsNoTracking().FirstOrDefaultAsync(x => x.DriveId == id);
            if (d == null) return NotFound(new Model.ApiResponse<string>("failure", "Drive not found."));

            var dto = new DriveReadDto
            {
                DriveId = d.DriveId,
                Title = d.Title,
                CompanyName = d.CompanyName,
                Description = d.Description,
                City = d.City,
                Venue = d.Venue,
                DriveDate = d.DriveDate,
                ReportingTime = d.ReportingTime,
                QualificationRequired = d.QualificationRequired,
                ExperienceRequired = d.ExperienceRequired,
                ContactPerson = d.ContactPerson,
                ContactEmail = d.ContactEmail,
                Status = d.Status,
                AdminId = d.AdminId,
                CreatedOn = d.CreatedOn,
                UpdatedOn = d.UpdatedOn
            };

            return Ok(new Model.ApiResponse<object>("success", dto));
        }

        // POST /api/drives
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Post([FromBody] DriveCreateDto dto)
        {
            if (dto == null) return BadRequest(new Model.ApiResponse<string>("failure", "Invalid payload."));
            if (!ModelState.IsValid) return BadRequest(new Model.ApiResponse<object>("failure", ModelState));

            // Read Admin UserId from JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return BadRequest(new Model.ApiResponse<string>("failure", "Unable to determine user id from token."));
            }

            // Validate that the user exists and is an Admin
            var adminUser = await _context.users.FindAsync(userId);
            if (adminUser == null)
            {
                return BadRequest(new Model.ApiResponse<string>("failure", "Admin user not found."));
            }

            if (!string.Equals(adminUser.Role, "Admin", System.StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new Model.ApiResponse<string>("failure", "User is not an admin."));
            }

            var drive = new Drive
            {
                Title = dto.Title,
                CompanyName = dto.CompanyName,
                Description = dto.Description,
                City = dto.City,
                Venue = dto.Venue,
                DriveDate = dto.DriveDate,
                ReportingTime = dto.ReportingTime,
                QualificationRequired = dto.QualificationRequired,
                ExperienceRequired = dto.ExperienceRequired,
                ContactPerson = dto.ContactPerson,
                ContactEmail = dto.ContactEmail,
                AdminId = userId,
                Status = "Active",
                CreatedOn = DateTime.UtcNow
            };

            _context.drives.Add(drive);
            await _context.SaveChangesAsync();

            var read = new DriveReadDto
            {
                DriveId = drive.DriveId,
                Title = drive.Title,
                CompanyName = drive.CompanyName,
                Description = drive.Description,
                City = drive.City,
                Venue = drive.Venue,
                DriveDate = drive.DriveDate,
                ReportingTime = drive.ReportingTime,
                QualificationRequired = drive.QualificationRequired,
                ExperienceRequired = drive.ExperienceRequired,
                ContactPerson = drive.ContactPerson,
                ContactEmail = drive.ContactEmail,
                Status = drive.Status,
                AdminId = drive.AdminId,
                CreatedOn = drive.CreatedOn
            };

            return Ok(new Model.ApiResponse<object>("success", read));
        }

        // PUT /api/drives/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Put(int id, [FromBody] DriveUpdateDto dto)
        {
            if (dto == null) return BadRequest(new Model.ApiResponse<string>("failure", "Invalid payload."));
            if (!ModelState.IsValid) return BadRequest(new Model.ApiResponse<object>("failure", ModelState));

            var drive = await _context.drives.FirstOrDefaultAsync(d => d.DriveId == id);
            if (drive == null) return NotFound(new Model.ApiResponse<string>("failure", "Drive not found."));

            drive.Title = dto.Title;
            drive.CompanyName = dto.CompanyName;
            drive.Description = dto.Description;
            drive.City = dto.City;
            drive.Venue = dto.Venue;
            drive.DriveDate = dto.DriveDate;
            drive.ReportingTime = dto.ReportingTime;
            drive.QualificationRequired = dto.QualificationRequired;
            drive.ExperienceRequired = dto.ExperienceRequired;
            drive.ContactPerson = dto.ContactPerson;
            drive.ContactEmail = dto.ContactEmail;
            drive.UpdatedOn = DateTime.UtcNow;

            _context.drives.Update(drive);
            await _context.SaveChangesAsync();

            return Ok(new Model.ApiResponse<object>("success", new { drive.DriveId }));
        }

        // DELETE /api/drives/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var drive = await _context.drives.FirstOrDefaultAsync(d => d.DriveId == id);
            if (drive == null) return NotFound(new Model.ApiResponse<string>("failure", "Drive not found."));

            _context.drives.Remove(drive);
            await _context.SaveChangesAsync();

            return Ok(new Model.ApiResponse<string>("success", "Drive deleted."));
        }
    }
}
