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

        // assignedProjects: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Project",
        //     },
        // ],
    },
    { timestamps: true }
    );

    const UserModel = mongoose.model("users", UserSchema);
    module.exports = UserModel;