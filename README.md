# <img src="https://raw.githubusercontent.com/Snehagupta00/TrueGrit/main/public/favicon.ico" width="30" height="30"> TrueGrit - Fitness Tracker

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://truegrit.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?logo=react)](https://react.dev/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-8B5CF6)](https://clerk.com)

A modern full-stack fitness tracking application that helps users monitor workouts, nutrition, and goals with beautiful visualizations and secure authentication.

🔗 **Live Demo**: [https://truegrit.vercel.app](https://truegrit.vercel.app)

![TrueGrit Dashboard Preview](https://raw.githubusercontent.com/Snehagupta00/TrueGrit/main/public/screenshot.png)

## ✨ Features

### 🏋️ Activity Tracking
- Log workouts with duration, intensity, and calories burned
- Exercise library with common movements
- Progress charts with Recharts

### 🥗 Nutrition Management
- Food diary with calorie tracking
- Macronutrient breakdown
- Meal history visualization

### 🎯 Goal System
- Set SMART fitness goals
- Track progress with milestones
- Receive achievement notifications

### 🔒 Secure Authentication
- Password & OAuth login via Clerk
- JWT-protected API endpoints
- Session management

### 🎨 Modern UI
- Light/dark mode toggle
- Mobile-responsive design
- Animated transitions with Framer Motion
- Toast notifications

## 🛠 Tech Stack

| Category       | Technologies                                                                 |
|----------------|-----------------------------------------------------------------------------|
| **Frontend**   | React 18, Vite, Tailwind CSS, React Router 6, Framer Motion, Recharts      |
| **Backend**    | Node.js, Express, MongoDB, Mongoose                                        |
| **Auth**       | Clerk (JWT authentication)                                                 |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend)                                |
| **UI**         | Heroicons, Lucide React, React Hot Toast                                   |

## 🚀 Quick Start

### Prerequisites
- Node.js ≥18.x
- MongoDB (local or Atlas)
- [Clerk](https://clerk.com) account

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/Snehagupta00/TrueGrit.git
   cd TrueGrit
   ```

2. **Set up backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Fill in your Clerk and MongoDB credentials
   npm run dev
   ```

3. **Set up frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Add your Clerk publishable key
   npm run dev
   ```

4. **Configure Clerk**
   - Add `http://localhost:5173` to authorized redirect URLs
   - Enable authentication methods (Email/Google)

## 📂 Project Structure

```
TrueGrit/
├── backend/            # Express API server
│   ├── routes/         # Activity, Nutrition, Goals routes
│   ├── models/         # MongoDB schemas
│   └── server.js       # Main server entry
├── frontend/           # React Vite app
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── lib/        # API utilities
│   │   └── assets/     # Styles & images
├── public/             # Static files
└── README.md           # You are here!
```

## 🌐 Deployment Guide

1. **Backend**
   - Deploy to [Render](https://render.com) or [Railway](https://railway.app)
   - Set environment variables:
     ```
     MONGO_URI=your_atlas_connection_string
     CLERK_SECRET_KEY=sk_live_...
     ```

2. **Frontend**
   - Deploy to [Vercel](https://vercel.com)
   - Set environment variables:
     ```
     VITE_API_BASE_URL=https://your-backend-url.com
     VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
     ```

3. **Clerk Configuration**
   - Update production redirect URLs
   - Switch to live API keys

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📬 Contact

Sneha Gupta - [GitHub](https://github.com/Snehagupta00) - snehagupta@example.com

Project Link: [https://github.com/Snehagupta00/TrueGrit](https://github.com/Snehagupta00/TrueGrit)
```

### Key Improvements:
1. **Modern Header** - Added logo and badges for quick tech stack visibility
2. **Visual Preview** - Space for screenshot (add an actual screenshot later)
3. **Feature Highlights** - Emoji icons for better scanning
4. **Tech Stack Table** - Clean, organized technology display
5. **Simplified Setup** - Streamlined installation steps
6. **Deployment Section** - Clear platform recommendations
7. **Consistent Formatting** - Better spacing and organization
8. **Mobile-Friendly** - Proper markdown structure for GitHub mobile

To complete this:
1. Add a screenshot named `screenshot.png` to your `public/` folder
2. Update the contact email with your actual email
3. Consider adding a demo video link if available

Would you like me to adjust any particular section or add more details about specific features?