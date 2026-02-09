const sgMail = require("@sendgrid/mail");

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || "notifications@smarttaskmanager.com";

// Verify SendGrid API key is set
if (!SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY missing. Set it in .env. Email sending will fail until it's configured.");
} else {
    const preview = SENDGRID_API_KEY.length > 10 ? `${SENDGRID_API_KEY.slice(0, 10)}...` : SENDGRID_API_KEY;
    console.log("SendGrid API key present. preview:", preview, "length:", SENDGRID_API_KEY.length);
    sgMail.setApiKey(SENDGRID_API_KEY);
}

const sendEmail = async ({ to, subject, html }) => {
    try {
        if (!SENDGRID_API_KEY) {
            throw new Error("SendGrid API key is not set in environment variables");
        }

        const msg = {
            to,
            from: SENDER_EMAIL,
            subject,
            html,
        };

        const response = await sgMail.send(msg);
        console.log("Email sent successfully via SendGrid:", response[0].statusCode);
        return { success: true, data: { statusCode: response[0].statusCode, messageId: response[0].headers["x-message-id"] } };
    } catch (error) {
        console.error("Error sending email via SendGrid:", error.message);
        
        // Log additional error details if available
        if (error.response) {
            console.error("SendGrid response:", {
                status: error.response.status,
                data: error.response.body,
            });
        }

        const errDetail = {
            message: error.message,
            statusCode: error.code,
            responseBody: error.response ? error.response.body : undefined,
        };

        console.error("Send error detail:", JSON.stringify(errDetail));
        return { success: false, error: errDetail };
    }
};

module.exports = { sendEmail };
