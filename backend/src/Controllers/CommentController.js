const CommentSchema = require('../Models/CommentModel')

const getAllComment = async(req,resp) => {
    try{
        const res = await CommentSchema.find()
        resp.json({
            message : "All Comment Find",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "Error while fetching the comment",
            err : err
        })
    }
}

const addComment = async (req,resp) => {
    try{
        const res = await CommentSchema.create(req.body)
        resp.status(201).json({
            message : "Comment Add successfully",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "Error while Add booking",
            err : err
        })
    }
}

const getCommentById = async(req,resp) => {
    try{
        const res = await CommentSchema.findById(req.params.id).populate([
            {path : "bugId", populate :{path : "projectId"}},
            {path : "userId"}
        ])
        resp.json({
            message : "Comment Data Fetched",
            data : res
        })
    }catch(err){
            console.log(err)
        resp.status(500).json({
            message : "Error While Fetching the details",
            err : err
        })
    }
}

const getCommentByBug = async (req,resp) => {
    const {id} = req.params
    try{
        const res = await CommentSchema.find({bugId : id}).populate([
            {path: "bugId", populate : {path : "projectId"} },
            {path: "userId"}
        ])
        resp.json({
            message : "All Comments Find",
            data : res
        })
    }catch(err){
        console.log(err)
        resp.status(500).json({
            message : "Server Error",
            err : err
        })
    }
}

module.exports = {
    getAllComment,
    addComment,
    getCommentById,
    getCommentByBug
}