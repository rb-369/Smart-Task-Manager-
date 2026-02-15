require("dotenv").config();
const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");

// Logger configuration
const logger = {
    warn: (msg) => console.warn(`[WARN] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`)
};

const Redis = require("ioredis");

const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { RateLimiterRedis } = require("rate-limiter-flexible");

require("./database/db");

const userRoutes = require("./routes/user-routes");
const taskRoutes = require("./routes/task-routes")

const app = express();

// CORS middleware - must be before other middleware
app.use(
    cors({
        origin: ["https://smart-task-manager-sl4a.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        optionsSuccessStatus: 200,
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)

app.use(cookieParser());
app.use(express.json());

// Initialize Redis client for caching and rate limiting
const redisClient = new Redis(process.env.REDIS_URL);

const notificationRoutes = require("./routes/notification-routes");
const { startNotificationScheduler } = require("./services/notification-scheduler");

//ratelimiting
//DDos protection and rate limiting
const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "middleware",
    points: 100, // 100 requests per second (general API calls)
    duration: 1  // per 1 second
})

// Skip rate limiting for auth endpoints (they have their own limiter)
app.use((req, res, next) => {
    // Skip rate limiting for auth endpoints
    if (req.path.startsWith("/api/user")) {
        return next();
    }

    rateLimiter.consume(req.ip).then(() => next()).catch(() => {
        logger.warn(`Rate Limit exceeded for IP: ${req.ip}`);
        return res.status(429).json({
            success: false,
            message: "Too many Requests!!"
        })
    })
})

// IP based rate limiting for sensitve endpoints
const sensitiveEndPointsLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 mins
    max: 50, // Max 50 Requests in 15 mins
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn("Sensitive endpoint rate limit exceeded for IP: " + req.ip)
        return res.status(429).json({
            success: false,
            message: "Too many Requests!!!!!"
        })
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    })

})

app.use("/api/user", sensitiveEndPointsLimiter, (req, res, next) => {
    req.redisClient = redisClient;

    next();
}, userRoutes);

app.use("/api/tasks", (req, res, next) => {
    req.redisClient = redisClient;

    next();
}, taskRoutes);

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