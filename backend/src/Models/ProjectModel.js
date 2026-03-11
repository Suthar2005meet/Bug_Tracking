const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema ({
    ProjectName : {
        type : String,
        required : true
    },
    ProjectDec : {
        type : String,
        required : true
    },
    ProjectPriority : {
        type : String,
        required : true,
        enum : ["Low","Medium","High"]
    },
    ProjectStatus : {
        type : String,
        required : true
    },
    // Document : {
    //     type : string,
    //     default : ""
    // }
    StartDate : {
        type : String,
        required : true
    },
    DueDate : {
        type : String,
        required : true
    }
},{timestamps:true})


module.exports = mongoose.model('Project' , ProjectSchema)