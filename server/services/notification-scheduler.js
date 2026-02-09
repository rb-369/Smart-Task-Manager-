const cron = require("node-cron");
const Task = require("../models/Task");
const User = require("../models/user");
const { sendEmail } = require("../utils/email");

/**
 * Get tasks that are due today or overdue
 * Returns tasks grouped by userId
 */
const getTasksForNotification = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

        // Find tasks due today or overdue (dueDate < tomorrow)
        // Exclude completed tasks
        const tasks = await Task.find({
            dueDate: { $lt: tomorrow },
            completedAt: null,
            status: { $ne: "completed" } // double-check status is not completed
        }).select("title description userId priority dueDate status");

        // Group tasks by userId
        const tasksByUser = {};
        tasks.forEach(task => {
            if (!tasksByUser[task.userId]) {
                tasksByUser[task.userId] = {
                    overdue: [],
                    dueToday: []
                };
            }

            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);

            if (taskDate < today) {
                // Task is overdue
                tasksByUser[task.userId].overdue.push(task);
            } else if (taskDate.getTime() === today.getTime()) {
                // Task is due today
                tasksByUser[task.userId].dueToday.push(task);
            }
        });

        return tasksByUser;
    } catch (error) {
        console.error("Error fetching tasks for notification:", error);
        return {};
    }
};

/**
 * Format email HTML with task list
 */
const formatTaskEmail = (userName, tasksData) => {
    const { overdue, dueToday } = tasksData;
    
    const taskListHTML = (tasks, title) => {
        if (tasks.length === 0) return "";
        
        const taskItems = tasks.map(task => {
            const dueDate = new Date(task.dueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
            return `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">
                        <strong>${task.title}</strong>
                        <br/>
                        <small style="color: #666;">Due: ${dueDate}</small>
                        ${task.priority ? `<br/><small style="color: #999;">Priority: ${task.priority}</small>` : ""}
                    </td>
                </tr>
            `;
        }).join("");

        return `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #3B82F6; margin-bottom: 10px;">${title} (${tasks.length})</h3>
                <table style="width: 100%; border-collapse: collapse; background: #f9fafb;">
                    ${taskItems}
                </table>
            </div>
        `;
    };

    const overdueSectionHTML = overdue.length > 0 ? taskListHTML(overdue, "⚠️  Overdue Tasks") : "";
    const dueTodayHTML = dueToday.length > 0 ? taskListHTML(dueToday, "📅 Due Today") : "";

    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h1 style="color: #1F2937; margin-bottom: 10px;">📬 Task Reminder</h1>
                <p style="color: #666; margin-bottom: 20px;">Hello <strong>${userName}</strong>,</p>
                
                <p style="color: #666; line-height: 1.6;">
                    You have pending tasks that need your attention:
                </p>

                ${overdueSectionHTML}
                ${dueTodayHTML}

                <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #3B82F6; border-radius: 4px; margin-top: 20px;">
                    <p style="color: #333; margin: 0;">
                        💡 Log in to your <strong>RB's Smart Task Manager</strong> account to update your tasks.
                    </p>
                </div>

                <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                    This is an automated notification from Smart Task Manager. Do not reply to this email.
                </p>
            </div>
        </div>
    `;
};

/**
 * Send notification emails to all users with due/overdue tasks
 */
const sendNotificationEmails = async () => {
    try {
        console.log("📧 Starting task notification scheduler...");
        
        const tasksByUser = await getTasksForNotification();
        
        if (Object.keys(tasksByUser).length === 0) {
            console.log("✅ No tasks due today or overdue. No emails sent.");
            return;
        }

        let sentCount = 0;
        let failedCount = 0;

        for (const userId in tasksByUser) {
            try {
                const user = await User.findById(userId);
                
                if (!user || !user.email) {
                    console.warn(`⚠️  User ${userId} not found or has no email`);
                    continue;
                }

                const tasksData = tasksByUser[userId];
                
                // Only send if there are tasks to report
                if (tasksData.overdue.length === 0 && tasksData.dueToday.length === 0) {
                    continue;
                }

                const emailHTML = formatTaskEmail(user.name || "User", tasksData);
                
                const result = await sendEmail({
                    to: user.email,
                    subject: `Task Reminder: ${tasksData.overdue.length > 0 ? tasksData.overdue.length + " Overdue Task(s)" : ""} ${tasksData.dueToday.length > 0 ? (tasksData.overdue.length > 0 ? "+ " : "") + tasksData.dueToday.length + " Due Today" : ""}`,
                    html: emailHTML
                });

                if (result.success) {
                    sentCount++;
                    console.log(`✅ Email sent to ${user.email} (overdue: ${tasksData.overdue.length}, due today: ${tasksData.dueToday.length})`);
                } else {
                    failedCount++;
                    console.error(`❌ Failed to send email to ${user.email}:`, result.error);
                }
            } catch (error) {
                failedCount++;
                console.error(`❌ Error processing user ${userId}:`, error.message);
            }
        }

        console.log(`📬 Notification cycle complete. Sent: ${sentCount}, Failed: ${failedCount}`);
    } catch (error) {
        console.error("❌ Error in sendNotificationEmails:", error);
    }
};

/**
 * Start the notification scheduler
 * Runs daily at 9:00 AM in the system's local timezone
 */
const startNotificationScheduler = () => {
    // Get local timezone offset
    const now = new Date();
    const localHour = now.getHours();
    
    // Cron pattern: minute hour day month day-of-week
    // "0 9 * * *" = every day at 9:00 AM
    // Using system timezone via node-cron
    const task = cron.schedule("0 9 * * *", () => {
        console.log("⏰ Task notification scheduler triggered at", new Date().toISOString());
        sendNotificationEmails();
    }, {
        // Run in system timezone
        scheduled: true,
        timezone: process.env.TZ || "UTC"
    });

    console.log(`✅ Notification scheduler initialized. Will run daily at 9:00 AM (Timezone: ${process.env.TZ || "UTC"})`);
    return task;
};

/**
 * For manual testing: send notifications immediately
 */
const triggerNotificationManually = async () => {
    console.log("🔔 Manually triggering task notifications...");
    await sendNotificationEmails();
};

module.exports = {
    startNotificationScheduler,
    triggerNotificationManually,
    sendNotificationEmails,
    getTasksForNotification
};
