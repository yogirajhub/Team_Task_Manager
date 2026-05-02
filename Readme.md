# Team Task Manager

> A production-grade full-stack web application for managing projects, assigning tasks, and tracking team progress — with role-based access control built in.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Role-Based Access Control](#-role-based-access-control)
- [How Roles Work](#-how-roles-work)
- [Common Issues](#-common-issues--fixes)
- [License](#-license)

---

## About

**Team Task Manager** is a full-stack productivity application where teams can:

- Create and manage projects
- Invite team members with role assignment
- Create, assign and track tasks with due dates
- Monitor progress through a real-time analytics dashboard
- Enforce permissions via Admin / Member roles

Built with a **senior-engineer mindset** — modular architecture, clean separation of concerns, and security enforced at the backend layer.

---

## Features

| Feature | Description |
|---|---|
| **JWT Authentication** | Secure signup/login, bcrypt hashing, auto logout on expiry |
| **Project Management** | Create, view, delete projects — creator auto-assigned as Admin |
| **Team Management** | Add/remove members by email, assign Admin or Member role |
| **Task Management** | Full CRUD — assign tasks, set priority, track status, due dates |
| **Dashboard Analytics** | Total, completed, pending, overdue stats + progress bar |
| **RBAC** | Backend middleware enforces all permissions per role |

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JWT + bcrypt | Authentication + password hashing |
| express-validator | Server-side input validation |
| helmet + cors + morgan | Security headers + logging |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework + build tool |
| React Router DOM v6 | Client-side routing |
| Tailwind CSS | Utility-first responsive styling |
| Axios | HTTP client with interceptors |
| Context API + useReducer | Global auth state management |
| react-hot-toast | Toast notification system |

---

## Project Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Signup, login, me
│   │   ├── projectController.js    # Project CRUD + members
│   │   ├── taskController.js       # Task CRUD + status
│   │   └── dashboardController.js  # Analytics
│   ├── middlewares/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── roleMiddleware.js       # Admin / Member enforcement
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── dashboardRoutes.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── taskValidator.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── apiResponse.js
│   ├── .env
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/             # Sidebar, Navbar, Layout
        │   ├── tasks/              # TaskCard, TaskForm, TaskTable
        │   └── ui/                 # Button, Badge, Card, Modal
        ├── context/
        │   └── AuthContext.jsx     # Global auth state
        ├── hooks/
        │   ├── useAuth.js          # Auth + role helpers
        │   └── useTasks.js         # Task state + actions
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Projects.jsx
        │   └── ProjectDetail.jsx
        ├── services/
        │   ├── api.js              # Axios instance + interceptors
        │   ├── authService.js
        │   ├── projectService.js
        │   └── taskService.js
        ├── utils/
        │   └── helpers.js
        ├── App.jsx
        └── main.jsx
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **MongoDB** installed locally OR a MongoDB Atlas URI
- **3 separate terminal windows**

---

### Step 1 — Start MongoDB `Terminal 1`

> **Always start MongoDB FIRST — before running the backend.**
> Every time you restart your PC, run this first.

```bash
# Windows — Create data folder (one time only)
md C:\data\db

# Start MongoDB
mongod --dbpath "C:\data\db"
```

**Success:** You'll see `Waiting for connections on port 27017`

> Keep this terminal **open and running** at all times.

---

### Step 2 — Backend Setup `Terminal 2`

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Then start the server:

```bash
npm run dev
```

✅ **Success:** You'll see `✅ Server running on port 5000` and `MongoDB Connected: localhost`

---

### Step 3 — Frontend Setup `Terminal 3`

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then start the app:

```bash
npm run dev
```

✅ **Success:** Open [http://localhost:3000](http://localhost:3000) in your browser

---

### Terminal Overview

| Terminal | Command | Status |
|---|---|---|
| **Terminal 1** | `mongod --dbpath "C:\data\db"` | ✅ Keep open, never close |
| **Terminal 2** | `cd backend` → `npm run dev` | ✅ Backend server |
| **Terminal 3** | `cd frontend` → `npm run dev` | ✅ Frontend app |

---

## 🔧 Environment Variables

### `backend/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/task-manager` | MongoDB connection string |
| `JWT_SECRET` | `your_secret_key` | JWT signing secret — keep private |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `NODE_ENV` | `development` | Environment mode |
| `CLIENT_URL` | `http://localhost:3000` | Frontend URL for CORS |

### `frontend/.env`

| Variable | Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Backend API base URL |

> **Always restart the server after editing `.env` files.** Node.js does not hot-reload environment variables.

---

## API Reference

All API responses follow this standard format:

```json
{ "success": true,  "message": "...", "data": {} }
{ "success": false, "message": "...", "errors": [] }
```

---

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login + receive JWT token |
| `GET` | `/api/auth/me` | JWT | Get current user profile |

---

### Projects

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects` | JWT | List all my projects |
| `POST` | `/api/projects` | JWT | Create a new project |
| `GET` | `/api/projects/:id` | Member | Get single project detail |
| `DELETE` | `/api/projects/:id` | Admin | Delete project + all its tasks |
| `POST` | `/api/projects/:id/members` | Admin | Add member by email |
| `DELETE` | `/api/projects/:id/members/:userId` | Admin | Remove a member |

---

### Tasks

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects/:projectId/tasks` | Member | List all tasks in a project |
| `POST` | `/api/projects/:projectId/tasks` | Admin | Create a task |
| `PUT` | `/api/tasks/:id` | Admin | Update task details |
| `PATCH` | `/api/tasks/:id/status` | Member | Update own task status |
| `DELETE` | `/api/tasks/:id` | Admin | Delete a task |

---

### Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | JWT | Get analytics: stats, overdue, my tasks |

---

## Role-Based Access Control

> Roles are assigned **per project** — not at account level.
> The same user can be **Admin** in Project A and **Member** in Project B.

| Permission | Admin | Member |
|---|---|---|
| Create project | ✅ | ✅ (auto Admin) |
| Add / remove members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Assign tasks to members | ✅ | ❌ |
| Edit / delete any task | ✅ | ❌ |
| Update own task status | ✅ | ✅ |
| View project & tasks | ✅ | ✅ |
| View dashboard | ✅ All tasks | ✅ Own tasks |

> **Security Note:** Backend middleware enforces ALL permissions. Frontend role-hiding is UX only — the real security lives on the server.

---

## How Roles Work

```
Every user signs up as a regular user.

Admin role is assigned INSIDE a project:
  → You CREATE a project  = you are Admin of that project
  → You are INVITED       = you are Member (unless Admin assigns you Admin role)

Same person can be:
  → Admin   in Project A  (they created it)
  → Member  in Project B  (they were invited)
```

### How to identify your role in the UI

| Location | What you see |
|---|---|
| Projects page — each card | `👑 Admin` or `👤 Member` badge |
| Project detail — top of page | `👑 Admin` or `👤 Member` badge |
| Project detail — buttons | `+ New Task` + `+ Add Member` visible = you are Admin |
| Task rows | Edit / Delete buttons visible = you are Admin |

---

## Common Issues & Fixes

| Problem | Fix |
|---|---|
| `CORS error` in browser | Check `CLIENT_URL` in `backend/.env` matches your frontend port |
| Cannot connect to MongoDB | Run `mongod --dbpath "C:\data\db"` in a separate terminal |
| `Token invalid` / auto logout | Clear `localStorage` in browser DevTools → login again |
| Port 5000 already in use | Run `netstat -ano \| findstr :5000` then kill the process |
| White screen after refresh | Normal — React Router handles client-side routing |
| `npm install` fails (JSON error) | `package.json` is empty — paste the full JSON content first |
| Tasks not loading | Check browser console — usually `401` (token) or `404` (route) |
| Cannot add member | User must have an existing account in this app |
| Dashboard shows nothing | Restart backend after `.env` changes — hard refresh browser `Ctrl+Shift+R` |

---


<div align="center">

Built with ❤️ by Yogiraj Gautam 

</div>