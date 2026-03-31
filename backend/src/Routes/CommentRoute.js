const router = require("express").Router()

const CommentController = require("../Controllers/CommentController")
router.get('/all',CommentController.getAllComment)
router.post('/create',CommentController.addComment)
router.get('/detail/:id',CommentController.getCommentById)
router.get('/bug/:id',CommentController.getCommentByBug)

module.exports = router