const router = require('express').Router()

const ProjectController = require('../Controllers/ProjectController')
const upload = require('../middlewares/uploadMiddleware')
router.get('/all',ProjectController.getAllProject)
router.post('/create',upload.single('document'),ProjectController.createProject)
router.get('/details/:id',ProjectController.getProjectById)
router.put('/update/:id',ProjectController.updateById)
router.get('/status',ProjectController.getProjectByStatus)
router.get("/user/:id", ProjectController.getProjectsByUser);
router.put('/testing/:id',ProjectController.startTesting)
router.get('/tester/:id',ProjectController.getProjectByTester)

module.exports = router