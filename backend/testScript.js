const mongoose = require("mongoose");
const dbenv = require('dotenv').config();
const dbconnection = require("./src/Utils/DBConnection");

const User = require("./src/Models/UserModel");
const Project = require("./src/Models/ProjectModel");
const Issue = require("./src/Models/IssueModel");
const Bug = require("./src/Models/BugModel");
const Sprint = require("./src/Models/SprintModel");
const Activity = require("./src/Models/ActivityLogModel");
const Notification = require("./src/Models/NotificationModel");

async function testAdmin() {
    await dbconnection();
    try {
        console.log("Testing Admin Promise.all...");
        await Promise.all([
            User.countDocuments(),
            Project.countDocuments(),
            Issue.countDocuments(),
            Bug.countDocuments(),
            Sprint.countDocuments(),
            User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
            Project.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Issue.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Bug.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Sprint.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Activity.find()
                .populate("user", "name role")
                .sort({ createdAt: -1 })
                .limit(8)
        ]);
        console.log("Admin successful.");
    } catch(e) {
        console.error("Admin Err:", e);
    }
    
    // Developer test
    try {
        console.log("Testing Developer/Tester Promise.all...");
        const userMatchValues = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId().toString()];
        const taskMatch = { assigned: { $in: userMatchValues } };
        const bugMatch = { $or: [ { assignedId: { $in: userMatchValues } }, { reportedBy: { $in: userMatchValues } } ] };

        await Promise.all([
            Issue.aggregate([ { $match: taskMatch }, { $group: { _id: "$status", count: { $sum: 1 } } } ]),
            Issue.aggregate([ { $match: taskMatch }, { $group: { _id: "$priority", count: { $sum: 1 } } } ]),
            Bug.aggregate([ { $match: bugMatch }, { $group: { _id: "$status", count: { $sum: 1 } } } ]),
            Bug.aggregate([ { $match: bugMatch }, { $group: { _id: "$priority", count: { $sum: 1 } } } ]),
            Notification.find({ receiver: new mongoose.Types.ObjectId() }).sort({ createdAt: -1 }).limit(10)
        ]);
        console.log("Developer successful.");
    } catch(e) {
        console.error("Developer Err:", e);
    }

    try {
        console.log("Testing PM Promise.all...");
        const objId = new mongoose.Types.ObjectId();
        const projectIds = [objId];
        const issueIds = [objId];
        await Promise.all([
            Issue.aggregate([
                { $match: { projectId: { $in: projectIds } } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Issue.aggregate([
                { $match: { projectId: { $in: projectIds } } },
                { $group: { _id: "$priority", count: { $sum: 1 } } }
            ]),
            Bug.aggregate([
                { $match: { taskId: { $in: issueIds } } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Bug.aggregate([
                { $match: { taskId: { $in: issueIds } } },
                { $group: { _id: "$priority", count: { $sum: 1 } } }
            ]),
            Sprint.aggregate([
                { $match: { projectId: { $in: projectIds } } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Activity.find({ project: { $in: projectIds } })
                .populate("user", "name role")
                .sort({ createdAt: -1 })
                .limit(6)
        ]);
        console.log("PM successful.");
    } catch(e) {
        console.error("PM Err:", e);
    }
    
    process.exit(0);
}

testAdmin();
