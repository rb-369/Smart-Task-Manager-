import { TaskManagerContext } from "@/context";
import { useContext, useEffect, useCallback } from "react";
import logo from "@/assets/logo5.png";

function TaskReminders() {
    const { taskList } = useContext(TaskManagerContext);

    const requestPermission = useCallback(async () => {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
            return;
        }

        if (Notification.permission === "default") {
            await Notification.requestPermission();
        }
    }, []);

    const checkReminders = useCallback(() => {
        if (!taskList || taskList.length === 0) return;

        // Use local time for "today"
        const now = new Date();
        const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD local

        // Get notified log from localStorage
        const storedLog = localStorage.getItem("task_notification_log");
        let notificationLog = storedLog ? JSON.parse(storedLog) : {};

        let hasUpdates = false;

        taskList.forEach(task => {
            if (task.status === "done" || !task.dueDate) return;

            const taskDueDate = new Date(task.dueDate);
            const taskDueDateStr = taskDueDate.toLocaleDateString('en-CA');

            // LOGIC:
            // 1. If due today AND not notified today -> notify
            // 2. If due tomorrow AND not notified today -> notify
            // 3. If overdue AND not notified today -> notify (once per day)

            // Calculate tomorrow string
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

            if (taskDueDateStr === todayStr) {
                // DUE TODAY
                if (notificationLog[task._id] !== todayStr) {
                    new Notification("Task Due Today! ⏰", {
                        body: `Your task "${task.title}" is due today. Don't forget!`,
                        icon: logo
                    });
                    notificationLog[task._id] = todayStr;
                    hasUpdates = true;
                }
            }
            else if (taskDueDateStr === tomorrowStr) {
                // DUE TOMORROW
                // We use a composite key or just log it as notified today to avoid double notif on same day?
                // Actually, if we notify for tomorrow, we log it as notified today. 
                // Tomorrow, when it becomes "today", we notify again (key will be different date).
                if (notificationLog[task._id] !== todayStr) {
                    new Notification("Task Due Tomorrow! 📅", {
                        body: `Your task "${task.title}" is due tomorrow.`,
                        icon: logo
                    });
                    notificationLog[task._id] = todayStr;
                    hasUpdates = true;
                }
            }
            else if (taskDueDate < new Date(todayStr)) {
                // OVERDUE
                // Calculate how many days overdue
                const diffTime = Math.abs(new Date(todayStr) - taskDueDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Notify only if overdue by 1 or 2 days (send notifications twice after overdue)
                if (diffDays <= 2) {
                    if (notificationLog[task._id] !== todayStr) {
                        new Notification(`Task Overdue (${diffDays} day${diffDays > 1 ? 's' : ''})! 🔴`, {
                            body: `Your task "${task.title}" was due on ${taskDueDate.toLocaleDateString()}.`,
                            icon: logo
                        });
                        notificationLog[task._id] = todayStr;
                        hasUpdates = true;
                    }
                }
            }
        });

        if (hasUpdates) {
            localStorage.setItem("task_notification_log", JSON.stringify(notificationLog));
        }

    }, [taskList]);

    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    useEffect(() => {
        if (Notification.permission === "granted") {
            checkReminders();
        }

        // Check periodically (every hour)
        const interval = setInterval(() => {
            if (Notification.permission === "granted") {
                checkReminders();
            }
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);

    }, [taskList, checkReminders]);

    return null;
}

export default TaskReminders;
