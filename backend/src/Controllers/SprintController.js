const SprintSchema = require('../Models/SprintModel')

const getData = async(req,resp) => {
    try{
        const res = await SprintSchema.find()
        resp.json({
            message : "Data Found Successfully",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "Server Error",
            err : err
        })
    }
}

const AddSprint = async(req,resp) => {
    try{
        const res = await SprintSchema.create(req.body)
        resp.json({
            message : "Data Added Successfully",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "Server Error",
            err : err
        })
    }
}

const getDataByProject = async(req,resp) => {
    try{
        const res = await SprintSchema.find({projectId : req.params.id}).populate("projectId")
        resp.json({
            message : "Sprint data find",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "Server Error",
            err : err
        })
    }
}

module.exports = {
    getData,
    AddSprint,
    getDataByProject
}