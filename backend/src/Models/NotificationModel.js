    const mongoose = require("mongoose");

    const NotificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        bug: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bug",
        },

        message: {
            type: String,
            required: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
    );

    const NotificationModel = mongoose.model("Notification", NotificationSchema);
    module.exports = NotificationModel;