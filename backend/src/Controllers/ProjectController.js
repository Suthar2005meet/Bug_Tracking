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
    const res = await ProjectSchema.findById(req.params.id).populate([
        {path: "assignedMembers"},
        {path: "assignedTester"}
    ])
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

const updateById = async (req,resp)  => {
    try{
        const res = await ProjectSchema.findByIdAndUpdate(req.params.id, req.body, {new : true})
        resp.json({
            message : "Update Succesfully",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "error while fetching the data",
            err : err
        })
    }
}

const getProjectByStatus = async(req,resp) => {
    try{
        const statusData = await ProjectSchema.aggregate([
        {
            $group : {
                _id : "$status",
                total : { $sum : 1}
            }
        }
        ])
        resp.status(200).json({
            success : true,
            data : statusData
        })
    }catch(err){
        console.log(err)
        resp.status(500).json({
            message : "Data not Found",
            data : err.message
        })
    }
}

module.exports = {
    getAllProject,
    createProject,
    getProjectById,
    updateById,
    getProjectByStatus
}