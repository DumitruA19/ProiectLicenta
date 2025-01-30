// ProblemeRoutes.js
const express = require("express");
const { reportProblem, getProblemeBySediu } = require("../controllers/problemeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Endpoint pentru raportarea unei probleme
router.post("/", protect, reportProblem);

// Endpoint pentru obținerea problemelor unui sedius
router.get("/:sediu_id", protect, getProblemeBySediu);

module.exports = router;
