const BugSchema = require('../Models/BugModel')

const allbugs = async(req,resp) => {
    const bugs = await BugSchema.find()
    try{
        resp.json({
        message : 'all bugs details',
        data : bugs
    })
    }catch(err){
        resp.status(500).json({
            err:err
        })
    }
}

const addBug = async(req,resp) => {
    const savedbug = await BugSchema.create(req.body)
    try{
        resp.status(201).json({
        message : 'bug detail saved',
        data : savedbug
    })
    }catch(err){
        resp.status(500).json({
            err:err
        })
    }
}

const getBugById = async(req,resp) => {
    const bugdetail = await BugSchema.findById(req.params.id)
    try{
        resp.json({
        message : "bug Details Fetched",
        data : bugdetail
    })
    }catch(err){
        resp.status(500).json({
            err:err
        })
    }
    
}

const uppdateBug = async(req,resp) => {
    const updatedData = await BugSchema.findByIdAndUpdate(req.body)
    try{
        resp.json({
            message : "Update bug details succesfully",
            data : updatedData
        })
    }catch(err){
        resp.status(500).json({
            err:err
        })
    }
}

module.exports = {
    addBug,
    allbugs,
    getBugById,
    uppdateBug
}