# TaskFlow — Full Stack Task Manager

> A production-ready Kanban task management application built with React, Node.js, and MongoDB Atlas.

## Live Demo | GitHub Repo

| Resource | Link |
|---|---|
| 🌐 Live Demo | [taskflow.vercel.app](https://taskflow.vercel.app) *(deploy to activate)* |
| 📦 GitHub Repo | [github.com/your-username/taskflow](https://github.com/your-username/taskflow) |

---

## Features

- **🔐 JWT Authentication** — Secure register/login/logout with token persistence
- **📋 Kanban Board** — Three-column board: Todo · In Progress · Done
- **🖱️ Drag & Drop** — Powered by `@hello-pangea/dnd` with optimistic updates
- **✏️ Full Task CRUD** — Create, read, update, delete tasks via modals
- **🔍 Real-Time Search** — Client-side search across title and description
- **🎯 Stage Filtering** — Sidebar links filter board by stage instantly
- **📊 Stats Bar** — Live count of tasks per stage
- **🌙 Dark Mode** — Dark-first with light mode toggle; persisted in localStorage
- **📱 Responsive** — Columns stack on mobile; sidebar becomes a drawer
- **🔔 Toast Notifications** — Success/error toasts on all CRUD operations
- **🛡️ Security** — Helmet, CORS, rate limiting, bcrypt, per-user data isolation
- **⚡ Password Strength** — Visual indicator on registration
- **🎨 Modern UI** — Glassmorphism, smooth animations, gradient backgrounds

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS |
| **State** | React Context + useReducer |
| **HTTP** | Axios with interceptors |
| **Drag & Drop** | @hello-pangea/dnd |
| **Notifications** | react-hot-toast |
| **Icons** | lucide-react |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Security** | Helmet, CORS, express-rate-limit |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **MongoDB Atlas** account (free tier works)
- **Git**

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/taskflow.git
cd taskflow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables & Zero-Config Fallback

> [!TIP]
> **Zero-Config Development:** This codebase features an automated **In-Memory MongoDB fallback** and **macOS Port Conflict Resolution (Port 5001)** out of the box. If a local MongoDB instance is not running, the backend dynamically spins up a local database in memory so you can test registration and task features instantly!

**Backend** — create `backend/.env` (copy from `backend/.env.example`):

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_key_here_change_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
*(Note: We use port `5001` on macOS because port `5000` is reserved by the OS AirPlay Receiver service).*

**Frontend** — create `frontend/.env` (copy from `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5001/api
```

### Run in Development

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# Server starts at http://localhost:5001 (auto-falls back to local In-Memory DB if needed!)

# Terminal 2 — Frontend
cd frontend
npm run dev
# App starts at http://localhost:5173
```

### Run in Production

```bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend — build static files
cd frontend
npm run build
npm run preview
```

---

## API Documentation

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `GET` | `/api/auth/profile` | 🔒 JWT | Get current user profile |
| `GET` | `/api/tasks` | 🔒 JWT | Get all tasks (filter: `?stage=&search=`) |
| `POST` | `/api/tasks` | 🔒 JWT | Create a new task |
| `PUT` | `/api/tasks/:id` | 🔒 JWT | Update task title/description/stage |
| `DELETE` | `/api/tasks/:id` | 🔒 JWT | Delete a task |
| `PATCH` | `/api/tasks/:id/stage` | 🔒 JWT | Update only the task stage |

### Response Shape

All responses use a consistent shape:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "Error description" }
```

### Rate Limiting

Auth routes are rate-limited to **100 requests per 15 minutes** per IP.

---

## Deployment

### 1. MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free account
2. Create a new **Project** and **Cluster** (free M0 tier)
3. Under **Database Access** → Add a database user with read/write access
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere) for cloud deployment
5. Click **Connect** → **Drivers** → copy the connection string
6. Replace `<username>` and `<password>` in the URI with your credentials

### 2. Backend on Render

1. Push your code to GitHub
2. Go to [Render](https://render.com) and sign up
3. Click **New** → **Web Service** → connect your GitHub repo
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: `Node`
5. Add environment variables in Render dashboard:
   ```
   MONGO_URI = <your Atlas connection string>
   JWT_SECRET = <long random secret>
   CLIENT_URL = https://your-app.vercel.app
   NODE_ENV = production
   ```
6. Deploy — Render will assign a URL like `https://taskflow-api.onrender.com`

### 3. Frontend on Vercel

1. Go to [Vercel](https://vercel.com) and sign up
2. Click **Add New** → **Project** → import your GitHub repo
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   ```
   VITE_API_URL = https://taskflow-api.onrender.com/api
   ```
5. Deploy — Vercel will assign a URL like `https://taskflow.vercel.app`
6. Go back to Render and update `CLIENT_URL` to your Vercel URL

---

## Folder Structure

```
taskflow/
├── backend/
│   ├── server.js               # Express app entry, CORS, error handler
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js               # Mongoose connect with retry logic
│   ├── models/
│   │   ├── User.js             # User schema with bcrypt hashing
│   │   └── Task.js             # Task schema with stage enum
│   ├── controllers/
│   │   ├── authController.js   # register, login, getProfile
│   │   └── taskController.js   # getTasks, createTask, updateTask, deleteTask, updateStage
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/* with rate limiting
│   │   └── taskRoutes.js       # /api/tasks/* all protected
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── errorMiddleware.js  # 404 + global error handler
│   └── utils/
│       └── generateToken.js    # JWT signing utility
│
└── frontend/
    ├── index.html              # HTML entry with SEO meta tags
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx            # React entry point
        ├── App.jsx             # Routes + providers
        ├── index.css           # Tailwind + custom CSS
        ├── context/
        │   ├── AuthContext.jsx # Auth state with useReducer
        │   └── TaskContext.jsx # Task state with optimistic updates
        ├── hooks/
        │   ├── useAuth.js
        │   └── useTasks.js
        ├── services/
        │   └── api.js          # Axios instance + interceptors
        ├── utils/
        │   └── helpers.js      # formatDate, getStageColor, truncate, etc.
        ├── layouts/
        │   └── DashboardLayout.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskModal.jsx
        │   ├── KanbanColumn.jsx
        │   ├── StatsBar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── LoadingSpinner.jsx
        │   ├── EmptyState.jsx
        │   └── ConfirmDialog.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── DashboardPage.jsx
            └── NotFoundPage.jsx
```

---

## Assumptions & Tradeoffs

| Decision | Rationale |
|---|---|
| JWT in localStorage | Simpler than httpOnly cookies for SPA; sufficient for this scope |
| Optimistic drag-and-drop | Better UX; reverts on API failure |
| Client-side search | Avoids extra API calls; sufficient for personal task lists |
| useReducer over Redux | Appropriate complexity level; avoids extra dependency |
| MongoDB Atlas free tier | Zero-cost hosting for database |
| express-async-handler | Reduces boilerplate try/catch in controllers |
| No pagination | Personal task manager scope; users unlikely to have 1000+ tasks |

---

## Future Improvements

- [ ] **Task due dates** with calendar picker and overdue indicators
- [ ] **Labels/tags** for categorization and color coding
- [ ] **Team collaboration** — shared boards with invite links
- [ ] **Activity log** — timeline of changes per task
- [ ] **Subtasks** — checklist items within a task
- [ ] **File attachments** — S3/Cloudinary integration
- [ ] **Email notifications** — overdue task reminders
- [ ] **OAuth** — Google and GitHub sign-in
- [ ] **Task priority** — P1/P2/P3 with color sorting
- [ ] **Export** — Export board as CSV or PDF
- [ ] **Dark/light mode** — System preference auto-detection
- [ ] **Unit & E2E tests** — Jest + Playwright coverage

---

## Screenshots

![Login Page](./docs/screenshots/login.png)
![Dashboard Kanban Board](./docs/screenshots/dashboard.png)
![Task Creation Modal](./docs/screenshots/create-task.png)
![Mobile View](./docs/screenshots/mobile.png)

---

## License

MIT © TaskFlow
