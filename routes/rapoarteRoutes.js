// rapoarteRoutes.js

const express = require("express");
const {
  createRaport,
  getAllRapoarte,
  getRaportById,
  deleteRaport,
} = require("../controllers/rapoarteController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rute pentru rapoarte
router.post("/", verifyToken(["Admin General", "Administrator Sediu"]), createRaport);
router.get("/", verifyToken(["Admin General", "Administrator Sediu"]), getAllRapoarte);
router.get("/:id", verifyToken(["Admin General", "Administrator Sediu"]), getRaportById);
router.delete("/:id", verifyToken(["Admin General"]), deleteRaport);

module.exports = router;