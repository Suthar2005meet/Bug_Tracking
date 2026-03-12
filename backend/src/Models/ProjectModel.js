    const mongoose = require("mongoose");

    const ProjectSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
        },

        startDate: Date,
        endDate: Date,

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignedMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
    );

    const ProjectModel = mongoose.model("Project", ProjectSchema);
    module.exports = ProjectModel;