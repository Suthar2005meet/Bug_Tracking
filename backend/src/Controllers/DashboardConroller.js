const mongoose = require("mongoose");
const User = require("../Models/UserModel");
const Project = require("../Models/ProjectModel");
const Issue = require("../Models/IssueModel");
const Bug = require("../Models/BugModel");
const Sprint = require("../Models/SprintModel");
const Activity = require("../Models/ActivityLogModel");

const toObjectId = (value) => {
    if (value instanceof mongoose.Types.ObjectId) return value;
    if (!mongoose.Types.ObjectId.isValid(value)) return null;
    return new mongoose.Types.ObjectId(value);
};

/**
 * GET /dashboard/all
 */
const getDashboardData = async (req, res) => {
    try {
        const loggedInUserId = req.user?.id;
        const role = req.user?.role;

        if (!loggedInUserId || !role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const userObjectId = toObjectId(loggedInUserId);
        if (!userObjectId) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const meta = {
            generatedAt: new Date(),
            role
        };

        /* =========================================================
           ====================== ADMIN =============================
        ==========================================================*/
        if (role === "Admin") {

            const [
                totalUsers,
                totalProjects,
                totalIssues,
                totalBugs,
                totalSprints,
                usersByRole,
                projectsByStatus,
                issuesByStatus,
                bugsByStatus,
                sprintStatus,
                recentActivity
            ] = await Promise.all([
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
                    .limit(10)
            ]);

            return res.json({
                success: true,
                meta,
                summary: {
                    totalUsers,
                    totalProjects,
                    totalIssues,
                    totalBugs,
                    totalSprints
                },
                charts: {
                    usersByRole,
                    projectsByStatus,
                    issuesByStatus,
                    bugsByStatus,
                    sprintStatus
                },
                recentActivity
            });
        }

        /* =========================================================
           ================= PROJECT MANAGER =======================
        ==========================================================*/
        if (role === "ProjectManager") {

            const myProjects = await Project.find({ createdBy: userObjectId }).select("_id");
            const projectIds = myProjects.map(p => p._id);

            const myIssues = await Issue.find({ projectId: { $in: projectIds } }).select("_id");
            const issueIds = myIssues.map(i => i._id);

            const [
                issuesByStatus,
                issuesByPriority,
                bugsByStatus,
                bugsByPriority,
                sprintStatus,
                recentActivity
            ] = await Promise.all([

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
                    .limit(8)
            ]);

            return res.json({
                success: true,
                meta,
                summary: {
                    totalProjects: myProjects.length,
                    totalIssues: myIssues.length,
                    totalBugs: bugsByStatus.reduce((a, b) => a + b.count, 0),
                    totalSprints: sprintStatus.reduce((a, b) => a + b.count, 0)
                },
                charts: {
                    issuesByStatus,
                    issuesByPriority,
                    bugsByStatus,
                    bugsByPriority,
                    sprintStatus
                },
                recentActivity
            });
        }

        /* =========================================================
           ================= DEVELOPER / TESTER ====================
        ==========================================================*/
        if (role === "Developer" || role === "Tester") {

            const taskMatch = { assigned: userObjectId };

            const bugMatch = {
                $or: [
                    { assignedId: userObjectId },
                    { reportedBy: userObjectId }
                ]
            };

            const myTasks = await Issue.find(taskMatch).select("_id projectId");
            const taskIds = myTasks.map(t => t._id);
            const projectIds = myTasks.map(t => t.projectId);

            const [
                issuesByStatus,
                myTaskPriority,
                bugsByStatus,
                bugsByPriority,
                recentActivity
            ] = await Promise.all([

                Issue.aggregate([
                    { $match: taskMatch },
                    { $group: { _id: "$status", count: { $sum: 1 } } }
                ]),

                Issue.aggregate([
                    { $match: taskMatch },
                    { $group: { _id: "$priority", count: { $sum: 1 } } }
                ]),

                Bug.aggregate([
                    { $match: bugMatch },
                    { $group: { _id: "$status", count: { $sum: 1 } } }
                ]),

                Bug.aggregate([
                    { $match: bugMatch },
                    { $group: { _id: "$priority", count: { $sum: 1 } } }
                ]),

                Activity.find({
                    $or: [
                        { task: { $in: taskIds } },
                        { project: { $in: projectIds } },
                        { user: userObjectId }
                    ]
                })
                .populate("user", "name role")
                .sort({ createdAt: -1 })
                .limit(8)
            ]);

            return res.json({
                success: true,
                meta,
                summary: {
                    myTasks: myTasks.length,
                    myBugs: bugsByStatus.reduce((a, b) => a + b.count, 0)
                },
                charts: {
                    issuesByStatus,
                    myTaskPriority,
                    bugsByStatus,
                    bugsByPriority
                },
                recentActivity
            });
        }

        return res.status(403).json({
            success: false,
            message: `Role ${role} not supported`
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = { getDashboardData };