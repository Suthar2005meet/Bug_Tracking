    const mongoose = require("mongoose");

    const AttachmentSchema = new mongoose.Schema(
    {
        bug: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bug",
            required: true,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        fileName: {
            type: String,
            required: true,
        },

        fileUrl: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
    );

    const AttachmentModel = mongoose.model("Attachment", AttachmentSchema);
    module.exports = AttachmentModel;