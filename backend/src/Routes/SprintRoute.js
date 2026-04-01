const router = require('express').Router()

const SprintController = require('../Controllers/SprintController')
router.get('/all',SprintController.getData)
router.post('/add',SprintController.AddSprint)
router.get('/project/:id',SprintController.getDataByProject)


module.exports = router