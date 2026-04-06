    const IssueSchema = require("../Models/IssueModel");
    const uploadToCloudinary = require("../Utils/uploadToCloudinary");

    const getData = async (req, resp) => {
    try {
        const res = await IssueSchema.find();
        resp.json({
        message: "Data Found SuccessFully",
        data: res,
        });
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err,
        });
    }
    };

    const addTask = async (req, resp) => {
    try {
        console.log("BODY", req.body);
        console.log("FILE", req.file);
        if (!req.file) {
        return resp.status(400).json({
            error: "file not upload",
        });
        }
        const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);
        console.log(req.file.buffer);
        console.log("response.....", cloudinaryResponse);
        const savedTask = await IssueSchema.create({
        ...req.body,
        document: cloudinaryResponse.secure_url,
        });
        resp.status(201).json({
        message: "project create Successfully",
        data: savedTask,
        });
    } catch (err) {
        console.log(err);
        resp.status(500).json({
        err: err,
        });
    }
    };

    const sprintByTask = async (req, resp) => {
    const { id } = req.params;
    try {
        const res = await IssueSchema.find({ sprintId: id });
        resp.json({
        message: "Sprint data found",
        data: res,
        });
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err,
        });
    }
    };

    const mongoose = require("mongoose");

    const issueById = async (req, resp) => {
    try {
        const { id } = req.params;

        // ✅ Check valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return resp.status(400).json({
            message: "Invalid Issue ID",
        });
        }

        const issue = await IssueSchema.findById(id).populate([
        { path: "projectId" },
        { path: "reporterId" },
        { path: "assigend" }, // keep same if schema has this spelling
        { path: "sprintId" },
        ]);

        // ✅ If no data found
        if (!issue) {
        return resp.status(404).json({
            message: "Issue Not Found",
        });
        }

        resp.status(200).json({
        message: "Issue Data Found",
        data: issue,
        });
    } catch (err) {
        console.error(err);

        resp.status(500).json({
        message: "Server Error",
        error: err.message,
        });
    }
    };

    const updateIssue = async (req, resp) => {
    try {
        const res = await IssueSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        });
        resp.json({
        message: "Update Successfully",
        data: res,
        });
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err,
        });
    }
    };

    const getDataByUser = async (req, resp) => {
    const { id } = req.params;

    try {
        const issues = await IssueSchema.find({
        assigend: id,
        issueType: "Task",
        status: ["Open", "In Progress", "In Testing", "Re-Open", "Closed"],
        }).populate([
        { path: "projectId" },
        { path: "reporterId" },
        { path: "assigend" }, // keep same if schema has this spelling
        { path: "sprintId" },
        ]);

        resp.status(200).json({
        message: "Issues Found Successfully",
        data: issues,
        });
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        error: err.message,
        });
    }
    };

    const updateIssueStatus = async (req, resp) => {
    try {
        const { status } = req.body;

        const res = await IssueSchema.findById(req.params.id);
        if (res) {
        res.status = status;
        await res.save();

        resp.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: res,
        });
        } else {
        resp.status(404).json({
            message: "Task Not Find",
        });
        }
    } catch (err) {
        console.log(err);
        resp.status(500).json({
        message: "Server Error",
        err: err,
        });
    }
    };

    const addUserToIssue = async (req, res) => {
    try {
        const { id } = req.params; // issue id
        const { assigned } = req.body; // tester or developer id

        const updatedIssue = await IssueSchema.findByIdAndUpdate(
        id,
        {
            $addToSet: { assigend: assigned }, // prevents duplicate entry
        },
        { new: true },
        ).populate("assigend");

        res.json({
        message: "User Added Successfully",
        data: updatedIssue,
        });
    } catch (err) {
        res.status(500).json({
        message: "Server Error",
        error: err.message,
        });
    }
    };

    const getDataByTester = async(req,resp) => {
        const { id } = req.params
        try{
            const res = await IssueSchema.find({
                assigend : id,
                status : ["In Testing" , "Resolved", "Closed", "Re-Open",]
            })
            resp.json({
                message : "Tester All Data Find",
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
    getData,
    addTask,
    sprintByTask,
    issueById,
    updateIssue,
    getDataByUser,
    updateIssueStatus,
    addUserToIssue,
    getDataByTester
    };
