# TrueGrit — Fitness Tracker

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern full-stack fitness tracking web app to log workouts, track nutrition, manage goals, and monitor your progress — with a clean light/dark UI and secure authentication.

🔗 **Live Demo**: [https://truegrit.vercel.app](https://truegrit.vercel.app)

---

## Features

### Dashboard
- Weekly activity bar chart (Recharts)
- Calorie trend area chart
- Stats overview — total calories, workouts, active goals
- Workout streak counter
- Recent activity feed with quick "View All" navigation
- Goal progress summary

### Workout / Activity Logging
- Log workouts with type, duration, intensity (Low / Medium / High), and calories
- Quick-select chips for common activity types (Running, Cycling, Swimming, HIIT, Yoga, Walking)
- Full history with delete support
- Calorie burn reference table

### Nutrition Tracking
- Log meals by type (Breakfast / Lunch / Dinner / Snack)
- Quick-select common foods with preset macros
- Live macro ratio preview bar (protein / carbs / fat)
- Meal history with full nutritional breakdown
- Daily nutrition tips sidebar

### Goal Management
- Create goals with type, target value, and deadline
- Color-coded goal types (Weight Loss, Muscle Gain, Cardio, Flexibility, Nutrition)
- Active vs. Completed goal tracking
- Days remaining badge

### Exercise Library
- 10 curated exercises across Strength / Cardio / Core
- Per-exercise countdown timer with image overlay
- Adjustable duration (15s increments)
- Step-by-step instructions with animated expand
- One-tap logging to activity history

### Profile & Recommendations
- BMI calculator with live visual bar
- Fitness level selector (Beginner → Elite)
- AI-style diet and workout recommendation cards
- Nutrition history log

### UI & UX
- Collapsible sidebar (desktop) with smooth Framer Motion animation
- Bottom navigation bar (mobile)
- Light / Dark mode toggle (CSS custom properties)
- Fully responsive — mobile-first design
- Clerk authentication (Email + OAuth)
- Toast notifications (React Hot Toast)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS 3 (darkMode: class) + CSS custom properties |
| Routing | React Router DOM v7 |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Auth | Clerk |
| Notifications | React Hot Toast |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Deployment | Vercel (frontend) + Render/Railway (backend) |

---

## Project Structure

```
TrueGrit/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── clerk.js            # Clerk middleware setup
│   ├── controllers/
│   │   ├── activityController.js
│   │   ├── goalsController.js
│   │   ├── nutritionController.js
│   │   ├── profileController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── Activity.js
│   │   ├── Goal.js
│   │   ├── Nutrition.js
│   │   ├── Profile.js
│   │   └── User.js
│   ├── routes/
│   │   ├── activity.js
│   │   ├── goals.js
│   │   ├── nutrition.js
│   │   ├── profile.js
│   │   └── user.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── ActivityLog.jsx     # Workout logging page
        │   ├── BottomNav.jsx       # Mobile bottom navigation
        │   ├── Dashboard.jsx       # Main dashboard
        │   ├── ExcerciseList.jsx   # Exercise library
        │   ├── Goals.jsx           # Goal tracking
        │   ├── NavBar.jsx          # Nav composer (sidebar + bottom nav)
        │   ├── NutritionLog.jsx    # Nutrition logging page
        │   ├── Profile.jsx         # User profile & recommendations
        │   └── Sidebar.jsx         # Desktop collapsible sidebar
        ├── lib/
        │   └── api.js              # Axios instance with Clerk Bearer token
        ├── theme/
        │   └── modernTheme.js      # Theme color tokens
        ├── App.jsx                 # Root — routes, sidebar state, layout
        └── index.css               # CSS variables, dark mode overrides, utility classes
```

---

## API Endpoints

All endpoints require a `Authorization: Bearer <clerk_token>` header.

### Activity
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/activity` | Get all activities for the authenticated user |
| POST | `/api/activity` | Log a new activity |
| DELETE | `/api/activity/:id` | Delete an activity by ID |

### Nutrition
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/nutrition` | Get all nutrition logs |
| POST | `/api/nutrition` | Log a meal |
| DELETE | `/api/nutrition/:id` | Delete a nutrition log |

### Goals
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/goals` | Get all goals |
| POST | `/api/goals` | Create a new goal |
| PUT | `/api/goals/:id` | Update a goal |
| DELETE | `/api/goals/:id` | Delete a goal |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get user profile |
| POST | `/api/profile` | Create or update profile |

### User
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user` | Get user data |
| POST | `/api/user` | Create or sync user |

---

## Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or [Atlas](https://cloud.mongodb.com))
- [Clerk](https://clerk.com) account

### 1. Clone

```bash
git clone https://github.com/Snehagupta00/TrueGrit.git
cd TrueGrit
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/truegrit
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
PORT=5000
```

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Clerk Configuration
- Go to your Clerk dashboard → Allowed redirect URLs
- Add `http://localhost:5173`
- Enable Email and/or Google sign-in

---

## Deployment

### Backend (Render / Railway)
1. Push `backend/` to your repo
2. Set environment variables:
   ```
   MONGO_URI=...
   CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   ```
3. Start command: `node server.js`

### Frontend (Vercel)
1. Connect your repo to Vercel
2. Set environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   ```
3. Framework preset: Vite

### Clerk Production
- Update redirect URLs to your production domain
- Switch from `pk_test_` / `sk_test_` to live keys

---

## Dark / Light Mode

Theme is implemented via CSS custom properties on `:root` (light) and `.dark` (dark). The `dark` class is toggled on `<html>` via the theme button in the sidebar. All components adapt automatically — no per-component `dark:` Tailwind variants needed.

Key variables: `--bg-page`, `--bg-surface`, `--text-primary`, `--text-muted`, `--border-default`

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT — see [LICENSE](LICENSE)

---

## Authors

- **Sneha Gupta** — [GitHub](https://github.com/Snehagupta00)
Project: [https://github.com/Snehagupta00/TrueGrit](https://github.com/Snehagupta00/TrueGrit)
