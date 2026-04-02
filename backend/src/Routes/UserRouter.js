const router = require('express').Router()

const UserController = require('../Controllers/UserController')
const validateToken = require('../middlewares/authMiddleware')
router.get('/all',UserController.getAllUser)
router.post('/create',UserController.AddUser)
router.post('/login',UserController.loginUser)
router.get('/tester',UserController.testerUser)
router.get('/developer',UserController.developerUser)
router.get('/details/:id',UserController.getUserById)
router.put('/update/:id',UserController.updateUser)
router.post('/forgotpassword',UserController.forgotPassword)
router.put('/resetpassword',UserController.resetPassword)
router.get('/role',UserController.getUserByRole)
router.get('/projectmanager',UserController.projectmanagerUser)

module.exports = router