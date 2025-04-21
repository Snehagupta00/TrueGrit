Fitness Tracker-(TrueGrit)
A full-stack web application designed to help users track their fitness activities, nutrition, and goals. Built with a modern tech stack, it provides a responsive and intuitive interface for managing health and fitness data, with secure authentication powered by Clerk.
Features

User Authentication: Secure sign-in and sign-up with Clerk, supporting email/password and optional OAuth (e.g., Google).
Activity Logging: Record workouts and activities, including type, duration, and calories burned.
Nutrition Tracking: Log meals and track calorie intake.
Goal Setting: Set and monitor fitness goals, such as weight loss or exercise frequency.
User Profiles: Manage personal information and view fitness progress.
Dashboard: Visualize activity trends with interactive charts using Recharts.
Responsive Design: Mobile-friendly UI with light/dark mode support, styled with Tailwind CSS.
Secure API: Backend protected with Clerk's JWT-based authentication.

Tech Stack
Frontend

React: JavaScript library for building the user interface.
React Router: For client-side routing.
Clerk: Authentication and user management.
Axios: For making API requests.
Tailwind CSS: Utility-first CSS framework for styling.
Recharts: For data visualization (charts).
Framer Motion: For animations.
React Hot Toast: For notifications.
Lucide React & Heroicons: For icons.

Backend

Node.js & Express: Server-side framework for building the API.
MongoDB & Mongoose: NoSQL database for storing user data, activities, nutrition, and goals.
Clerk: For backend authentication with JWT.
CORS: For enabling cross-origin requests.
Dotenv: For environment variable management.

Prerequisites
Before running the application, ensure you have the following installed:

Node.js: Version 18.x or higher.
MongoDB: A local or cloud MongoDB instance (e.g., MongoDB Atlas).
Clerk Account: For authentication keys.

Installation
1. Clone the Repository
git clone https://github.com/your-username/fitness-tracker.git
cd fitness-tracker

2. Set Up the Backend

Navigate to the backend directory:
cd backend


Install dependencies:
npm install


Create a .env file in the backend directory with the following:
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxx


Replace your_mongodb_connection_string with your MongoDB URI.
Obtain CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY from the Clerk Dashboard.


Start the backend server:
npm run dev

The server will run on http://localhost:5000.


3. Set Up the Frontend

Navigate to the frontend directory:
cd frontend


Install dependencies:
npm install


Create a .env file in the frontend directory with the following:
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx


Use the same CLERK_PUBLISHABLE_KEY as in the backend.


Start the frontend development server:
npm run dev

The app will be available at http://localhost:3000.


4. Configure Clerk

Sign up at Clerk and create an application.
Copy the Publishable Key and Secret Key from the Clerk Dashboard.
Enable desired authentication methods (e.g., email/password, Google OAuth) in Authentication > Social Connections.
For OAuth (optional):
Configure the provider (e.g., Google) with Client ID and Secret.
Add http://localhost:3000 as an authorized redirect URI.



Usage

Sign Up / Sign In:

Open http://localhost:3000/sign-in or /sign-up.
Use email/password or an OAuth provider (if enabled).
The sign-in/sign-up forms are centered for a clean user experience.


Dashboard:

View activity trends, recent activities, nutrition summary, and goals.
Interactive charts display calorie data.


Manage Data:

Log activities (/activity), nutrition (/nutrition), and goals (/goals).
Update your profile (/profile).
Explore exercises (/exercise).


Toggle Theme:

Switch between light and dark modes using the navbar.



Project Structure
fitness-tracker/
├── backend/
│   ├── routes/              # Express route handlers
│   ├── server.js           # Main backend entry point
│   ├── .env                # Backend environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components (Dashboard, Navbar, etc.)
│   │   ├── lib/            # API utility (api.js)
│   │   ├── App.jsx         # Main app component
│   │   ├── index.jsx       # App entry point
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # ReactDOM setup
│   ├── .env                # Frontend environment variables
│   └── package.json
└── README.md

Troubleshooting

"External Account was not found":

Verify OAuth provider setup in Clerk Dashboard.

Ensure the user’s external account is linked in Users > External Accounts.

Disable OAuth in App.jsx to use email/password only:
<SignIn routing="path" path="/sign-in" redirectUrl="/" signInOptions={['email']} />




Authentication Errors:

Check CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in .env files.
Ensure VITE_API_BASE_URL matches the backend URL.


CORS Issues:

Verify CORS setup in server.js:
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));




MongoDB Connection:

Ensure MONGO_URI is valid and MongoDB is running.



Deployment

Backend:

Deploy to a platform like Heroku, Railway, or Render.
Set environment variables (MONGO_URI, CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY) on the platform.
Use production keys (pk_live_..., sk_live_...).


Frontend:

Deploy to Vercel, Netlify, or similar.
Set VITE_API_BASE_URL to the deployed backend URL.
Update VITE_CLERK_PUBLISHABLE_KEY to the live key.


Clerk:

Update callback URLs in Clerk Dashboard to match the deployed URL (e.g., https://yourdomain.com).
Follow Clerk’s deployment guide.



Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or feedback, contact your-email@example.com or open an issue on GitHub.
