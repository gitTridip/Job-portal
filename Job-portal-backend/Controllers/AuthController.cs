using Job_portal_backend.Context;
using Job_portal_backend.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Job_portal_backend.Services;

namespace Job_portal_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UsersContext _context;

        private readonly JwtSettings _jwtSettings;
        public readonly ITokenRevocationService _revocationService;

        public AuthController(UsersContext context, IOptions<JwtSettings> jwtOptions, ITokenRevocationService revocationService)
        {
            _context = context;
            _jwtSettings = jwtOptions.Value;
            _revocationService = revocationService;
        }

        public class LoginRequest
        {
            public string Identifier { get; set; } // email or mobile
            public string Password { get; set; }
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Identifier) || string.IsNullOrWhiteSpace(request.Password))
            {
                var resp = new Model.ApiResponse<string>("failure", "Identifier and password are required.");
                return BadRequest(resp);
            }

            // Try to find user by email or mobile
            var user = await _context.users.FirstOrDefaultAsync(u => u.Email == request.Identifier || (u.Mobile != null && u.Mobile == request.Identifier));
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
                    user.Role,
                    user.CreatedOn
                }
            };

            var success = new Model.ApiResponse<object>("success", data);
            return Ok(success);
        }

        [Route("logout")]
        [HttpPost]
        public IActionResult Logout()
        {
            // Extract token from Authorization header
            var auth = Request.Headers["Authorization"].ToString();
            var token = string.Empty;
            if (!string.IsNullOrEmpty(auth) && auth.StartsWith("Bearer "))
            {
                token = auth.Substring(7);
            }

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new Model.ApiResponse<string>("failure", "No token provided."));
            }

            // Optionally, parse token to get expiry and set revocation expiry accordingly
            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            System.DateTimeOffset? expiresAt = null;
            try
            {
                var jwt = handler.ReadJwtToken(token);
                if (jwt.ValidTo != System.DateTime.MinValue)
                {
                    expiresAt = System.DateTimeOffset.UtcNow + (jwt.ValidTo - DateTime.UtcNow);
                }
            }
            catch
            {
                // ignore parse errors - still revoke token
            }

            _revocationService.RevokeToken(token, expiresAt);

            return Ok(new Model.ApiResponse<string>("success", "Logged out successfully."));
        }
        [Route("register")]
        [HttpPost]

        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (user == null || string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
            {
                var resp = new Model.ApiResponse<string>("failure", "Email and password are required.");
                return BadRequest(resp);
            }
            // Check if user with the same email already exists
            var existingUser = await _context.users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                var resp = new Model.ApiResponse<string>("failure", "User with this email already exists.");
                return Conflict(resp);
            }
            // Hash the password before saving
            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, user.Password);
            user.CreatedOn = DateTime.UtcNow;
            _context.users.Add(user);
            await _context.SaveChangesAsync();
            var success = new Model.ApiResponse<object>("success", new { user.Id, user.Name, user.Email, user.Mobile, user.Role, user.CreatedOn });
            return Ok(success);
        }
    }
}
