const { sendEmail } = require("../utils/email");
const { triggerNotificationManually } = require("../services/notification-scheduler");

const sendTestNotification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const result = await sendEmail({
            to: email,
            subject: "Test Notification from Smart Task Manager",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                    <h1 style="color: #3B82F6;">It works! 🚀</h1>
                    <p>This is a test notification from your Smart Task Manager app.</p>
                    <p>Mailtrap integration is successful.</p>
                </div>
            `
        });

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: "Email sent successfully",
                data: result.data
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Failed to send email",
                error: result.error
            });
        }

    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Some error occurred",
        });
    }
};

const triggerTaskReminders = async (req, res) => {
    try {
        await triggerNotificationManually();
        return res.status(200).json({
            success: true,
            message: "Task reminder notifications triggered successfully"
        });
    } catch (e) {
        console.error("Error triggering task reminders:", e);
        return res.status(500).json({
            success: false,
            message: "Failed to trigger task reminders",
            error: e.message
        });
    }
};

module.exports = {
    sendTestNotification,
    triggerTaskReminders
};
