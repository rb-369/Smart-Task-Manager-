🧠 Smart Task Manager – MERN Stack Project

A full-stack Smart Task Manager web application built using the MERN stack that helps users manage daily tasks, track progress using a scrum board, view analytics, and maintain productivity streaks.

This project is designed as a complete real-world full-stack application for learning and deployment practice.

🚀 Live Project

Frontend (Vercel)
👉 https://smart-task-manager-sl4a.vercel.app

Backend API (Railway)
👉 https://smart-task-manager-production.up.railway.app

📌 Features
✅ Authentication

User registration

User login

Secure authentication using JWT & cookies

Logout functionality

✅ Task Management

Create new tasks

Edit tasks

Delete tasks

View task details

✅ Task Status Flow

To Do

In Progress

Review

Blocked

Done

✅ Scrum Board (Drag & Drop)

Drag tasks between columns

Automatically updates task status

✅ Due Date & Priority

Task due date

Task priority (low / medium / high)

✅ Productivity Analytics

Completed task count

Early / on-time / late completion

Weekly and monthly analytics

Charts using Recharts

✅ Streak System

Daily completion streak

Longest streak tracking

✅ Responsive UI

Works on all screen sizes

🛠 Tech Stack
Frontend

React (Vite)

React Router DOM

React Hook Form

Tailwind CSS

Recharts

Axios

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Cookie based auth

Joi validation

Deployment

Frontend → Vercel

Backend → Railway

Database → MongoDB Atlas

📂 Project Structure
MERN-Stack-Task-App
│
├── client     → React frontend (Vite)
└── server     → Node + Express backend

⚙️ Environment Variables

Create a .env file inside the server folder.

MONGO_URL=your_mongodb_connection_string
PORT=5000
NODE_ENV=production

▶️ Run Locally
1️⃣ Clone the repository
git clone https://github.com/rb-369/Smart-Task-Manager-

cd Smart-Task-Manager-

2️⃣ Start backend
cd server
npm install
npm run dev

3️⃣ Start frontend
cd client
npm install
npm run dev


Frontend will run at:

http://localhost:5173


Backend will run at:

http://localhost:5000

🔐 Authentication Flow

JWT token is stored securely in cookies.

Backend validates user using cookie based authentication.

Protected routes are handled using a global React context.

📊 Analytics Module

The analytics dashboard provides:

Status distribution

Completion timing (early / on time / late)

Weekly completion chart

Monthly trend chart

Current and longest streak

📦 API Endpoints (Main)
Auth
POST   /api/user/register
POST   /api/user/login
POST   /api/user/auth
POST   /api/user/logout

Tasks
POST   /api/tasks/add
GET    /api/tasks/get/:userId
GET    /api/tasks/get-details/:taskId
PUT    /api/tasks/update
DELETE /api/tasks/del/:taskId

🌍 Deployment Architecture

Frontend is deployed on Vercel

Backend is deployed on Railway

MongoDB is hosted on MongoDB Atlas

Frontend communicates with backend using Axios and CORS enabled API

🎯 Learning Outcomes

This project helped in learning:

Full-stack MERN architecture

Authentication using JWT and cookies

Context based state management

REST API design

Real-world deployment

CORS handling

Analytics dashboards

Drag and drop UI design

Environment variable management

👨‍💻 Developed By

Rudra Babar(rb-369)
Diploma in Computer Engineering

⭐ Future Improvements

Task reminders

Email notifications

Team based boards

Role based access

Dark mode

Search & filter tasks
