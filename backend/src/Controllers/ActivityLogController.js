const ActivityLogModel = require('../Models/ActivityLogModel');

// Get all activity logs
const getAllActivityLogs = async (req, resp) => {
    try {
        const logs = await ActivityLogModel.find()
            .populate('user', 'name email')
            .populate('bug', 'title')
            .populate('project', 'name')
            .sort({ createdAt: -1 });

        resp.json({
            message: "All Activity Logs Retrieved",
            data: logs
        });
    } catch (err) {
        resp.status(500).json({
            message: "Error retrieving activity logs",
            error: err.message
        });
    }
};

// Get activity logs for a specific user
const getActivityLogsByUser = async (req, resp) => {
    try {
        const { userId } = req.params;
        const logs = await ActivityLogModel.find({ user: userId })
            .populate('user', 'name email')
            .populate('bug', 'title')
            .populate('project', 'name')
            .sort({ createdAt: -1 });

        resp.json({
            message: "User Activity Logs Retrieved",
            data: logs
        });
    } catch (err) {
        resp.status(500).json({
            message: "Error retrieving user activity logs",
            error: err.message
        });
    }
};

// Get activity logs for a specific project
const getActivityLogsByProject = async (req, resp) => {
    try {
        const { projectId } = req.params;
        const logs = await ActivityLogModel.find({ project: projectId })
            .populate('user', 'name email')
            .populate('bug', 'title')
            .populate('project', 'name')
            .sort({ createdAt: -1 });

        resp.json({
            message: "Project Activity Logs Retrieved",
            data: logs
        });
    } catch (err) {
        resp.status(500).json({
            message: "Error retrieving project activity logs",
            error: err.message
        });
    }
};

// Get activity logs for a specific bug
const getActivityLogsByBug = async (req, resp) => {
    try {
        const { bugId } = req.params;
        const logs = await ActivityLogModel.find({ bug: bugId })
            .populate('user', 'name email')
            .populate('bug', 'title')
            .populate('project', 'name')
            .sort({ createdAt: -1 });

        resp.json({
            message: "Bug Activity Logs Retrieved",
            data: logs
        });
    } catch (err) {
        resp.status(500).json({
            message: "Error retrieving bug activity logs",
            error: err.message
        });
    }
};

module.exports = {
    getAllActivityLogs,
    getActivityLogsByUser,
    getActivityLogsByProject,
    getActivityLogsByBug
};