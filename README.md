# User Registration and Login API Documentation

## Base URL
The base URL for the API is:
```
https://backend-i4mt.onrender.com/api
```

---

## Authentication API
This API handles user authentication, including a three-step registration process and login functionality.

### 1. User Registration (Multi-Step Process)
The registration process is divided into three steps. Data from each step is temporarily stored in the session until completion.

#### Step 1: Register with Name, Email, and Password
- **Endpoint:** `POST /auth/register/step1`
- **Description:** The first step of registration. Validates and stores user data in the session.
- **Request Body:**

| Field      | Type   | Required | Description |
|------------|--------|----------|-------------|
| fullName   | string | Yes      | Must be between 3 and 100 characters long. |
| email      | string | Yes      | Must be a valid, unique email address. |
| password   | string | Yes      | Must be at least 8 characters long and include at least one uppercase letter, one number, and one special character. |

- **Response:**
```json
{
  "message": "Step 1 data stored in session"
}
```

---

#### Step 2: Register with Bio and Portfolio URL
- **Endpoint:** `POST /auth/register/step2`
- **Description:** The second step of registration. Validates and stores user bio and portfolio information.
- **Request Body:**

| Field           | Type    | Required | Description |
|----------------|---------|----------|-------------|
| bio           | string  | Yes      | Must be between 50 and 2000 characters. |
| portfolioURL  | string  | No       | Must be a valid URL (e.g., `facebook.com`). |
| newsletterUpdates | boolean | No | Defaults to `false`. |

- **Response:**
```json
{
  "message": "Step 2 data stored in session"
}
```

---

#### Step 3: Register with Preferences, Experience Level, and Terms Agreement
- **Endpoint:** `POST /auth/register/step3`
- **Description:** The final step of registration. Completes user creation and stores data in the database.
- **Request Body:**

| Field            | Type   | Required | Description |
|-----------------|--------|----------|-------------|
| preferences     | array  | Yes      | User-selected preferences (1 to 5 options). |
| experienceLevel | string | Yes      | Must be `beginner`, `intermediate`, or `experienced`. |
| termsAgreed     | boolean | Yes     | Must be `true` (user must agree to terms). |

- **Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWE2MWNlZTFhOTUxNjUzNmI1OWMyNCIsImVtYWlsIjoid3d3aW4ucGF1ZGRlbEBleGFtcGxlLmNvbSIsImlhdCI6MTc0MzQxMzcyNywiZXhwIjoxNzQzNDE3MzI3fQ._ecr-FsRFHmd2PG19ZWS18xJBsausjeZ8a3D"
}
```

---

### 2. User Login
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticates a user with email and password.
- **Request Body:**

| Field   | Type   | Required | Description |
|---------|--------|----------|-------------|
| email   | string | Yes      | User's registered email. |
| password| string | Yes      | User's password. |

- **Response:**
```json
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZWE2MWNlZTFhOTUxNjUzNmI1OWMyNCIsImVtYWlsIjoid3d3aW4ucGF1ZGRlbEBleGFtcGxlLmNvbSIsImlhdCI6MTc0MzQxMzcyNywiZXhwIjoxNzQzNDE3MzI3fQ._ecr-FsRFHmd2PG19ZWS18xJBsausjeZ8a3DwYH5SnE"
}
```

## Error Handling
All API responses return proper HTTP status codes. Errors are handled using the `errorHandler` middleware, returning structured error messages.

---

## Technologies Used
- **Node.js** with **Express.js** for backend API.
- **MongoDB** with **Mongoose** for database management.
- **JWT** for authentication.
- **Joi** for validation.
- **Session storage** for temporary data storage during registration.
- **Bcrypt.js** for password hashing.
- **dotenv** for environment variables.

---

## How to Run Locally
1. Clone the repository and install dependencies:
```sh
npm install
```
2. Set up `.env` file with required values.
3. Start the server:
```sh
npm start
```
4. API will be available at `http://localhost:5000/api`

---

This API ensures a secure and structured multi-step registration process with session handling and data validation.


