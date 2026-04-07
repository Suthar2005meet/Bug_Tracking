const mongoose = require("mongoose")

const Schema = mongoose.Schema

const SprintSchema = new Schema ({
    name : {
        type : String,
    },

    projectId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "projects"
    },

    startDate : {
        type : String,
    },

    dueDate : {
        type : String,
    },

    status : {
        type : String,
        enum : ["Planned", "Active", "Completed"]
    },
})

module.exports = mongoose.model("sprints", SprintSchema)