const router = require('express').Router()

const IssueController = require('../Controllers/IssueController')
const upload = require('../middlewares/uploadMiddleware')
router.get('/all',IssueController.getData)
router.post('/add',upload.single("document"),IssueController.addTask)
router.get('/sprint/:id',IssueController.sprintByTask)
router.get('/details/:id',IssueController.issueById)
router.put('/update/:id',IssueController.updateIssue)
router.get('/user/:id',IssueController.getDataByUser)
router.put('/status/:id',IssueController.updateIssueStatus)
router.put('/adduser/:id',IssueController.addUserToIssue)
router.get('/tester/:id',IssueController.getDataByTester)

module.exports = router