const router = require('express').Router()

const BugController = require('../Controllers/BugController')
router.get('/all',BugController.allbugs)
router.post('/create',BugController.addBug)


module.exports = router