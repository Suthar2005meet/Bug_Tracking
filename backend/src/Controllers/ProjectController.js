const ProjectSchema = require('../Models/ProjectModel')
const uploadToCloudinary = require('../Utils/uploadToCloudinary')

const getAllProject = async(req,resp) => {
    const allProject = await ProjectSchema.find()
    try{
        resp.json({
        message : "All Project Details",
        data : allProject
        })
    }catch(err){
        resp.status(500).json({
            message : "Error while fetching the Details"
        })
    }
    
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
        const cloudinaryResponse = await uploadToCloudinary(req.file.buffer)
        console.log(req.file.buffer);
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

const getProjectById = async (req,resp) => {
    const res = await ProjectSchema.findById(req.params.id)
    try{
        resp.json({
            message : "Project Details Fetched",
            data: res
        })
    }catch(err){
        resp.status(500).json({
            message : "Error while fetched the details"
        })
    }
}



module.exports = {
    getAllProject,
    createProject,
    getProjectById
}