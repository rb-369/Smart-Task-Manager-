

const express = require("express");

const {addNewTask, getAllTaks, deleteTasks, updateTasks, getSingleTask} = require("../controllers/task-controller");

const router = express.Router();

router.get("/get/:id", getAllTaks);

router.get("/get-details/:id", getSingleTask);

router.post("/add", addNewTask);

router.delete("/del/:id", deleteTasks)

router.put("/update", updateTasks);

module.exports = router;

