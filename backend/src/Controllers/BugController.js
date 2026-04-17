const BugSchema = require("../Models/BugModel");
const ActivityLogModel = require("../Models/ActivityLogModel");
const NotificationModel = require("../Models/NotificationModel");
const uploadToCloudinary = require("../Utils/uploadToCloudinary");
const ProjectSchema = require("../Models/ProjectModel"); // Register project model
const IssueSchema = require("../Models/IssueModel");     // Register issue model

const normalizeToArray = value => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
};

// ✅ Safe Activity Logger
const logActivity = async ({ user, action, bug, project, task, sprint }) => {
    try {
        if (!user) {
            console.warn(`Activity skipped [${action}]: no user provided`);
            return;
        }
        await ActivityLogModel.create({
            user,
            action,
            bug: bug || null,
            project: project || null,
            task: task || null,
            sprint: sprint || null,
        });
    } catch (err) {
        console.error("Activity Error:", err.message);
    }
};

// =====================================================
// 1️⃣ Get All Bugs
// =====================================================
const allbugs = async (req, resp) => {
    try {
        const bugs = await BugSchema.find()
            .populate("reportedBy", "name email role")
            .populate("assignedId", "name email role")
            .populate("projectId", "title")
            .sort({ createdAt: -1 });

        resp.json({
            success: true,
            message: "all bugs details",
            data: bugs
        });

    } catch (err) {
        resp.status(500).json({ success: false, err: err.message });
    }
};


// =====================================================
// 2️⃣ Add Bug + Activity + Notification
// =====================================================
// const addBug = async (req, resp) => {
//     try {

//         if (!req.file) {
//             return resp.status(400).json({
//                 error: "File not uploaded",
                
//             });
//         }

//         const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);

//         const savedbug = await BugSchema.create({
//             ...req.body,
//             image: cloudinaryResponse.secure_url
//         });

//         const reporterId = Array.isArray(req.body.reportedBy)
//             ? req.body.reportedBy[0]
//             : req.body.reportedBy;

//         // =====================================================
//         // 🔥 Activity Log
//         // =====================================================
//         await ActivityLogModel.create({
//             user: reporterId,
//             action: "BUG_CREATED",
//             bug: savedbug._id,
//             task: req.body.taskId || null
//         });

//         // =====================================================
//         // 🔔 Notification to Assigned Developers
//         // =====================================================
//         const assignedUsers = normalizeToArray(savedbug.assignedId);
//         if (assignedUsers.length > 0) {
//             const notifications = assignedUsers.map(dev => ({
//                 receiver: dev,
//                 sender: reporterId,
//                 type: "BUG_ASSIGNED",
//                 bug: savedbug._id,
//                 task: req.body.taskId || null,
//                 message: "You have been assigned a new bug"
//             }));

//             await NotificationModel.insertMany(notifications);
//         }

//         resp.status(201).json({
//             message: "bug detail saved",
//             data: savedbug
//         });

//     } catch (err) {
//         console.error("addBug failed:", err.message);
//         resp.status(500).json({
//             error: err.message || err
//         });
//     }
// };

const addBug = async (req, resp) => {
    try {

        if (!req.file) {
            return resp.status(400).json({
                error: "File not uploaded",
            });
        }

        const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);

        // 🔥 Get Reporter ID safely
        const reporterId = Array.isArray(req.body.reportedBy)
            ? req.body.reportedBy[0]
            : req.body.reportedBy;

        // 🔥 Normalize Assigned Developers
        const assignedUsers = normalizeToArray(req.body.assignedId);

        // =====================================================
        // ✅ Create Bug
        // =====================================================
        const IssueSchema = require("../Models/IssueModel"); // required to fetch task's project
        const linkedTask = await IssueSchema.findById(req.body.taskId);
        const projectId = linkedTask ? linkedTask.projectId : req.body.projectId;

        const savedbug = await BugSchema.create({
            ...req.body,
            projectId,                   // Save project ID for easier retrieval
            reportedBy: reporterId,      // ensure proper reporter saved
            assignedId: assignedUsers,   // ensure array format
            image: cloudinaryResponse.secure_url
        });

        // 🔥 Activity Log
        await logActivity({
            user: reporterId,
            action: "BUG_CREATED",
            bug: savedbug._id,
            task: req.body.taskId || null
        });

        // =====================================================
        // 🔔 Notification to Assigned Developers
        // =====================================================
        if (assignedUsers.length > 0) {

            const notifications = assignedUsers.map(dev => ({
                receiver: dev,
                sender: reporterId,
                type: "BUG_ASSIGNED",
                bug: savedbug._id,
                task: req.body.taskId || null,
                message: "You have been assigned a new bug"
            }));

            await NotificationModel.insertMany(notifications);
        }

        // =====================================================
        // ✅ Return Populated Bug (IMPORTANT)
        // =====================================================
        const populatedBug = await BugSchema.findById(savedbug._id)
            .populate("reportedBy", "name email role")
            .populate("assignedId", "name email role")
            .populate("taskId", "title");

        resp.status(201).json({
            success: true,
            message: "bug detail saved",
            data: populatedBug
        });

    } catch (err) {
        console.error("addBug failed:", err.message);
        resp.status(500).json({
            error: err.message || err
        });
    }
};

