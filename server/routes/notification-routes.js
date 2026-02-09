const express = require("express");
const { sendTestNotification, triggerTaskReminders } = require("../controllers/notification-controller");

const router = express.Router();

router.post("/send-test", sendTestNotification);
router.post("/trigger-reminders", triggerTaskReminders);

module.exports = router;
