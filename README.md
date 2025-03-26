
# API Documentation for User Registration and Login

## Base URL
The base URL for the API will be:
```
https://backend-i4mt.onrender.com/api
```

## Authentication API
This API allows users to register and log in to the system.

## 1. User Registration

### Endpoint
```
POST /auth/register
```

### Description
This endpoint registers a new user in the system. It requires the user to provide their full name, email, password, bio, preferences, experience level, terms agreement, and optionally subscribe to newsletter updates.

### Request Body
The request body must be sent as JSON with the following fields:

| Field            | Type    | Required | Description |
|-----------------|---------|----------|-------------|
| fullName        | string  | Yes      | The full name of the user (must be at least 3 characters long). |
| email          | string  | Yes      | The user's email address (must be unique and valid). |
| password       | string  | Yes      | The password for the user (must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character). |
| bio            | string  | Yes      | A short biography for the user (must be between 50 and 2000 characters). |
| preferences    | array   | Yes      | A list of the user’s preferences (between 1 and 5 items). Example: `["Crime", "Local News"]`. |
| experienceLevel | string  | Yes      | The user's experience level. Must be one of: `["beginner", "intermediate", "experienced"]`. |
| termsAgreed    | boolean | Yes      | A boolean indicating whether the user agrees to the terms and conditions. Must be `true` for registration to succeed. |
| newsletterUpdates | boolean | No | A boolean indicating whether the user wants to receive newsletter updates (default is `false`). |

### Response
A successful response will return a JWT token for authentication and a success message.

#### Success Response:
```json
{"message":"User registered successfully",
"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTQzMTkxM2M3MDgxNTdhNDQyMThhNSIsImVtYWlsIjoidXNlckBkYXJnZ2d1dXV1NTU1dTY2ZmZmZ2d3aW4uY29tIiwiaWF0IjoxNzQzMDA4MTQ2LCJleHAiOjE3NDMwMTE3NDZ9.UjDzUqQYpT3G4mgqMwhmbR6rHkll5yVSpvC2rgqWswU"}
```

#### Error Response:
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter, one number, and one special character"
    },
    {
      "field": "bio",
      "message": "Bio must be at least 50 characters"
    }
  ]
}
```

## User Login

### Endpoint
```
POST /auth/login
```

### Description
This endpoint is used by users to log in to the system. After a successful login, the user will receive a JWT token for future authentication.

### Request Body
The request body must be sent as JSON with the following fields:

| Field    | Type   | Required | Description |
|----------|--------|----------|-------------|
| email    | string | Yes      | The email address associated with the user’s account. |
| password | string | Yes      | The user’s password for authentication. |

### Response
A successful response will return a JWT token for authentication.

#### Success Response:
```json
{
  "message": "Login successful",
  "token": "your_jwt_token_here"
}
```

#### Error Response:
```json
{
  "message": "Invalid credentials"
}
```

## Error Handling and Validation

Common Error Responses:
- **400 Bad Request**: Invalid or missing parameters.
- **401 Unauthorized**: When the user is not authorized (wrong credentials or token expired).
- **500 Internal Server Error**: If an unexpected error occurs on the server.

#### Validation Error Example:
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "bio",
      "message": "Bio must be at least 50 characters"
    }
  ]
}
```

## JWT Authentication

- **Authorization**: For routes that require authentication, include the JWT token in the Authorization header as a Bearer token.

#### Example:
```
Authorization: Bearer 309110e8ce3f5a13768c11f205d1fbfebca51c79c4cd1885b9e57db18bf01714

```

- **Token Expiration**: The JWT token expires in 1 hour. After that, the user must log in again to get a new token.

## Testing the API with Postman

### 1. Registering a User
- **URL**: `POST https://backend-i4mt.onrender.com/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body (JSON)**:
```json
{
  "fullName": "Darwin Paudel",
  "email": "darwin@darwinp.com",
  "password": "StrongPass123!",
  "bio": "This is a user bio with more than 50 characters to meet validation rules.",
  "preferences": ["Crime", "Local News"],
  "experienceLevel": "beginner",
  "termsAgreed": true,
  "newsletterUpdates": true
}
```

#### Expected Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTQzMjQ4M2M3MDgxNTdhNDQyMThhOCIsImVtYWlsIjoiZGFyd2luQGRhcndpbnAuY29tIiwiaWF0IjoxNzQzMDA4MzI5LCJleHAiOjE3NDMwMTE5Mjl9.zvWJMvo7p9dPNG6Y_FH2NmS06GQMK-p6fefT-QqsIv8"
}
```

### 2. Logging in a User
- **URL**: `POST https://backend-i4mt.onrender.com/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body (JSON)**:
```json
{
  "email": "darwin@darwinp.com",
  "password": "StrongPass123!"
}
```

#### Expected Response:
```json
{
  "message": "Login successful",
  "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTQzMjQ4M2M3MDgxNTdhNDQyMThhOCIsImVtYWlsIjoiZGFyd2luQGRhcndpbnAuY29tIiwiaWF0IjoxNzQzMDA4NTk4LCJleHAiOjE3NDMwMTIxOTh9.DcsFW-4CpOseguvsltW4PASo1rcuTzE8ep6M7Vkzmho"
}
```
