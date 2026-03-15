const router = require('express').Router()

const BugController = require('../Controllers/BugController')
router.get('/all',BugController.allbugs)
router.post('/create',BugController.addBug)
router.get('/bug/:id',BugController.getBugById)
router.put('/update/:id',BugController.uppdateBug)


module.exports = router