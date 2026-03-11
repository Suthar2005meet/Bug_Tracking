const router = require('express').Router()

const ProjectController = require('../Controllers/ProjectController')
router.get('/all',ProjectController.getAllProject)
router.post('/create',ProjectController.createProject)


module.exports = router