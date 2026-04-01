const mongoose = require("mongoose")

const Schema = mongoose.Schema

const IssueSchema = new Schema (
    {
        title : {
            type : String,
            required : true
        },

        issueType : {
            type : String,
            enum : ["Bug", "Task"]
        },

        priority : {
            type : String,
            enum : ["Low", "Medium", "High", "Critical"]
        },

        status : {
            type : String,
            enum : ["Open", "In Progress" , "In Testing", "Resolved", "Closed", "Re-Open"],
            default : "Open"
        },

        projectId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "projects"
        },

        reporterId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        },

        assigend : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        }],

        sprintId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "sprint"
        },

        attachements : {
            type : String,
            required : true
        },

        dueDate : {
            type : String
        }
    }
)

module.exports = mongoose.model("issue", IssueSchema)