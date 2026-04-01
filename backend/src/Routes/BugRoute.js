const router = require('express').Router()


const BugController = require('../Controllers/BugController')
const upload = require('../middlewares/uploadMiddleware')
router.get('/all',BugController.allbugs)
router.post('/create',upload.single("image"),BugController.addBug)
router.get('/bug/:id',BugController.getBugById)
router.put('/update/:id',BugController.uppdateBug)
router.get('/status',BugController.getBugByStatus)
router.get('/user/:id',BugController.getBugsByUser)
router.put('/status/:id',BugController.updateBugStatus)



module.exports = router