
const Task = require("../models/Task");

const Joi = require("joi");


//add new task

const addTaskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),

})

const addNewTask = async (req, res) => {
    try {
        const { title, description, status, userId, priority, dueDate } = req.body;

        // Due date validation (only if provided)
        if (dueDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const selectedDate = new Date(dueDate);
            selectedDate.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                return res.status(400).json({
                    success: false,
                    message: "Due date cannot be in the past"
                });
            }
        }

        const newTask = await Task.create({
            title,
            description,
            status,
            userId,
            priority,
            dueDate,
            completedAt: status === "done" ? new Date() : null
        });

        return res.status(201).json({
            success: true,
            message: `New task "${newTask.title}" created successfully`,
            data: newTask
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Server error: " + e.message
        });
    }
};


const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: task
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server error: " + e.message
    });
  }
};

const getAllTaks = async (req, res) => {
    const str1 = "task found";
    const str2 = "tasks found";

    try {
        const { id } = req.params;

        const tasks = await Task.find({ userId: id }).sort({ createdAt: -1 });

        if (!tasks) {
            return res.status(404).json({
                success: false,
                message: "Some error occured while getting tasks:( "
            })

        }

        if (tasks.length === 0) {
            return res.status(200).json({
                success: true,
                message: "There are 0 tasks pls create a task"
            })
        }

        if (tasks.length > 0) {
            return res.status(200).json({
                success: true,
                message: `Fetched All taks Successfully! Total ${tasks.length} ${tasks.length === 1 ? str1 : str2} `,
                data: tasks
            })
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Some error occured :( " + e
        })
    }
}

const updateTasks = async (req, res) => {
  try {
    const { _id, status } = req.body;

    const existingTask = await Task.findById(_id);
    if (!existingTask) {
      return res.status(400).json({ success: false, message: "Task not found" });
    }

    const updatePayload = { ...req.body };

    // ✅ Moving TO done → set completedAt
    if (status === "done" && existingTask.status !== "done") {
      updatePayload.completedAt = new Date();
    }

    // ❌ Moving BACK from done → clear completedAt
    if (status !== "done" && existingTask.status === "done") {
      updatePayload.completedAt = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      _id,
      updatePayload,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedTask
    });

  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};


const deleteTasks = async (req, res) => {

    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Task id is required :( "
            })
        }

        const delTask = await Task.findByIdAndDelete(id);

        if (delTask) {
            return res.status(200).json({
                success: true,
                message: `Task ${delTask?.title} deleted Successfully!`,
                data: delTask
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Some error occured :( "
            })
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Some error occured :( " + e
        })
    }
}

module.exports = { addNewTask, getAllTaks, updateTasks, deleteTasks, getSingleTask }