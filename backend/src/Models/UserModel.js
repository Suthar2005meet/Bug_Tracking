const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema ({
    username : {
        type : String,
        required : true
    },
    Email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    MobileNo : {
        type : Number
    },
    role : {
        type : String
    },
    // image : {
    //     type : String,
    //     default : ''
    // }
},{timestamps: true})

module.exports = mongoose.model('Users', UserSchema )