    const mongoose = require("mongoose");

    const ActivityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        action: {
            type: String,
            required: true,
        },

        bug: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bug",
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },
    },
    { timestamps: true }
    );

    const ActivityLogModel = mongoose.model("ActivityLog", ActivityLogSchema);
    module.exports = ActivityLogModel;