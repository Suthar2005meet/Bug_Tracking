    const mongoose = require("mongoose");

    const NotificationSchema = new mongoose.Schema(
    {
        // 🔹 Who will receive the notification
        receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        },

        // 🔹 Who triggered the action
        sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        },

        // 🔹 Type of notification (Controlled values)
        type: {
        type: String,
        required: true,
        enum: [
            "BUG_ASSIGNED",
            "BUG_STATUS_CHANGED",
            "BUG_UPDATED",
            "BUG_COMMENTED",
            "TASK_ASSIGNED",
            "TASK_COMPLETED",
            "TASK_STATUS_CHANGED",
            "PROJECT_ADDED",
            "SPRINT_ADDED",
            "USER_ADDED",
            "USER_PASSWORD_CHANGED",
            "USER_UPDATED",
            "LOGIN",
        ],
        },

        // 🔹 Related Bug (Optional)
        bug: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bugs",
        },

        // 🔹 Related Project (Optional)
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

        // 🔹 Custom message (Optional but useful)
        message: {
        type: String,
        },

        // 🔹 Read Status
        isRead: {
        type: Boolean,
        default: false,
        },
    },
    { timestamps: true },
    );

    const NotificationModel = mongoose.model("notifications", NotificationSchema);

    module.exports = NotificationModel;
