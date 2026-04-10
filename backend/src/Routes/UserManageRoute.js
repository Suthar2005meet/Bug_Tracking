const express = require("express");
const router = express.Router();
const {
  getMyTeam,
  getDevTesterUsers,
  addOrUpdateTeam,
  getTesterUsers,
//   getPmAndDevelopers,
  getPmAndDevelopersForTester
} = require("../Controllers/UserManageController");

const validateToken = require('../middlewares/authMiddleware')

// Get my team
router.get("/my-team", validateToken, getMyTeam);

// Get Developer + Tester users
router.get("/users", validateToken, getDevTesterUsers);
router.get('/tester',validateToken,getTesterUsers)
router.get('/pm-developer/:id',validateToken,getPmAndDevelopersForTester)

// Add or Update team
router.post("/save-team",validateToken, addOrUpdateTeam);

module.exports = router;