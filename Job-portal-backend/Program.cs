using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Job_portal_backend.Services;
using System.Threading.Tasks;
using Job_portal_backend.Model;
using Job_portal_backend.Context;

namespace Job_portal_backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            // Configuration for DbContext
            builder.Services.AddDbContext<Job_portal_backend.Context.UsersContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("dbconn")));

            // JWT configuration
            var jwtSection = builder.Configuration.GetSection("JwtSettings");
            builder.Services.Configure<JwtSettings>(jwtSection);
            var jwtSettings = jwtSection.Get<JwtSettings>();
            var key = System.Text.Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

            // Token revocation service (in-memory). For production, replace with persistent store.
            builder.Services.AddSingleton<ITokenRevocationService, TokenRevocationService>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key)
                };

                // Check revoked tokens on validation
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var revocationService = context.HttpContext.RequestServices.GetService(typeof(ITokenRevocationService)) as ITokenRevocationService;
                        if (revocationService != null)
                        {
                            var authHeader = context.Request.Headers["Authorization"].ToString();
                            var tokenString = authHeader?.StartsWith("Bearer ") == true ? authHeader.Substring(7) : authHeader;
                            if (!string.IsNullOrEmpty(tokenString) && revocationService.IsTokenRevoked(tokenString))
                            {
                                context.Fail("Token revoked");
                            }
                        }

                        return System.Threading.Tasks.Task.CompletedTask;
                    }
                };
            });
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<UsersContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("dbconn")));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
