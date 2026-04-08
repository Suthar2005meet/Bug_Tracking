const router = require("express").Router()

const  DashboardController  = require("../Controllers/DashboardConroller");
const validateToken = require("../middlewares/authMiddleware");

router.get("/all/:id",validateToken, DashboardController.getDashboardData);

module.exports = router;