# Drives API - Walk-In Job Portal

Base route: `/api/drives`

Common notes
- Project target: .NET 10
- Authentication: JWT Bearer. Admin-protected endpoints require a token with claim Role = "Admin".
- Successful responses follow ApiResponse<T> { Message, Data }.
- DateOnly format: `yyyy-MM-dd` (example: `2026-06-15`).
- TimeOnly format: `HH:mm:ss` (example: `09:30:00`).

Drive DTOs

DriveCreateDto / DriveUpdateDto
- Title (string, required, max 200)
- CompanyName (string, required, max 200)
- Description (string, required)
- City (string, required, max 100)
- Venue (string, required, max 300)
- DriveDate (DateOnly, required) — JSON as `"yyyy-MM-dd"`
- ReportingTime (TimeOnly, required) — JSON as `"HH:mm:ss"`
- QualificationRequired (string, required, max 200)
- ExperienceRequired (string, required, max 100)
- ContactPerson (string, required, max 100)
- ContactEmail (string, required, email)

DriveReadDto
- DriveId (int)
- All fields from create
- Status (string)
- CreatedBy (int)
- CreatedOn (DateTime, UTC)
- UpdatedOn (DateTime? , UTC)

---

1) Create drive

- POST /api/drives
- Authorization: Required (Admin)
- Request body (JSON example):

```json
{
  "Title": "Campus Hiring",
  "CompanyName": "Acme Corp",
  "Description": "Hiring for multiple positions",
  "City": "New York",
  "Venue": "Acme HQ, 123 Main St",
  "DriveDate": "2026-06-15",
  "ReportingTime": "09:00:00",
  "QualificationRequired": "B.Tech / BE",
  "ExperienceRequired": "0-2 years",
  "ContactPerson": "Jane Doe",
  "ContactEmail": "hr@acme.com"
}
```

- Success (200 OK):
  - Body: `ApiResponse<object>` where Data is DriveReadDto for the created drive.
- Errors:
  - 400 BadRequest — invalid payload or missing token claim
  - 401/403 — unauthorized if token invalid or role not Admin

---

2) List drives

- GET /api/drives
- Authorization: Allow anonymous
- Request: none
- Success (200 OK): `ApiResponse<object>` where Data is an array of DriveReadDto

---

3) Get drive by id

- GET /api/drives/{id}
- Authorization: Allow anonymous
- Success (200 OK): `ApiResponse<object>` where Data is DriveReadDto
- Errors:
  - 404 NotFound — if drive not found
  - 400 BadRequest — invalid id format

---

4) Update drive

- PUT /api/drives/{id}
- Authorization: Required (Admin)
- Request body: same schema as Create
- Success (200 OK): `ApiResponse<object>` with Data { "DriveId": <id> }
- Errors:
  - 400 BadRequest — invalid payload
  - 404 NotFound — drive not found
  - 401/403 — unauthorized if not Admin

---

5) Delete drive

- DELETE /api/drives/{id}
- Authorization: Required (Admin)
- Success (200 OK): `ApiResponse<string>` { Message: "success", Data: "Drive deleted." }
- Errors:
  - 404 NotFound — drive not found
  - 401/403 — unauthorized if not Admin

---

Examples: ApiResponse success single

```json
{
  "Message": "success",
  "Data": {
	"DriveId": 1,
	"Title": "Campus Hiring",
	"CompanyName": "Acme Corp",
	"DriveDate": "2026-06-15",
	"ReportingTime": "09:00:00",
	"CreatedOn": "2026-06-01T12:00:00Z",
	// ...other fields
  }
}
```

Failure example

```json
{
  "Message": "failure",
  "Data": "Invalid payload."
}
```

Testing notes
- Obtain an Admin JWT via the login endpoint and include header `Authorization: Bearer <token>` for protected endpoints.
- DateOnly/TimeOnly serialization depends on JSON options; the examples above are the expected formats.

Further help
- I can export a Postman collection or add OpenAPI/Swagger examples if you want.
