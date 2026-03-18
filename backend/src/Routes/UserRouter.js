const router = require('express').Router()

const UserController = require('../Controllers/UserController')
const validateToken = require('../middlewares/authMiddleware')
router.get('/all',validateToken,UserController.getAllUser)
router.post('/create',UserController.AddUser)
router.post('/login',UserController.loginUser)
router.get('/tester',UserController.testerUser)


module.exports = router