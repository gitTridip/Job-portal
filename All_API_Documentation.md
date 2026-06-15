# API Documentation - Walk-In Job Portal

This document describes all API endpoints in the backend project.

Base notes
- Project target: .NET 10
- All responses follow ApiResponse<T> { Message, Data } unless otherwise noted.
- Authentication: JWT Bearer. Include header `Authorization: Bearer <token>` for protected endpoints.
- DateOnly JSON format: `"yyyy-MM-dd"` (example: `"2026-06-15"`).
- TimeOnly JSON format: `"HH:mm:ss"` (example: `"09:30:00"`).

---

COMMON TYPES

ApiResponse<T>
- Message: string ("success" or "failure")
- Data: T (payload or error info)

User (model used for registration)
- Id (int)
- Name (string)
- Email (string)
- Mobile (string)
- Password (string) - sent in clear for register/login; stored hashed
- Role (string) - e.g., "admin" or "candidate"
- CreatedOn (DateTime)

LoginRequest
- Identifier (string) - email or mobile
- Password (string)

Drive DTOs
- DriveCreateDto / DriveUpdateDto fields: Title, CompanyName, Description, City, Venue, DriveDate (DateOnly), ReportingTime (TimeOnly), QualificationRequired, ExperienceRequired, ContactPerson, ContactEmail
- DriveReadDto includes DriveId, Status, CreatedBy, CreatedOn, UpdatedOn

---

1) POST /api/Login
- Purpose: Authenticate a user and get JWT (LoginController)
- Request body (JSON):
  {
	"Identifier": "user@example.com",
	"Password": "password123"
  }
- Success (200 OK):
  {
	"Message": "success",
	"Data": {
	  "Token": "<jwt>",
	  "ExpiresAt": "2026-06-15T12:00:00Z",
	  "user": { "Id":1, "Name":"Admin", "Email":"admin@example.com", "Mobile":"12345", "Role":"admin", "CreatedOn":"..." }
	}
  }
- Errors:
  - 400 BadRequest when identifier/password missing
  - 401 Unauthorized when invalid credentials

Notes: Equivalent login endpoint also exists at POST /api/Auth/login.

---

2) POST /api/Auth/login
- Same behavior and payload as POST /api/Login (AuthController.login)

---

3) POST /api/Auth/register
- Purpose: Register a new user (AuthController.register)
- Request body (JSON) example:
  {
	"Name":"Alice",
	"Email":"alice@example.com",
	"Mobile":"9876543210",
	"Password":"Secret!23",
	"Role":"candidate"
  }
- Success (200 OK): ApiResponse<object> with Data { Id, Name, Email, Mobile, Role, CreatedOn }
- Errors:
  - 400 BadRequest if required fields missing
  - 409 Conflict if user with same email exists

Security: Password is hashed before storage.

---

4) POST /api/Auth/logout
- Purpose: Revoke current JWT (AuthController.logout)
- Authorization: Bearer token required in Authorization header
- Request: No body. Include header: Authorization: Bearer <token>
- Success (200 OK): { "Message":"success", "Data":"Logged out successfully." }
- Errors:
  - 400 BadRequest if no token provided

Note: There is also a dedicated POST /api/Logout endpoint (LogoutController) that performs equivalent revocation.

---

5) Drives API
Base route: /api/drives

Common notes: Create/Update/Delete require Admin role in JWT: include claim ClaimTypes.Role = "admin". Read endpoints allow anonymous.

5.1) GET /api/drives
- Authorization: Allow anonymous
- Request: none
- Success (200 OK): ApiResponse<object> with Data = array of DriveReadDto
- Example response Data element:
  {
	"DriveId": 5,
	"Title": "Campus Hiring",
	"CompanyName": "Acme Corp",
	"Description": "...",
	"City":"CityName",
	"Venue":"...",
	"DriveDate":"2026-06-15",
	"ReportingTime":"09:00:00",
	"QualificationRequired":"B.Tech",
	"ExperienceRequired":"0-2 years",
	"ContactPerson":"Jane Doe",
	"ContactEmail":"hr@acme.com",
	"Status":"Active",
	"CreatedBy":1,
	"CreatedOn":"2026-06-01T12:00:00Z",
	"UpdatedOn":null
  }

5.2) GET /api/drives/{id}
- Authorization: Allow anonymous
- Success (200 OK): ApiResponse<object> with Data = DriveReadDto
- Errors: 404 NotFound if not exists

5.3) POST /api/drives
- Authorization: Bearer token with Role = "admin"
- Request body: DriveCreateDto (see fields above)
- On server: CreatedBy is set from JWT NameIdentifier claim; Status set to "Active"; CreatedOn set automatically (code sets it and DB default exists)
- Success (200 OK): ApiResponse<object> with Data = DriveReadDto (created)
- Errors: 400 BadRequest for invalid payload, 401/403 for unauthorized

5.4) PUT /api/drives/{id}
- Authorization: Bearer token with Role = "admin"
- Request body: DriveUpdateDto (same as create)
- Success (200 OK): ApiResponse<object> { Message: "success", Data: { "DriveId": <id> } }
- Errors: 400 BadRequest, 404 NotFound

5.5) DELETE /api/drives/{id}
- Authorization: Bearer token with Role = "admin"
- Success (200 OK): ApiResponse<string> { Message: "success", Data: "Drive deleted." }
- Errors: 404 NotFound

---

6) GET /WeatherForecast
- Route: /WeatherForecast (WeatherForecastController)
- Authorization: none
- Request: none
- Success (200 OK): array of WeatherForecast objects
  WeatherForecast fields:
  - Date (DateOnly)
  - TemperatureC (int)
  - Summary (string)
- Example response element:
  { "Date":"2026-06-10","TemperatureC":23,"Summary":"Mild" }

---

ERROR HANDLING & STATUS CODES
- 200 OK: Successful requests return ApiResponse with Message="success" and Data payload.
- 400 BadRequest: Invalid payload, missing fields, or unable to parse token claims.
- 401 Unauthorized / 403 Forbidden: Invalid or missing token, or insufficient role.
- 404 NotFound: Resource not found (drives etc.)
- 409 Conflict: Registration conflict (email exists)
- 500 Internal Server Error: Unexpected errors

---

EXAMPLES: Obtain JWT and call protected endpoint
1. POST /api/Login (or /api/Auth/login) with valid credentials -> get Token in response.
2. Call POST /api/drives with header: Authorization: Bearer <Token> and body DriveCreateDto.

---

NOTES & RECOMMENDATIONS
- There are two login endpoints: POST /api/Login and POST /api/Auth/login. Use either but prefer consolidating to one.
- Two logout endpoints exist: POST /api/Auth/logout and POST /api/Logout (both revoke tokens). You may prefer one canonical endpoint.
- Drive CreatedOn is configured with SQL default GETUTCDATE() and also set in code at insert to ensure value.
- For production-scale token revocation, use persistent store (Redis/DB) instead of in-memory service.
- Run EF Core migrations after changes: `dotnet ef migrations add AddDrive && dotnet ef database update`.

---

If you want, I can:
- Produce a Postman collection (JSON) for import.
- Generate OpenAPI/Swagger examples and add operation-level examples.
- Consolidate duplicate auth endpoints and remove redundancy.
