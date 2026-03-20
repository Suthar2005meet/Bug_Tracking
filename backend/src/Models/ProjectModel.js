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

        priority : {
            type : String,
            required : true,
            enum : ["Low","Medium","High"]
        },

        startDate: {
            type : String,
        },
        dueDate: {
            type : String
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending",
        },

        document : {
            type : String,
            require : true
        },

        // createdBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "user",
        //     required: true,
        // },

        assignedMembers : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
    },
    { timestamps: true }
    );

    const ProjectModel = mongoose.model("projects", ProjectSchema);
    module.exports = ProjectModel;