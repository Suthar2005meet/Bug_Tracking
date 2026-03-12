const router = require('express').Router()

const UserController = require('../Controllers/UserController')
router.get('/all', UserController.getAllUser)
router.post('/create',UserController.AddUser)
router.post('/login',UserController.loginUser)


module.exports = router