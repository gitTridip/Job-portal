using Job_portal_backend.Context;
using Job_portal_backend.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace Job_portal_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly UsersContext _context;

        private readonly JwtSettings _jwtSettings;

        public LoginController(UsersContext context, IOptions<JwtSettings> jwtOptions)
        {
            _context = context;
            _jwtSettings = jwtOptions.Value;
        }

        public class LoginRequest
        {
            public string Identifier { get; set; } // email or mobile
            public string Password { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Identifier) || string.IsNullOrWhiteSpace(request.Password))
            {
                var resp = new Model.ApiResponse<string>("failure", "Identifier and password are required.");
                return BadRequest(resp);
            }

            // Try to find user by email or mobile
            var user = await _context.users.FirstOrDefaultAsync(u => u.Email == request.Identifier || u.Mobile == request.Identifier);
            if (user == null)
            {
                var resp = new Model.ApiResponse<string>("failure", "Invalid credentials.");
                return Unauthorized(resp);
            }

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.Password, request.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                var resp = new Model.ApiResponse<string>("failure", "Invalid credentials.");
                return Unauthorized(resp);
            }

            // Successful login - create JWT with role claim
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name ?? string.Empty),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.MobilePhone, user.Mobile ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? "candidate")
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes > 0 ? _jwtSettings.ExpiryMinutes : 60);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            var data = new
            {
                Token = tokenString,
                ExpiresAt = expires,
                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Mobile,
                    user.CandidateId,
                    user.Role,
                    user.CreatedOn
                }
            };

            var success = new Model.ApiResponse<object>("success", data);
            return Ok(success);
        }
    }
}
