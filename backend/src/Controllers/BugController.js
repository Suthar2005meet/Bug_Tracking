    const BugSchema = require('../Models/BugModel')
    const uploadToCloudinary = require('../Utils/uploadToCloudinary')


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

    const addBug = async (req, resp) => {
    try {
            console.log("BODY:", req.body);
            console.log("FILE:", req.file);

        if (!req.file) {
        return resp.status(400).json({
            error: "File not uploaded"
        });
    }
        //console.log('Response.....', cloudinaryResponse)
        const cloudinaryResponse = await uploadToCloudinary(req.file.buffer)
        console.log(req.file.path);
        console.log('Response.....', cloudinaryResponse)
        const savedbug = await BugSchema.create({...req.body,image: cloudinaryResponse.secure_url})

        resp.status(201).json({
        message: 'bug detail saved',
        data: savedbug
        })
    } catch (err) {
        console.error('addBug failed:', err.message)
        resp.status(500).json({
        error: err.message || err
        })
    }
    }

    const getBugById = async(req,resp) => {
        const bugdetail = await BugSchema.findById(req.params.id).populate([
            {path : "projectName",populate : [
                {path : "assignedMembers"},
                {path : "assignedTester"}
            ]}
        ])
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
        const updatedData = await BugSchema.findByIdAndUpdate(req.params.id, req.body, { new: true })
        try{
            resp.status(200).json({
                message : "Update bug details succesfully",
                data : updatedData
            })
        }catch(err){
            resp.status(500).json({
                err:err
            })
        }
    }

    const getBugByStatus = async (req, res) => {
        try {
            const statusData = await BugSchema.aggregate([
            {
                $group: {
                _id: "$status",      // group by status field
                total: { $sum: 1 }   // count documents
                }
            }
            ]);

            res.status(200).json({
            success: true,
            data: statusData
            });

        } catch (err) {
            res.status(500).json({
            message: "Data not found",
            error: err.message
            });
        }
    };

    const getBugByUser = async(req,resp) => {
        try{
            const { id } = req.params;
            
            if(!id){
                return resp.status(400).json({
                    success : false,
                    message : "userId is required"
                })
            },

            const bug = BugSchema.find({assignedTester: id})
            .populate("assignedMembers","name email")
            .populate("assignedTester" , "name email")

            resp.status(200).json({
                success : true,
                totalBugs : bug.length,
                data
            })
        }catch(err){
            resp.status(500).json({
                message : "Error while fetching the Bug",
                err : err
            })
        }
    }

    module.exports = {
        addBug,
        allbugs,
        getBugById,
        uppdateBug,
        getBugByStatus,
    }