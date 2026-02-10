
require("dotenv").config();
const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");

require("./database/db");

const userRoutes = require("./routes/user-routes");
const taskRoutes = require("./routes/task-routes")

const app = express();

// Add headers middleware for COOP and cross-origin policies
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.use(
    cors({
        origin: ["https://smart-task-manager-sl4a.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        optionsSuccessStatus: 200
    })
)

app.use(cookieParser());
app.use(express.json());

const notificationRoutes = require("./routes/notification-routes");
const { startNotificationScheduler } = require("./services/notification-scheduler");

app.use("/api/user", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notification", notificationRoutes);

app.use("/api", (req, res) => {
    res.status(200).json({
        message: "This is api Route"
    })
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`App is Running on port ${port}`);
    
    // Start the task notification scheduler
    startNotificationScheduler();
})