const router = require("express").Router()

const  DashboardController  = require("../Controllers/DashboardConroller");
const validateToken = require("../middlewares/authMiddleware");

router.get("/all/:id",validateToken, DashboardController.getDashboardData);
router.get("/user-activity/:id", validateToken, DashboardController.getUserActivity);

module.exports = router;