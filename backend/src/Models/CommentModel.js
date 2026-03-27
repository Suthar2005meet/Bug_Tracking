    const mongoose = require("mongoose");

    const CommentSchema = new mongoose.Schema(
    {
        bugId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "bugs",
            required: true,
        },

        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "users",
            required:true
        },

        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
    );

    const CommentModel = mongoose.model("comment", CommentSchema);
    module.exports = CommentModel;