---


---

<h1 id="api-documentation-for-user-registration-and-login">API Documentation for User Registration and Login</h1>
<h2 id="base-url">Base URL</h2>
<p>The base URL for the API will be:</p>
<pre><code>https://backend-i4mt.onrender.com/api
</code></pre>
<h2 id="authentication-api">Authentication API</h2>
<p>This API allows users to register and log in to the system.</p>
<h2 id="user-registration">1. User Registration</h2>
<h3 id="endpoint">Endpoint</h3>
<pre><code>POST /auth/register
</code></pre>
<h3 id="description">Description</h3>
<p>This endpoint registers a new user in the system. It requires the user to provide their full name, email, password, bio, preferences, experience level, terms agreement, and optionally subscribe to newsletter updates.</p>
<h3 id="request-body">Request Body</h3>
<p>The request body must be sent as JSON with the following fields:</p>

<table>
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>fullName</td>
<td>string</td>
<td>Yes</td>
<td>The full name of the user (must be at least 3 characters long).</td>
</tr>
<tr>
<td>email</td>
<td>string</td>
<td>Yes</td>
<td>The user’s email address (must be unique and valid).</td>
</tr>
<tr>
<td>password</td>
<td>string</td>
<td>Yes</td>
<td>The password for the user (must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character).</td>
</tr>
<tr>
<td>bio</td>
<td>string</td>
<td>Yes</td>
<td>A short biography for the user (must be between 50 and 2000 characters).</td>
</tr>
<tr>
<td>preferences</td>
<td>array</td>
<td>Yes</td>
<td>A list of the user’s preferences (between 1 and 5 items). Example: <code>["Crime", "Local News"]</code>.</td>
</tr>
<tr>
<td>experienceLevel</td>
<td>string</td>
<td>Yes</td>
<td>The user’s experience level. Must be one of: <code>["beginner", "intermediate", "experienced"]</code>.</td>
</tr>
<tr>
<td>termsAgreed</td>
<td>boolean</td>
<td>Yes</td>
<td>A boolean indicating whether the user agrees to the terms and conditions. Must be <code>true</code> for registration to succeed.</td>
</tr>
<tr>
<td>newsletterUpdates</td>
<td>boolean</td>
<td>No</td>
<td>A boolean indicating whether the user wants to receive newsletter updates (default is <code>false</code>).</td>
</tr>
</tbody>
</table><h3 id="response">Response</h3>
<p>A successful response will return a JWT token for authentication and a success message.</p>
<h4 id="success-response">Success Response:</h4>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span><span class="token string">"message"</span><span class="token punctuation">:</span><span class="token string">"User registered successfully"</span><span class="token punctuation">,</span>
<span class="token string">"token"</span><span class="token punctuation">:</span><span class="token string">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTQzMTkxM2M3MDgxNTdhNDQyMThhNSIsImVtYWlsIjoidXNlckBkYXJnZ2d1dXV1NTU1dTY2ZmZmZ2d3aW4uY29tIiwiaWF0IjoxNzQzMDA4MTQ2LCJleHAiOjE3NDMwMTE3NDZ9.UjDzUqQYpT3G4mgqMwhmbR6rHkll5yVSpvC2rgqWswU"</span><span class="token punctuation">}</span>
</code></pre>
<h4 id="error-response">Error Response:</h4>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Validation failed"</span><span class="token punctuation">,</span>
  <span class="token string">"errors"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token string">"field"</span><span class="token punctuation">:</span> <span class="token string">"email"</span><span class="token punctuation">,</span>
      <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Please enter a valid email address"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token string">"field"</span><span class="token punctuation">:</span> <span class="token string">"password"</span><span class="token punctuation">,</span>
      <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Password must contain at least one uppercase letter, one number, and one special character"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token string">"field"</span><span class="token punctuation">:</span> <span class="token string">"bio"</span><span class="token punctuation">,</span>
      <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Bio must be at least 50 characters"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre>
<h2 id="user-login">User Login</h2>
<h3 id="endpoint-1">Endpoint</h3>
<pre><code>POST /auth/login
</code></pre>
<h3 id="description-1">Description</h3>
<p>This endpoint is used by users to log in to the system. After a successful login, the user will receive a JWT token for future authentication.</p>
<h3 id="request-body-1">Request Body</h3>
<p>The request body must be sent as JSON with the following fields:</p>

<table>
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Required</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>email</td>
<td>string</td>
<td>Yes</td>
<td>The email address associated with the user’s account.</td>
</tr>
<tr>
<td>password</td>
<td>string</td>
<td>Yes</td>
<td>The user’s password for authentication.</td>
</tr>
</tbody>
</table><h3 id="response-1">Response</h3>
<p>A successful response will return a JWT token for authentication.</p>
<h4 id="success-response-1">Success Response:</h4>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Login successful"</span><span class="token punctuation">,</span>
  <span class="token string">"token"</span><span class="token punctuation">:</span> <span class="token string">"your_jwt_token_here"</span>
