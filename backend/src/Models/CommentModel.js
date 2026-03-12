    const mongoose = require("mongoose");

    const CommentSchema = new mongoose.Schema(
    {
        bug: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bug",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
    );

    const CommentModel = mongoose.model("Comment", CommentSchema);
    module.exports = CommentModel;