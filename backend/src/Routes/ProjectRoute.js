const router = require('express').Router()

const ProjectController = require('../Controllers/ProjectController')
const upload = require('../middlewares/uploadMiddleware')
router.get('/all',ProjectController.getAllProject)
router.post('/create',upload.single('document'),ProjectController.createProject)
router.get('/details/:id',ProjectController.getProjectById)


module.exports = router