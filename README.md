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
# API Documentation


# Endpoint: `GET /api/news/top-authors`

---

## 🔍 Description
Fetches the **top 10 authors** based on the number of **published** news articles (excluding drafts).

---

## Success Response

### HTTP Status: `200 OK`

### Response Format:
```json
[
  {
    "authorId": "661f2cb7200d47f378c2bd1f",
    "authorName": "Darwin Paudel",
    "totalPublishedNews": 12
  },
  {
    "authorId": "662000bc84f154e96f87f941",
    "authorName": "Alisha Tamang",
    "totalPublishedNews": 9
  }
  // ... up to 10 authors
]
```

## Error Responses

### 1. No Published News Found
- **HTTP Status:** `404 Not Found`
- **When:** No authors have any published and non-draft news.
- **Response:**
```json
{
  "message": "No published news found."
}
```


### 2. Internal Server Error

- **HTTP Status:** `500 Internal Server Error`
- **When:** Something unexpected fails on the server (e.g., database issue).
- **Response:**
```json
{
  "error": "Internal server error."
}
```


## Testing Notes for Frontend

- **On `200 OK`**, display the top authors with their names and number of published news articles.

- **On `404`**, show a user-friendly message like:  
  > "No top authors available yet."

- **On `500`**, show a fallback message like:  
  > "Something went wrong. Please try again later."


## 🔐 Auth Routes (`/api/auth`)

| Method | Endpoint                    | Description                                                  | Access    |
|--------|-----------------------------|--------------------------------------------------------------|-----------|
| POST   | /register/step1             | Start registration (email, password)                         | Public    |
| POST   | /register/step2             | Add bio and newsletter opt-in                                | Public    |
| POST   | /register/step3             | Add preferences and experience level                         | Public    |
| POST   | /register/finalize          | Final step - save user                                       | Public    |
| GET    | /register/destroy-session   | Destroy incomplete registration session                      | Public    |
| GET    | /session                    | Check ongoing registration session                           | Public    |
| POST   | /login                      | Login with email + password                                  | Public    |
| GET    | /verify-status              | Check author's verification status using email query param   | Public    |
| DELETE | /delete/:newsId (New)       | Delete your own news article (moves it to DeletedNews)       | Protected |
| DELETE | /profile                    | Delete logged-in user's account (requires password)          | Protected |
| GET    | /profile                    | Get logged-in user's profile                                 | Protected |
| PUT    | /profile                    | Update logged-in user's profile                              | Protected |
| GET    | /drafts (New)               | Get all draft news articles of the currently logged-in author| Protected |


---

## 📰 News Routes (`/api/news`)

| Method | Endpoint                    | Description                                                      | Access  |
|--------|-----------------------------|------------------------------------------------------------------|---------|
| POST   | /                           | Upload a news article (image + content)                          | Author  |
| PUT    | /:newsId/edit               | Edit an existing news article by the logged-in author            | Author  |
| GET    | /author                     | Get news posted by the currently logged-in author                | Author  |
| GET    | /:id                        | Get a single news article by its unique newsId                   | Public  |
| GET    | /tags/:tag                  | Get all published news filtered by a specific tag                | Public  |
| GET    | /author/:authorId           | Get all published news by a public author's ID                   | Public  |
| GET    | /public/news                | Get all published news articles                                  | Public  |
| GET    | /top-authors (New)          | Get the top 10 authors based on the number of published news     | Public  |
| GET    | /top-categories (New)       | Get the top 10 categories based on the number of published news  | Public  |

> 📌 **News Upload/Edit Notes**:
> - Required fields: `title`, `tags[]`, `imageFile`, `contentFile`  
> - Optional: `isDraft` (boolean)  
> - Auto-generated fields: `newsId`, `createdAt`, `updatedAt`  
> - Uploads must be sent as `multipart/form-data`

---

## 🛠️ Admin Routes (`/api/admin`)

| Method | Endpoint                            | Description                                                        | Access   |
|--------|-------------------------------------|--------------------------------------------------------------------|----------|
| GET    | /pending-news                       | Get all news in "pending" state awaiting approval                  | Admin    |
| PUT    | /approve/:newsId                    | Approve a news article and change its state to "published"         | Admin    |
| PUT    | /reject/:newsId                     | Reject a news article and change its state to "rejected"           | Admin    |
| GET    | /authors/verified                   | Get all verified authors                                           | Admin    |
| GET    | /authors/unverified                 | Get all unverified authors                                         | Admin    |
| PUT    | /authors/approve/:userId            | Approve an author's verification status                            | Admin    |
| DELETE | /news/:newsId (New)                 | Delete a news article (moves it to `DeletedNews` collection)       | Admin    |
| DELETE | /author/:userId (New)               | Delete a user (moves it to `DeletedUser` collection)               | Admin    |
| GET    | /deleted-users (New)                | Get all deleted users                                              | Admin    |
| GET    | /deleted-news (New)                 | Get all deleted news articles                                      | Admin    |

> 📌 **Admin Notes**:
> - All admin routes (except GET on authors) require a Bearer `<token>` and "Admin" role  
> - News status transitions: pending → published or rejected  
> - Verified authors can be approved via a dedicated endpoint  

---

## 📌 General Notes

- All protected routes require a Bearer `<token>` in the Authorization header.  
- File uploads (`imageFile` and `contentFile`) must use `multipart/form-data`.  
- `tags[]` must be passed as an array of strings.  
- Authors must be verified before login access is granted.



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


