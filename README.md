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
- ✅ Uses Google's oauth 
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
| JWT | Token authentication |
| Oauth | Authentication |
| SendGrid | Email service |
| node-cron | Task scheduling |
| dotenv | Environment management |
| Cookie-parser | Cookie handling |

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
- SendGrid API key

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
SENDGRID_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_sender_email@example.com
TZ=Asia/Kolkata
NODE_ENV=development
```

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

## 📧 Email Notifications Setup

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

### **Authentication Flow**
```
User Login
    ↓
JWT Token Generated
    ↓
Token Stored in Secure Cookies
    ↓
Backend Validates Each Request
    ↓
Access to Protected Routes & APIs
```

### **Protected Resources**
- Dashboard (requires login)
- Task management (requires login)
- Analytics (requires login)
- Profile settings (requires login)

---

## 📊 API Endpoints

### **Authentication** 🔐
```
POST   /api/user/register          # User registration
POST   /api/user/login             # User login
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

### **Frontend (Vercel)**
```bash
cd client
npm run build
# Deploy via Vercel CLI or GitHub
```

### **Backend (Railway)**
```bash
# Connect Railway to GitHub
# Set env variables in Railway dashboard
# Auto-deploy on push
```

### **Required Environment Variables**
- `MONGO_URL` - MongoDB Atlas
- `SENDGRID_API_KEY` - SendGrid
- `SENDER_EMAIL` - Notification sender
- `TZ` - Timezone (e.g., Asia/Kolkata)
- `NODE_ENV` - production/development

---

## 📚 Learning Outcomes

This project covers essential full-stack concepts:

- ✅ **MERN Stack** - Complete implementation
- ✅ **Authentication** - JWT + Cookie-based
- ✅ **State Management** - React Context API
- ✅ **REST APIs** - Design & implementation
- ✅ **Database Design** - MongoDB schemas
- ✅ **Email Service** - SendGrid integration
- ✅ **Task Scheduling** - Cron jobs
- ✅ **Cloud Deployment** - Vercel & Railway
- ✅ **UI/UX Design** - Tailwind CSS
- ✅ **Real-time Updates** - Instant status changes
- ✅ **Data Visualization** - Charts with Recharts
- ✅ **Error Handling** - Comprehensive management
- ✅ **Security** - JWT, CORS, validation
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