// =====================================================
// 3️⃣ Get Bug By ID
// =====================================================
const getBugById = async(req,resp) => {
    try{
        const bug = await BugSchema.findById(req.params.id).populate([
            { path: "reportedBy" },
            { path: "assignedId" },
            {
                path: "taskId",
                populate: { path: "projectId" }
            }
        ]);

        if (!bug) {
            return resp.status(404).json({ message: "Bug Not Found" });
        }

        // Convert to object to add dynamic fields for frontend compatibility
        const bugObj = bug.toObject();
        
        // Derive projectId from taskId if it's missing on the bug itself (for old data)
        let projectData = bugObj.projectId;
        
        // If projectId is just an ID or null, try to get it from taskId
        if ((!projectData || !projectData.members) && bugObj.taskId && bugObj.taskId.projectId) {
            projectData = bugObj.taskId.projectId;
        }
        
        if (projectData && typeof projectData === 'object' && projectData.members) {
            // Assign to projectId so the frontend finds it
            bugObj.projectId = projectData;
            
            bugObj.projectId.assignedDevelopers = projectData.members.filter(
                m => m.role?.toLowerCase() === 'developer' || m.role?.toLowerCase() === 'projectmanager'
            );
            bugObj.projectId.assignedTester = projectData.members.filter(
                m => m.role?.toLowerCase() === 'tester'
            );
        }

        resp.json({
            success: true,
            message: "bug Details Fetched",
            data: bugObj
        });

    } catch (err) {
        console.error("getBugById Error:", err);
        resp.status(500).json({ error: err.message });
    }
};


// =====================================================
// 4️⃣ Update Bug + Activity
// =====================================================
const uppdateBug = async (req, resp) => {
    try {

        const oldBug = await BugSchema.findById(req.params.id);

        const updatedData = await BugSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedData) {
            return resp.status(404).json({
                message: "Bug Not Found"
            });
        }

        // 🔥 Activity Log
        await logActivity({
            user: req.body.updatedBy,
            action: "BUG_UPDATED",
            bug: updatedData._id,
            task: updatedData.taskId
        });

        const populatedUpdated = await BugSchema.findById(updatedData._id)
            .populate("reportedBy", "name email role")
            .populate("assignedId", "name email role");

        resp.status(200).json({
            success: true,
            message: "Update bug details successfully",
            data: populatedUpdated
        });

    } catch (err) {
        console.log(err)
        resp.status(500).json({ success: false, err: err.message });
    }
};


// =====================================================
// 5️⃣ Bug Status Analytics
// =====================================================
const getBugByStatus = async (req, res) => {
    try {
        const statusData = await BugSchema.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: statusData
        });

    } catch (err) {
        res.status(500).json({
            message: "Data not found",
            error: err.message
        });
    }
};


// =====================================================
// 6️⃣ Get Bugs By User
// =====================================================
const getBugsByUser = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required in URL"
            });
        }

        const bugs = await BugSchema.find({
            $or: [
                { assignedId: id },
                { reportedBy: id }
            ]
        }).populate([
            { path: "assignedId" },
            { path: "reportedBy" }
        ]);

        res.status(200).json({
            success: true,
            totalBugs: bugs.length,
            data: bugs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// 7️⃣ Update Bug Status + Activity + Notification
// =====================================================
const updateBugStatus = async (req, resp) => {
    try {

        const { status, updatedBy } = req.body;

        const bug = await BugSchema.findById(req.params.id);

        if (!bug) {
            return resp.status(404).json({
                message: "Bug Not Find"
            });
        }

        bug.status = status;
        await bug.save();

        // 🔥 Activity Log
        await logActivity({
            user: updatedBy,
            action: "BUG_STATUS_CHANGED",
            bug: bug._id,
            project: bug.projectId
        });

        // 🔔 Notify Reporter
        if (bug.reportedBy?.length > 0) {
            const notifications = bug.reportedBy.map(user => ({
                receiver: user,
                sender: updatedBy,
                type: "BUG_STATUS_CHANGED",
                bug: bug._id,
                project: bug.projectId,
                message: `Bug status changed to ${status}`
            }));

            await NotificationModel.insertMany(notifications);
        }

        const populatedBug = await BugSchema.findById(bug._id)
            .populate("reportedBy", "name email role")
            .populate("assignedId", "name email role");

        resp.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: populatedBug
        });

    } catch (err) {
        console.log(err)
        resp.status(500).json({
            success: false,
            message: "Server Error",
            err: err.message
        });
    }
};


module.exports = {
    addBug,
    allbugs,
    getBugById,
    uppdateBug,
    getBugByStatus,
    getBugsByUser,
    updateBugStatus
};