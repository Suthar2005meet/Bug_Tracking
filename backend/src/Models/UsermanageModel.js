const mongoose = require("mongoose");

const userManageSchema = new mongoose.Schema(
  {
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true   // One team per Project Manager
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("usermanages", userManageSchema);