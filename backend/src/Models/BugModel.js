const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CreateBugschema = new Schema ({
    title : {
        type : String
    },
    Description : {
        type : String
    },
    projectName : {
        type : String
    },
    type : {
        type : String
    },
    priority : {
        type : String
    },
    developer : {
        type : String
    },
    reproduce : {
        type : String
    },
    expectedResult : {
        type : String
    },
    ActualResult : {
        type : String
    },
    dueDate : {
        type : String
    },
    uploadedDoc : {
        type : Object
    }
},{timestamps : true})

module.exports = mongoose.model('bugs',CreateBugschema)