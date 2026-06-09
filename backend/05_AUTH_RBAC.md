# Backend 05. Auth and RBAC

## 1. Password

Rules:

- Minimum 8 characters
- Must contain letter and number
- Hash with bcrypt before save
- Never return passwordHash in API response

## 2. JWT payload

```ts
type JwtPayload = {
  sub: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}
```

## 3. Access token

- Expiry: 1 day or shorter
- Stored in frontend state/localStorage or httpOnly cookie tùy triển khai
- For simplicity with separated backend/frontend, Bearer token is acceptable

## 4. Middleware

### Auth middleware

Pseudo:

```ts
const token = req.headers.authorization?.replace("Bearer ", "");
if (!token) throw new UnauthorizedError();
const payload = verifyJwt(token);
req.user = payload;
next();
```

### Role middleware

```ts
requireRole("ADMIN")
```

Only admin routes can pass.

## 5. Auth pages frontend

- `/login`
- `/register`
- protected `/account`
- protected `/admin`

## 6. Redirect rules

- Guest vào `/account` -> `/login`
- Customer vào `/admin` -> 403 hoặc home
- Admin login -> `/admin`
- Customer login -> `/account`

## 7. Seed admin

Admin account should be created by seed script.

Example:

```txt
email: admin@youniverse.local
password: Admin123456
```

Production must change password immediately.

## 8. Forgot password optional

Not required by current scope but can add later:

- Request reset link
- Email reset token
- Reset password
