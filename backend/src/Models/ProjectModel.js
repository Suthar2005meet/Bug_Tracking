    const mongoose = require("mongoose");

    const ProjectSchema = new mongoose.Schema(
    {
        title : {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
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

        inTesting : {
            type : Boolean,
            default : false
        }
    },
    { timestamps: true }
    );

    const ProjectModel = mongoose.model("projects", ProjectSchema);
    module.exports = ProjectModel;