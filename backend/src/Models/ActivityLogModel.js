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

            // 🔹 User Actions
            "USER_CREATED",
            "USER_UPDATED",
            "USER_DELETED",

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
    },
    { timestamps: true }
    );

    const ActivityLogModel = mongoose.model("activitylog", ActivityLogSchema);

    module.exports = ActivityLogModel;