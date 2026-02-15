# 🧠 Smart Task Manager – Full-Stack MERN Application

A comprehensive, production-ready task management application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). Features real-time task tracking, beautiful Scrum board with drag-and-drop, advanced analytics, email notifications, and productivity streak tracking.

Perfect for learning full-stack development and deploying production-grade applications.

---

## 🚀 Live Demo

| Component | URL |
|-----------|-----|
| **Frontend** | [https://smart-task-manager-sl4a.vercel.app](https://smart-task-manager-sl4a.vercel.app) |
| **Backend API** | [https://smart-task-manager-production.up.railway.app](https://smart-task-manager-production.up.railway.app) |

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- ✅ **Google OAuth 2.0** - Passwordless authentication with Google
- ✅ **Auto-username generation** - Username automatically derived from email (e.g., rb@gmail.com → rb)
- ✅ **Instant registration** - New users auto-registered on first OAuth login
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Cookie-based session management
- ✅ Protected routes and API endpoints
- ✅ Secure logout with token cleanup

### 📝 **Task Management**
- ✅ Create, edit, and delete tasks
- ✅ View detailed task information
- ✅ Set task priorities (Low, Medium, High)
- ✅ Add due dates with date picker
- ✅ Task descriptions and notes
- ✅ Search and filter tasks by status/priority

### 🎯 **Task Status Workflow**
- ✅ **To Do** - New tasks
- ✅ **In Progress** - Active work
- ✅ **Blocked** - Waiting on dependencies
- ✅ **Review** - Ready for approval
- ✅ **Done** - Completed tasks

### 📊 **Scrum Board (Kanban Style)**
- ✅ Drag-and-drop task management
- ✅ Real-time status updates
- ✅ Visual task cards with priority colors
- ✅ Task count per column
- ✅ Responsive grid layout

### 📈 **Advanced Analytics Dashboard**
- ✅ Task completion statistics
- ✅ Status distribution pie chart
- ✅ Completion timing analysis (Early/On-time/Late)
- ✅ Weekly completion trends
- ✅ Monthly performance charts
- ✅ Interactive Recharts visualizations
- ✅ Current and longest streak tracking

### 🔥 **Productivity Streak System**
- ✅ Daily task completion tracking
- ✅ Current streak counter
- ✅ Longest streak history
- ✅ Automatic streak calculations
- ✅ Visual streak indicators

### 📧 **Email Notifications**
- ✅ SendGrid integration for reliable email delivery
- ✅ Daily task reminders (configurable time with timezone support)
- ✅ Overdue task alerts
- ✅ Due today notifications
- ✅ Beautiful HTML email templates
- ✅ Automatic scheduling with node-cron

### 🌙 **Dark Mode & UI/UX**
- ✅ Full dark mode support with smooth transitions
- ✅ Improved button designs with gradients
- ✅ Better contrast and visibility in dark mode
- ✅ Responsive design for all screen sizes
- ✅ Modern component styling with Tailwind CSS
- ✅ Accessible color schemes

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Purpose |
|-----------|---------|
| React 18+ | UI library |
| Vite | Fast build tool |
| React Router DOM | Client-side routing |
| React Hook Form | Form management |
| Tailwind CSS | Styling & dark mode |
| Recharts | Charts & graphs |
| Axios | HTTP client |
| Radix UI | Component primitives |
| Lucide Icons | Icons library |

### **Backend**
| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | ODM for MongoDB |
| Redis | In-memory caching & rate limiting |
| JWT | Token authentication |
| Oauth | Authentication |
| SendGrid | Email service |
| node-cron | Task scheduling |
| dotenv | Environment management |
| Cookie-parser | Cookie handling |
| express-rate-limit | Rate limiting middleware |
| rate-limiter-flexible | DDoS protection |
| ioredis | Redis client |

### **Deployment**
| Service | Component |
|---------|-----------|
| **Vercel** | Frontend hosting |
| **Railway** | Backend hosting |
| **MongoDB Atlas** | Cloud database |
| **SendGrid** | Email API |
| **Google Auth** | Authentication |

---

## 📁 Project Structure

```
Smart-Task-Manager/
│
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/               # Login/Register
│   │   │   ├── tasks/              # Task components
│   │   │   ├── common-button/      # Button component
│   │   │   ├── common-dialog/      # Modal dialogs
│   │   │   ├── common-form/        # Form wrapper
│   │   │   ├── header/             # Navigation
│   │   │   ├── ui/                 # UI primitives
│   │   │   └── helper/             # Utilities
│   │   ├── pages/
│   │   │   ├── auth/               # Auth pages
│   │   │   ├── task/               # Task list
│   │   │   ├── task-details/       # Task details
│   │   │   ├── scrum-board/        # Kanban board
│   │   │   └── stats/              # Analytics
│   │   ├── context/                # React Context
│   │   ├── services/               # API calls
│   │   ├── config/                 # Config
│   │   └── App.jsx
│   └── package.json
│
├── server/                          # Node/Express Backend
│   ├── models/
│   │   ├── Task.js
│   │   └── user.js
│   ├── routes/
│   │   ├── user-routes.js
│   │   ├── task-routes.js
│   │   └── notification-routes.js
│   ├── controllers/
│   │   ├── user-controller.js
│   │   ├── task-controller.js
│   │   └── notification-controller.js
│   ├── services/
│   │   └── notification-scheduler.js
│   ├── utils/
│   │   ├── email.js
│   │   └── database.js
│   ├── middlewares/
│   │   └── auth-middleware.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16+)
- npm or yarn
- MongoDB account (Atlas)
- Redis (local or cloud)
- SendGrid API key
- Google OAuth Credentials

### **1️⃣ Clone Repository**
```bash
git clone https://github.com/rb-369/Smart-Task-Manager-
cd Smart-Task-Manager-
```

### **2️⃣ Setup Backend**
```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URL=your_mongodb_atlas_connection_string
REDIS_URL=redis://localhost:6379  # For local development
# Or use cloud Redis: redis://:password@host:port
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_sender_email@example.com
TZ=Asia/Kolkata
NODE_ENV=development
```

**Note:** Redis is required for caching and rate limiting. For local development, install Redis via:
- **macOS:** `brew install redis`
- **Windows:** Download from [Redis Windows](https://github.com/microsoftarchive/redis/releases)
- **Linux:** `sudo apt-get install redis-server`
- **Cloud:** Use [Redis Cloud](https://redis.com/try-free/) (free tier available)

Start backend:
```bash
npm run dev
```
**Backend runs at:** `http://localhost:5000`

### **3️⃣ Setup Frontend**
```bash
cd ../client
npm install
npm run dev
```
**Frontend runs at:** `http://localhost:5173`

---

## � Google OAuth Setup

### **Getting Google OAuth Credentials**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google OAuth 2.0 API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized origins: `http://localhost:5173`, `https://your-vercel-domain.com`
   - Authorized redirects: `http://localhost:5173`, `https://your-vercel-domain.com`
5. Copy **Client ID** and **Client Secret**

### **Local Setup (.env files)**
**server/.env:**
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

**client/.env:**
```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_API_BASE_URL=http://localhost:5000
```

### **OAuth Features**
- ✅ One-click Google sign-in
- ✅ Automatic user account creation
- ✅ Username auto-generated from email
- ✅ Secure token verification with Google API
- ✅ httpOnly cookie storage
- ✅ COOP headers for popup security

---

## �📧 Email Notifications Setup

### **SendGrid Configuration**
1. Create account at [SendGrid](https://sendgrid.com)
2. Generate API key from Settings → API Keys
3. Copy to `.env`:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDER_EMAIL=notifications@yourdomain.com
   ```

### **Email Features**
- **Daily Reminders:** Sent at 9:00 AM (configurable)
- **Overdue Tasks:** Lists all overdue items
- **Due Today:** Shows tasks due today
- **HTML Templates:** Professional formatting
- **Timezone Support:** Set `TZ` environment variable

### **Manual Testing**
Test notifications immediately:
```bash
POST /api/notification/trigger-reminders
```

---

## 🔐 Authentication & Security

### **Authentication Methods**
1. **Email/Password** - Traditional registration and login
2. **Google OAuth 2.0** - One-click sign-in with Google

### **OAuth Authentication Flow**
```
1. User clicks "Sign in with Google"
   ↓
2. Google popup opens
   ↓
3. User signs in with Google account
   ↓
4. Google returns ID token
   ↓
5. Frontend sends token to backend
   ↓
6. Backend verifies with Google API
   ↓
7. Check if user exists:
   - YES: Login (return existing user)
   - NO: Auto-register with auto-generated username
   ↓
8. Generate JWT token & set secure cookie
   ↓
9. Redirect to /tasks/list
```

### **Protected Resources**
- Dashboard (requires login)
- Task management (requires login)
- Analytics (requires login)
- Profile settings (requires login)

### **Security Features**
- ✅ Server-side token verification (never trust client)
- ✅ httpOnly cookies (XSS protection)
- ✅ CORS validation
- ✅ COOP headers for OAuth popup security
- ✅ Secure password hashing with bcryptjs
- ✅ JWT expiration (3 days)

---

## ⚡ Performance & Optimization

### **Redis Caching**
- ✅ **Task Caching** - User tasks cached with Redis for fast retrieval
  - Cache key: `task:{userId}:{page}:{limit}`
  - TTL: 400 seconds (6.7 minutes)
  - Automatic invalidation on create/update/delete
- ✅ **Single Task Caching** - Individual task details cached
  - Cache key: `task:{taskId}`
  - TTL: 400 seconds
- ✅ **Automatic Cache Invalidation** - All related caches cleared on mutations
- ✅ **Cache Fallback** - Corrupted cache automatically detected and rebuilt

### **Rate Limiting & DDoS Protection**
- ✅ **Global Rate Limiter** - 10 requests/second per IP
  - Protects against general abuse
  - Uses Redis for distributed rate limiting
- ✅ **Sensitive Endpoint Rate Limiter** - 50 requests per 15 minutes
  - Applied to authentication endpoints
  - Window: 15 minutes
  - Prevents brute-force attacks
- ✅ **IP-Based Tracking** - All requests tracked by client IP
- ✅ **Graceful Rate Limit Responses** - Returns 429 status with clear messages

### **Implementation Details**
```javascript
// Global rate limiting (10 req/s)
RateLimiterRedis: 10 points per 1 second

// Sensitive endpoints (50 req/15 min)
rateLimit: windowMs = 15 * 60 * 1000, max = 50

// Cache configuration
setex(cacheKey, 400, JSON.stringify(data))
// 400 second TTL for all cached data
```

---

## 📊 API Endpoints

### **Authentication** 🔐
```
POST   /api/user/register          # User registration (email/password)
POST   /api/user/login             # User login (email/password)
POST   /api/user/google-oauth      # Google OAuth sign-in/register
POST   /api/user/auth              # Check authentication
POST   /api/user/logout            # User logout
```

### **Tasks** 📝
```
POST   /api/tasks/add              # Create new task
GET    /api/tasks/get/:userId      # Get all user tasks
GET    /api/tasks/get-details/:id  # Get single task
PUT    /api/tasks/update           # Update task
DELETE /api/tasks/del/:taskId      # Delete task
```

### **Notifications** 📧
```
POST   /api/notification/send-test        # Send test email
POST   /api/notification/trigger-reminders # Trigger daily reminders
```

---

## 🎨 UI Features

### **Dark Mode**
- ✅ System-wide dark theme
- ✅ Smooth transitions
- ✅ Improved contrast
- ✅ Persistent preference

### **Responsive Design**
- ✅ Mobile-first approach
- ✅ All screen sizes
- ✅ Touch-friendly
- ✅ Optimized performance

### **Visual Enhancements**
- ✅ Gradient buttons
- ✅ Color-coded tasks
- ✅ Smooth animations
- ✅ Custom scrollbars
- ✅ Accessible colors

---

## 🧪 Testing Workflow

### **Email Notifications**
1. Create task with due date = today or earlier
2. Mark task as incomplete
3. Call: `POST /api/notification/trigger-reminders`
4. Check email inbox

### **Drag & Drop**
1. Go to Scrum Board
2. Drag tasks between columns
3. Verify real-time status updates

### **Analytics**
1. Complete multiple tasks
2. View Stats page
3. Check streaks and charts

---

## 🚢 Deployment

### **Deploy Backend to Railway**

1. **Connect to Railway:**
   - Go to [Railway](https://railway.app/)
   - Create new project from GitHub
   - Select your Smart-Task-Manager repository
   - Create new service → Node.js

2. **Add Environment Variables in Railway Dashboard:**
   - Click your project → Variables
   - Add all required variables:

   ```env
   PORT=5000
   MONGO_URL=your_mongodb_atlas_connection_string
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDER_EMAIL=your_sender_email@example.com
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_super_secret_jwt_key_here
   TZ=Asia/Kolkata
   NODE_ENV=production
   ```

3. **Deploy:**
   - Railway auto-deploys on push to main branch
   - Check deployment logs if errors occur

### **Deploy Frontend to Vercel**

1. **Connect to Vercel:**
   - Go to [Vercel](https://vercel.com/)
   - Import project from GitHub
   - Select `client` folder as root directory

2. **Add Environment Variables in Vercel Dashboard:**
   - Go to Settings → Environment Variables
   - Add these variables:

   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_API_BASE_URL=https://smart-task-manager-production.up.railway.app
   ```

3. **Deploy:**
   - Vercel auto-deploys on push to main branch
   - View deployment at your Vercel domain

### **Environment Variables Summary**

| Variable | Backend | Frontend | Purpose |
|----------|---------|----------|---------|
| `MONGO_URL` | ✅ | ❌ | MongoDB connection (REQUIRED) |
| `SENDGRID_API_KEY` | ✅ | ❌ | Email service (REQUIRED) |
| `SENDER_EMAIL` | ✅ | ❌ | Email sender (REQUIRED) |
| `GOOGLE_CLIENT_ID` | ✅ | ✅ | OAuth sign-in (REQUIRED) |
| `GOOGLE_CLIENT_SECRET` | ✅ | ❌ | OAuth secret - NEVER expose! |
| `JWT_SECRET` | ✅ | ❌ | Token signing (REQUIRED) |
| `VITE_API_BASE_URL` | ❌ | ✅ | Backend API URL (default: localhost) |
| `PORT` | ✅ | ❌ | Server port (default: 5000) |
| `NODE_ENV` | ✅ | ❌ | Environment mode |
| `TZ` | ✅ | ❌ | Timezone for emails |

### **⚠️ Important: Without Environment Variables**
**YES, the app will NOT work without proper environment variables!** Here's what will break:

- ❌ **No OAuth login** → Google sign-in will fail
- ❌ **No Email notifications** → Reminder emails won't send
- ❌ **No Database connection** → Tasks won't be saved
- ❌ **No API calls** → Frontend can't reach backend

**Verifying Deployment:**
1. Check Vercel & Railway dashboards for errors
2. Test OAuth button on frontend
3. Test creating a task
4. Check email notifications work
5. Monitor console for any errors

---

## 📚 Learning Outcomes

This project covers essential full-stack concepts:

- ✅ **MERN Stack** - Complete implementation
- ✅ **Authentication** - JWT + Cookie-based + OAuth 2.0
- ✅ **Google OAuth 2.0** - Passwordless authentication
- ✅ **Auto-registration** - User account creation from OAuth
- ✅ **State Management** - React Context API
- ✅ **REST APIs** - Design & implementation
- ✅ **Database Design** - MongoDB schemas
- ✅ **Email Service** - SendGrid integration
- ✅ **Task Scheduling** - Cron jobs
- ✅ **Cloud Deployment** - Vercel & Railway
- ✅ **Environment Variables** - Secure credential management
- ✅ **UI/UX Design** - Tailwind CSS
- ✅ **Real-time Updates** - Instant status changes
- ✅ **Data Visualization** - Charts with Recharts
- ✅ **Error Handling** - Comprehensive management
- ✅ **Security** - OAuth, JWT, CORS, validation
- ✅ **Performance** - Optimization techniques

---

## 🤝 Contributing

Contributions welcome! To contribute:

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

MIT License - Open source project

---

## 👨‍💻 Author

**Rudra Babar** (rb-369)
- Diploma in Computer Engineering
- Full-stack developer
- Passionate about building scalable applications

---

## ⭐ Support

If you found this project helpful, please consider giving it a **⭐ on GitHub!**

---

## 📞 Support & Feedback

For issues, bugs, or feature requests, please open an issue on GitHub.

---

## 🎯 Future Roadmap

- [ ] Real-time collaboration
- [ ] Task comments & mentions
- [ ] Team management with roles
- [ ] Task templates
- [ ] Mobile app (React Native)
- [ ] WebSocket for live updates
- [ ] Offline mode with sync
- [ ] Advanced filtering
- [ ] Task dependencies
- [ ] Time tracking

---

**Happy Task Managing! 🚀**

