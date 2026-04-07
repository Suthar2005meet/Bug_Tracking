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
        const currentUserId = req.user?._id || req.body.createdBy
        
        await ActivityLogModel.create({
            user: currentUserId,
            action: "SPRINT_CREATED",
            project: req.body.projectId,
            sprint: sprint._id
        })

        // ✅ 3. Notify Project Members
        const project = await ProjectModel.findById(req.body.projectId)
        
        if (project?.members?.length > 0) {
            const notifications = project.members
                .filter(member => member.toString() !== currentUserId?.toString())
                .map(member => ({
                    receiver: member,
                    sender: currentUserId,
                    type: "SPRINT_ADDED",
                    project: req.body.projectId,
                    sprint: sprint._id,
                    message: `Sprint "${req.body.name}" has been created`
                }))
            
            if (notifications.length > 0) {
                await NotificationModel.insertMany(notifications)
            }
        }

        resp.status(201).json({
            message: "Sprint Added Successfully",
            data: sprint
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