const ProjectSchema = require('../Models/ProjectModel')
const uploadToCloudinary = require('../Utils/uploadToCloudinary')

const getAllProject = async(req,resp) => {
    const allProject = await ProjectSchema.find()
    resp.json({
        message : "All Project Details",
        data : allProject
    })
}

const createProject = async(req,resp) => {
    try{
        console.log("BODY" , req.body);
        console.log("FILE" , req.file);
        if(!req.file){
            return resp.status(400).json({
                error : 'file not upload'
            })
        }
        const cloudinaryResponse = await uploadToCloudinary(req.file.path)
        console.log(req.file.path);
        console.log('response.....',cloudinaryResponse);
        const savedProject = await ProjectSchema.create({...req.body,document:cloudinaryResponse.secure_url})
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