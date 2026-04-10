const router = require('express').Router()

const IssueController = require('../Controllers/IssueController')
const upload = require('../middlewares/uploadMiddleware')
const validateToken = require('../middlewares/authMiddleware')

router.get('/all',IssueController.getData)
router.post('/add',validateToken,upload.single("document"),IssueController.addTask)
router.get('/sprint/:id',IssueController.sprintByTask)
router.get('/details/:id',IssueController.issueById)
router.put('/update/:id',validateToken,IssueController.updateIssue)
router.get('/user/:id',IssueController.getDataByUser)
router.put('/status/:id',validateToken,IssueController.updateIssueStatus)
router.put('/adduser/:id',validateToken,IssueController.addUserToIssue)
router.get('/tester/:id',IssueController.getDataByTester)
router.get('/pm',validateToken,IssueController.getPmIssues)

module.exports = router