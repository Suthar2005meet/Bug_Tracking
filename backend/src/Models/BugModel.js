    const mongoose = require("mongoose");

    const BugSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: String,

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium",
        },

        type : {
            type : String,
            enum : ["UI Based","Frontend","Backend","API"]
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Resolved", "Closed"],
            default: "Open",
        },

        reproduce : {
            type : String,
            required : true
        },

        expectedResult : {
            type : String,
            required : true
        },

        duedate : {
            type : String
        }
        // project: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Project",
        //     required: true,
        // },

        // reportedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        //     required: true,
        // },

        // assignedTo: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        // },
    },
    { timestamps: true }
    );

    const BugModel = mongoose.model("Bug", BugSchema);
    module.exports = BugModel;