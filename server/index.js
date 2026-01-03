
const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");

require("./database/db");
require("dotenv").config();

const userRoutes = require("./routes/user-routes");
const taskRoutes = require("./routes/task-routes")

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
)

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api", (req, res)=>{
    res.status(200).json({
        message: "This is api Route"
    })
})

const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`App is Running on port 5000`);
    
})