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
            "PROJECT_ADDED",
            "USER_ADDED",
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

    const NotificationModel = mongoose.model("Notification", NotificationSchema);

    module.exports = NotificationModel;
