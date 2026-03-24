    const mongoose = require("mongoose");

    const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },
        
        mobileno : {
            type : Number,
            required : true
        },

        role: {
            type: String,
            enum: ["Admin", "ProjectManager", "Tester", "Developer"],
            required: true,
        },

        image : {
            type : String,
            default : " "
        },

        bio : {
            type : String,
        },

        isActive : {
            type : Boolean,
            default : true
        },

        isDeleted : {
            type : Boolean,
            default : false
        }

    },
    { timestamps: true }
    );

    const UserModel = mongoose.model("users", UserSchema);
    module.exports = UserModel;