const mongoose = require("mongoose");

const BugSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        default : "https://cdn-icons-png.flaticon.com/512/564/564619.png"
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
        enum: ["Open", "In Progress", "In Testing", "Resolved", "Re-Open", "Closed"],
        default: "Open",
    },


    expectedResult : {
        type : String,
        required : true
    },

    dueDate : {
        type : String
    },
    taskId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "issue",
        required: true,
    },

    projectId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
    },

    assignedId : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        }
    ],

    reportedBy : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    }]

},
{ timestamps: true }
);

const BugModel = mongoose.model("bugs", BugSchema);
module.exports = BugModel;