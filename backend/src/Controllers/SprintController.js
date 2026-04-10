const SprintSchema = require('../Models/SprintModel')
const ActivityLogModel = require('../Models/ActivityLogModel')
const NotificationModel = require('../Models/NotificationModel')
const ProjectModel = require('../Models/ProjectModel')
const getData = async (req, resp) => {
    try {
        const res = await SprintSchema.find().populate("projectId")

        resp.json({
        message: "Data Found Successfully",
        data: res
        })
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err
        })
    }
}

const AddSprint = async (req, resp) => {
    try {
        // ✅ 1. Create Sprint
        const sprint = await SprintSchema.create(req.body)

        // ✅ 2. Create Activity Log
        await ActivityLogModel.create({
        user: req.body.userId,
        action: "SPRINT_CREATED",
        project: req.body.projectId,
        sprint: sprint._id
        })
     } catch (err) {
        console.log(err)
        resp.status(500).json({
        message: "Server Error",
        err: err
        })
    }
}

const getDataByProject = async (req, resp) => {
    try {
        const res = await SprintSchema.find({
        projectId: req.params.id
        }).populate("projectId")

        resp.json({
        message: "Sprint data find",
        data: res
        })
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err
        })
    }
}

module.exports = {
    getData,
    AddSprint,
    getDataByProject
}