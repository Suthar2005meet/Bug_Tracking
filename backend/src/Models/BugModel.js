    const mongoose = require("mongoose");

    const BugSchema = new mongoose.Schema(
    {
        bugTitle: {
            type: String,
            required: true,
        },

        description: String,

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Resolved", "Closed"],
            default: "Open",
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
    );

    const BugModel = mongoose.model("Bug", BugSchema);
    module.exports = BugModel;