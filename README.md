# Marketing Performance Dashboard

A full-stack MERN application for managing marketing campaigns and leads with rich analytics, built with Express, MongoDB, React (Vite), Tailwind CSS, Shadcn UI components, Recharts, and JWT authentication.

## Features

- 🔐 **Role-based authentication** (Admin & Data Entry) with JWT and secure password hashing.
- 📊 **Admin analytics dashboard** with conversion trends, CPL/CPA metrics, and best campaign rankings.
- 🗂️ **Campaign & lead management** including full CRUD flows, modal forms, and duplicate-lead prevention.
- 🌗 **Modern UI/UX** built with Shadcn UI, Tailwind CSS, and responsive layouts, supporting light/dark themes.
- 🔔 **Realtime feedback** using `react-hot-toast` notifications and loading states for a polished experience.

## Project Structure

```
backend/    # Express API & MongoDB models
frontend/   # Vite + React client application
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB 6+ (local instance or connection string)

### Environment Variables

Copy the provided examples and update them with your own secrets.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/marketing_dashboard
JWT_SECRET=replace-with-strong-secret
```

`frontend/.env`
```
VITE_API_URL=http://localhost:5000/api
```

### Install Dependencies

From the repository root, install the backend and frontend packages.

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Run the Development Servers

In separate terminals:

```bash
# API server
cd backend
npm run dev

# React client
cd frontend
npm run dev
```

The React app will be available on `http://localhost:5173` and the API on `http://localhost:5000`.

### Seed an Admin User

Use the registration form (`/register`) to create the initial admin account. Afterwards, admins can create additional Admin or Data Entry users through the same form.

---

## Available Scripts

### Backend (`backend` directory)

- `npm run dev` – Start the API with hot reload via nodemon.
- `npm start` – Start the API in production mode.
- `npm run lint` – Lint the backend codebase using ESLint.

### Frontend (`frontend` directory)

- `npm run dev` – Launch the Vite development server.
- `npm run build` – Produce a production build.
- `npm run preview` – Preview the production build locally.

---

## API Overview

All endpoints are prefixed with `/api`.

| Method | Endpoint                | Description                                    |
| ------ | ----------------------- | ---------------------------------------------- |
| POST   | `/auth/register`        | Register a new user and receive a JWT token.   |
| POST   | `/auth/login`           | Log in with email/password and receive a JWT.  |
| GET    | `/auth/me`              | Fetch current authenticated user.              |
| GET    | `/campaigns`            | List campaigns (auth required).                |
| POST   | `/campaigns`            | Create a campaign (auth required).             |
| PUT    | `/campaigns/:id`        | Update a campaign (auth required).             |
| DELETE | `/campaigns/:id`        | Remove a campaign (auth required).             |
| GET    | `/leads`                | List leads (auth required).                    |
| POST   | `/leads`                | Create a lead (prevents duplicate phone).      |
| PUT    | `/leads/:id`            | Update a lead.                                 |
| DELETE | `/leads/:id`            | Delete a lead.                                 |
| GET    | `/dashboard/metrics`    | Admin-only analytics metrics endpoint.         |

Use the `Authorization: Bearer <token>` header for all secured routes.

---

## Frontend Highlights

- **State management** via a lightweight React context storing JWT/user data.
- **Protected routes** with role-based access (React Router v6).
- **Reusable Shadcn UI components** for forms, tables, dialogs, and buttons.
- **Recharts visualizations** for lead growth and conversion analytics.
- **Dark mode persistence** stored in `localStorage`.

---

## Production Build & Deployment

1. Build both projects:
   ```bash
   cd backend && npm install && npm run build # (if build script added)
   cd ../frontend && npm install && npm run build
   ```
2. Serve the backend with a Node.js process manager (PM2, Docker, etc.).
3. Deploy the frontend build output (`frontend/dist`) via any static host (Vercel, Netlify, S3+CloudFront, etc.).
4. Make sure `VITE_API_URL` points to the publicly accessible backend URL in production.

---

## Testing & Quality

- Backend linting is provided via ESLint (`npm run lint`).
- Vite will surface TypeScript/JSX errors during development.
- Additional automated tests can be added using tools such as Jest or Vitest as needed.

---

## License

This project is provided as part of a technical assessment and is not affiliated with the original `serverless-dns` codebase.