<span class="token punctuation">}</span>
</code></pre>
<h4 id="error-response-1">Error Response:</h4>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Invalid credentials"</span>
<span class="token punctuation">}</span>
</code></pre>
<h2 id="error-handling-and-validation">Error Handling and Validation</h2>
<p>Common Error Responses:</p>
<ul>
<li><strong>400 Bad Request</strong>: Invalid or missing parameters.</li>
<li><strong>401 Unauthorized</strong>: When the user is not authorized (wrong credentials or token expired).</li>
<li><strong>500 Internal Server Error</strong>: If an unexpected error occurs on the server.</li>
</ul>
<h4 id="validation-error-example">Validation Error Example:</h4>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Validation failed"</span><span class="token punctuation">,</span>
  <span class="token string">"errors"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token string">"field"</span><span class="token punctuation">:</span> <span class="token string">"bio"</span><span class="token punctuation">,</span>
      <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Bio must be at least 50 characters"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre>
<h2 id="jwt-authentication">JWT Authentication</h2>
<ul>
<li><strong>Authorization</strong>: For routes that require authentication, include the JWT token in the Authorization header as a Bearer token.</li>
</ul>
<h4 id="example">Example:</h4>
<pre><code>Authorization: Bearer 309110e8ce3f5a13768c11f205d1fbfebca51c79c4cd1885b9e57db18bf01714

</code></pre>
<ul>
<li><strong>Token Expiration</strong>: The JWT token expires in 1 hour. After that, the user must log in again to get a new token.</li>
</ul>
<h2 id="testing-the-api-with-postman">Testing the API with Postman</h2>
<h3 id="registering-a-user">1. Registering a User</h3>
<ul>
<li><strong>URL</strong>: <code>POST https://backend-i4mt.onrender.com/api/auth/register</code></li>
<li><strong>Headers</strong>: <code>Content-Type: application/json</code></li>
<li><strong>Body (JSON)</strong>:</li>
</ul>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"fullName"</span><span class="token punctuation">:</span> <span class="token string">"Darwin Paudel"</span><span class="token punctuation">,</span>
  <span class="token string">"email"</span><span class="token punctuation">:</span> <span class="token string">"darwin@darwinp.com"</span><span class="token punctuation">,</span>
  <span class="token string">"password"</span><span class="token punctuation">:</span> <span class="token string">"StrongPass123!"</span><span class="token punctuation">,</span>
  <span class="token string">"bio"</span><span class="token punctuation">:</span> <span class="token string">"This is a user bio with more than 50 characters to meet validation rules."</span><span class="token punctuation">,</span>
  <span class="token string">"preferences"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"Crime"</span><span class="token punctuation">,</span> <span class="token string">"Local News"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token string">"experienceLevel"</span><span class="token punctuation">:</span> <span class="token string">"beginner"</span><span class="token punctuation">,</span>
  <span class="token string">"termsAgreed"</span><span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token string">"newsletterUpdates"</span><span class="token punctuation">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
</code></pre>
<h4 id="expected-response">Expected Response:</h4>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"User registered successfully"</span><span class="token punctuation">,</span>
  <span class="token string">"token"</span><span class="token punctuation">:</span> <span class="token string">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTQzMjQ4M2M3MDgxNTdhNDQyMThhOCIsImVtYWlsIjoiZGFyd2luQGRhcndpbnAuY29tIiwiaWF0IjoxNzQzMDA4MzI5LCJleHAiOjE3NDMwMTE5Mjl9.zvWJMvo7p9dPNG6Y_FH2NmS06GQMK-p6fefT-QqsIv8"</span>
<span class="token punctuation">}</span>
</code></pre>
<h3 id="logging-in-a-user">2. Logging in a User</h3>
<ul>
<li><strong>URL</strong>: <code>POST https://backend-i4mt.onrender.com/api/auth/login</code></li>
<li><strong>Headers</strong>: <code>Content-Type: application/json</code></li>
<li><strong>Body (JSON)</strong>:</li>
</ul>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"email"</span><span class="token punctuation">:</span> <span class="token string">"darwin@darwinp.com"</span><span class="token punctuation">,</span>
  <span class="token string">"password"</span><span class="token punctuation">:</span> <span class="token string">"StrongPass123!"</span>
<span class="token punctuation">}</span>
</code></pre>
<h4 id="expected-response-1">Expected Response:</h4>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Login successful"</span><span class="token punctuation">,</span>
  <span class="token string">"token"</span><span class="token punctuation">:</span><span class="token string">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTQzMjQ4M2M3MDgxNTdhNDQyMThhOCIsImVtYWlsIjoiZGFyd2luQGRhcndpbnAuY29tIiwiaWF0IjoxNzQzMDA4NTk4LCJleHAiOjE3NDMwMTIxOTh9.DcsFW-4CpOseguvsltW4PASo1rcuTzE8ep6M7Vkzmho"</span>
<span class="token punctuation">}</span>
</code></pre>
<h3 id="example-of-error-response">3. Example of Error Response</h3>
<p>If validation fails, for example, if the bio is too short:</p>
<pre class=" language-json"><code class="prism  language-json"><span class="token punctuation">{</span>
  <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Validation failed"</span><span class="token punctuation">,</span>
  <span class="token string">"errors"</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token string">"field"</span><span class="token punctuation">:</span> <span class="token string">"bio"</span><span class="token punctuation">,</span>
      <span class="token string">"message"</span><span class="token punctuation">:</span> <span class="token string">"Bio must be at least 50 characters"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

</code></pre>

