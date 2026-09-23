# CM.AI API Reference

All application requests should go through the gateway at `http://localhost:8000`. The gateway forwards each `/api/*` path to the matching internal service.

## Authentication

Authentication uses an HTTP-only `session` cookie.

1. Call `POST /api/auth/login` with a Firebase ID token.
2. Store and send cookies on subsequent requests (`credentials: "include"` in browser clients).
3. The gateway validates the session in Redis and forwards the authenticated user's ID to protected services in the `x-user-id` header.

Protected routes return `401` when the cookie is missing or expired. Do not manually set `x-user-id` from the frontend.

## Gateway Routes

| Method | Gateway endpoint | Auth | Description |
|---|---|---:|---|
| `POST` | `/api/auth/login` | No | Verify a Firebase ID token and create a session. |
| `POST` | `/api/auth/logout` | No | Delete the current session and clear the cookie. |
| `POST` | `/api/auth/use-coins` | No* | Deduct interview coins from the current session user. |
| `POST` | `/api/auth/add-coins` | No* | Add interview coins to the current session user. |
| `GET` | `/api/me` | Yes | Return the authenticated user stored in the session. |
| `POST` | `/api/resume/upload` | Yes | Upload and analyze a resume. |
| `GET` | `/api/resume/get-resume` | Yes | Return the current user's resume. |
| `POST` | `/api/interview/start` | Yes | Generate and start an interview. |
| `POST` | `/api/interview/answer` | Yes | Submit an answer and receive feedback or the next question. |
| `GET` | `/api/interview/all-interview` | Yes | List the current user's interviews. |
| `GET` | `/api/interview/:id` | Yes | Return one interview owned by the current user. |
| `POST` | `/api/roadmap` | Yes | Generate a personalized roadmap. |
| `GET` | `/api/roadmap/all` | Yes | List the current user's roadmaps. |
| `GET` | `/api/roadmap/:id` | Yes | Return one roadmap owned by the current user. |
| `POST` | `/api/billing/create-order` | Yes | Create a Razorpay order. |
| `POST` | `/api/billing/verify-payment` | Yes | Verify a Razorpay payment signature. |

`use-coins` and `add-coins` currently reach the auth service without gateway `isAuth` middleware, but the service itself still requires the `session` cookie. The `No*` label reflects this implementation detail.

## Request Examples

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "token": "<firebase-id-token>"
}
```

Successful login returns `201` and sets the `session` cookie.

### Logout

```http
POST /api/auth/logout
Cookie: session=<session-id>
```

### Coin Management

```http
POST /api/auth/use-coins
Content-Type: application/json
Cookie: session=<session-id>

{
  "coins": 10,
  "action": "deduct"
}
```

```http
POST /api/auth/add-coins
Content-Type: application/json
Cookie: session=<session-id>

{
  "coins": 300
}
```

### Current User

```http
GET /api/me
Cookie: session=<session-id>
```

Example response:

```json
{
  "success": true,
  "user": {
    "userId": "<user-id>",
    "username": "Candidate",
    "email": "candidate@example.com",
    "interviewCoin": 300
  }
}
```

### Resume

Upload a PDF or supported resume file as the `resume` multipart field:

```http
POST /api/resume/upload
Content-Type: multipart/form-data
Cookie: session=<session-id>

resume=<file>
```

```http
GET /api/resume/get-resume
Cookie: session=<session-id>
```

### Interviews

Start an interview:

```http
POST /api/interview/start
Content-Type: application/json
Cookie: session=<session-id>

{
  "type": "technical",
  "role": "Backend Developer",
  "useResume": true,
  "resume": {}
}
```

`type` must be `technical` or `hr`. The response includes `interviewId`, `currentQuestion`, `totalQuestions`, and the first `question`.

Submit an answer:

```http
POST /api/interview/answer
Content-Type: application/json
Cookie: session=<session-id>

{
  "interviewId": "<interview-id>",
  "answer": "My answer to the current question"
}
```

Read interviews:

```http
GET /api/interview/all-interview
Cookie: session=<session-id>
```

```http
GET /api/interview/<interview-id>
Cookie: session=<session-id>
```

### Roadmaps

Generate a roadmap:

```http
POST /api/roadmap
Content-Type: application/json
Cookie: session=<session-id>

{
  "role": "Backend Developer",
  "targetPackage": "20 LPA",
  "useResume": true,
  "resume": {}
}
```

When `useResume` is `true`, `resume` is required.

```http
GET /api/roadmap/all
Cookie: session=<session-id>
```

```http
GET /api/roadmap/<roadmap-id>
Cookie: session=<session-id>
```

### Billing

The currently configured plan is `starter`, priced at INR 199 for 300 interview coins.

Create an order:

```http
POST /api/billing/create-order
Content-Type: application/json
Cookie: session=<session-id>

{
  "planId": "starter"
}
```

Verify a payment:

```http
POST /api/billing/verify-payment
Content-Type: application/json
Cookie: session=<session-id>

{
  "razorpay_order_id": "<order-id>",
  "razorpay_payment_id": "<payment-id>",
  "razorpay_signature": "<signature>"
}
```

## Direct Service Routes

These routes are intended for internal service-to-service use. Public clients should use the gateway paths above.

| Service | Default port | Direct routes |
|---|---:|---|
| Auth | `8001` | `POST /login`, `POST /logout`, `POST /use-coins`, `POST /add-coins` |
| Resume | `8002` | `POST /upload`, `GET /get-resume` |
| Interview | `8003`* | `POST /start`, `POST /answer`, `GET /all-interview`, `GET /:id` |
| Roadmap | `8004`* | `POST /`, `GET /all`, `GET /:id` |
| Billing | `8005`* | `POST /create-order`, `POST /verify-payment` |

`8003`, `8004`, and `8005` are the recommended port assignments for the interview, roadmap, and billing services. Their current `index.js` files fall back to `8002` when `PORT` is not set, so set unique `PORT` values before starting all services together.

## Gateway Environment Variables

```env
PORT=8000
AUTH_SERVICE_URL=http://localhost:8001
RESUME_SERVICE_URL=http://localhost:8002
INTERVIEW_SERVICE_URL=http://localhost:8003
ROADMAP_SERVICE_URL=http://localhost:8004
BILLING_SERVICE_URL=http://localhost:8005
```

The gateway's CORS configuration allows `http://localhost:5173` with credentials. JSON and URL-encoded request bodies are accepted up to `25mb` for auth and interview routes. Resume uploads must retain their original multipart boundary and content type.

## Common Status Codes

| Status | Meaning |
|---:|---|
| `200` | Request completed successfully. |
| `201` | User or roadmap/order-related resource was created. |
| `400` | Missing or invalid request data, session, or payment fields. |
| `401` | Missing or expired gateway session. |
| `403` | Insufficient interview coins or invalid payment signature. |
| `404` | Requested user, interview, resume, roadmap, or billing record was not found. |
| `500` | Unexpected service, database, provider, or AI processing error. |
