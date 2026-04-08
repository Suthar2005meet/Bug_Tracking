const CommentSchema = require("../Models/CommentModel");
const BugModel = require("../Models/BugModel");
const ActivityLogModel = require("../Models/ActivityLogModel");
const NotificationModel = require("../Models/NotificationModel");


// =====================================================
// 1️⃣ Get All Comments
// =====================================================
const getAllComment = async (req, resp) => {
    try {
        const res = await CommentSchema.find()
            .populate([
                { path: "bugId"},
                { path: "userId" }
            ]);

        resp.json({
            message: "All Comment Find",
            data: res
        });

    } catch (err) {
        resp.status(500).json({
            message: "Error while fetching the comment",
            err: err
        });
    }
};


// =====================================================
// 2️⃣ Add Comment + Activity + Notification
// =====================================================
const addComment = async (req, resp) => {
    try {
        const { bugId, userId, comment } = req.body;

        // 🔹 Validate Required Fields
        if (!bugId || !userId || !comment) {
            return resp.status(400).json({
                message: "bugId, userId and comment are required"
            });
        }

        // 🔹 Check Bug Exists
        const bug = await BugModel.findById(bugId);
        if (!bug) {
            return resp.status(404).json({
                message: "Bug not found"
            });
        }

        // 🔹 Create Comment
        const newComment = await CommentSchema.create({
            bugId,
            userId,
            comment
        });

        // =====================================================
        // 🔥 Activity Log
        // =====================================================
        await ActivityLogModel.create({
            user: userId,
            action: "COMMENT_ADDED",
            bug: bugId,
            project: bug.projectId
        });

        // =====================================================
        // 🔔 Notification to Assigned Developers
        // =====================================================
        if (bug.assignedDeveloper && bug.assignedDeveloper.length > 0) {

            const notifications = bug.assignedDeveloper
                .filter(dev => dev.toString() !== userId) // prevent self notification
                .map(dev => ({
                    receiver: dev,
                    sender: userId,
                    type: "BUG_COMMENTED",
                    bug: bugId,
                    project: bug.projectId,
                    message: "New comment added on assigned bug"
                }));

            if (notifications.length > 0) {
                await NotificationModel.insertMany(notifications);
            }
        }

        resp.status(201).json({
            message: "Comment Add successfully",
            data: newComment
        });

    } catch (err) {
        console.log(err);
        resp.status(500).json({
            message: "Error while adding comment",
            err: err
        });
    }
};


// =====================================================
// 3️⃣ Get Comment By ID
// =====================================================
const getCommentById = async (req, resp) => {
    try {
        const res = await CommentSchema.findById(req.params.id)
            .populate([
                { path: "bugId"},
                { path: "userId" }
            ]);

        resp.json({
            message: "Comment Data Fetched",
            data: res
        });

    } catch (err) {
        console.log(err);
        resp.status(500).json({
            message: "Error While Fetching the details",
            err: err
        });
    }
};


// =====================================================
// 4️⃣ Get Comments By Bug
// =====================================================
const getCommentByBug = async (req, resp) => {
    const { id } = req.params;

    try {
        const res = await CommentSchema.find({ bugId: id })
            .populate([
                { path: "bugId"},
                { path: "userId" }
            ]);

        resp.json({
            message: "All Comments Find",
            data: res
        });

    } catch (err) {
        console.log(err);
        resp.status(500).json({
            message: "Server Error",
            err: err
        });
    }
};


module.exports = {
    getAllComment,
    addComment,
    getCommentById,
    getCommentByBug
};