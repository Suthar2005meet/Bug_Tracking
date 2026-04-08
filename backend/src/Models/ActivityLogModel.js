    const mongoose = require("mongoose");

    const ActivityLogSchema = new mongoose.Schema(
    {
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        },

        action: {
        type: String,
        required: true,
        enum: [
            // 🔹 Authentication
            "LOGIN",
            "LOGOUT",

            // 🔹 Bug Actions
            "BUG_CREATED",
            "BUG_UPDATED",
            "BUG_DELETED",
            "BUG_ASSIGNED",
            "BUG_STATUS_CHANGED",

            // 🔹 Project Actions
            "PROJECT_CREATED",
            "PROJECT_UPDATED",
            "PROJECT_DELETED",

            // 🔹 Task Actions
            "TASK_CREATED",
            "TASK_UPDATED",
            "TASK_COMPLETED",
            "TASK_STATUS_CHANGED",
            // 🔹 Sprint Actions
            "SPRINT_CREATED",
            "SPRINT_UPDATED",
            "SPRINT_COMPLETED",
            // 🔹 Sprint Actions
            "SPRINT_CREATED",
            "SPRINT_UPDATED",
            "SPRINT_COMPLETED",

            // 🔹 User Actions
            "USER_CREATED",
            "USER_UPDATED",
            "USER_DELETED",
            "USER_PASSWORD_CHANGED",

            // 🔹 Comments
            "COMMENT_ADDED",
            "COMMENT_DELETED"
        ],
        },

        bug: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bugs",
        },

        project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
        },

        task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "issues",
        },

        sprint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "sprints",
        },
    },
    { timestamps: true }
    );

    const ActivityLogModel = mongoose.model("activitylogs", ActivityLogSchema);

    module.exports = ActivityLogModel;