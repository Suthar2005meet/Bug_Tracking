const ActivityLog = require("../Models/ActivityLogModel");

const logActivity = async ({ user, action, bug = null, project = null }) => {
    try {
        await ActivityLog.create({
            user,
            action,
            bug,
            project
        });
    } catch (err) {
        console.error("Activity Log Error:", err.message);
    }
};

module.exports = logActivity;