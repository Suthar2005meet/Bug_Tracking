const router = require('express').Router()

const IssueController = require('../Controllers/IssueController')
router.get('/all',IssueController.getData)

module.exports = router