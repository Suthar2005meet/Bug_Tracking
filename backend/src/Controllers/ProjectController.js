const ProjectSchema = require('../Models/ProjectModel')

const getAllProject = async(req,resp) => {
    const allProject = await ProjectSchema.find()
    resp.json({
        message : "All Project Details",
        data : allProject
    })
}

const createProject = async(req,resp) => {
    const savedProject = await ProjectSchema.create(req.body)
    try{
        resp.status(201).json({
            message : 'project create Successfully',
            data : savedProject
        })
    }catch(err){
        resp.json({
            err : err
        })
    }
}



module.exports = {
    getAllProject,
    createProject
}