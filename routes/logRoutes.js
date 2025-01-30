const express = require("express");
const {
  createLog,
  getAllLogs,
  getLogsByUserId,
  deleteOldLogs,
} = require("../controllers/logsController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rute pentru loguri
router.post("/", verifyToken(["Admin General", "Administrator Sediu"]), createLog);
router.get("/", verifyToken(["Admin General"]), getAllLogs);
router.get("/user/:user_id", verifyToken(["Admin General", "Administrator Sediu"]), getLogsByUserId);
router.delete("/older-than/:days", verifyToken(["Admin General"]), deleteOldLogs);

module.exports = router;
