const express = require("express");
const {
  createNotification,
  getNotifications,
  sendNotificationEmail,
} = require("../controllers/notificariController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Rute pentru notificări
router.post("/", protect, createNotification);
router.get("/:recipient_id", protect, getNotifications);
router.post("/send-email", protect, sendNotificationEmail);

module.exports = router;
