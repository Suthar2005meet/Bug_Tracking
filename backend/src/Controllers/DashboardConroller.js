const mongoose = require("mongoose");
const User = require("../Models/UserModel");
const Project = require("../Models/ProjectModel");
const Issue = require("../Models/IssueModel");
const Bug = require("../Models/BugModel");
const Sprint = require("../Models/SprintModel");
const Activity = require("../Models/ActivityLogModel");
const Notification = require("../Models/NotificationModel");

const toObjectId = (value) => {
    if (value instanceof mongoose.Types.ObjectId) {
        return value;
    }

    if (!mongoose.Types.ObjectId.isValid(value)) {
        return null;
    }

    return new mongoose.Types.ObjectId(value);
};

const buildUserMatchValues = (userObjectId, loggedInUserId) => {
    return [userObjectId, loggedInUserId].filter(Boolean);
};

/**
 * GET /dashboard/all
 * Returns role-specific analytics and summaries
 */
const getDashboardData = async (req, res) => {
    try {
        const loggedInUserId = req.user?.id;
        const role = req.user?.role;

        if (!loggedInUserId || !role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not authenticated."
            });
        }

        const userObjectId = toObjectId(loggedInUserId);
        if (!userObjectId) {
            return res.status(400).json({
                success: false,
                message: "Invalid authenticated user ID."
            });
        }

        const meta = {
            generatedAt: new Date(),
            role,
        };

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
                    .limit(8)
            ]);

            return res.json({
                success: true,
                meta,
                summary: { totalUsers, totalProjects, totalIssues, totalBugs, totalSprints },
                charts: { usersByRole, projectsByStatus, issuesByStatus, bugsByStatus, sprintStatus },
                recentActivity
            });
        }

        if (role === "ProjectManager") {
            const myProjects = await Project.find({ createdBy: userObjectId }).select("_id");
            const projectIds = myProjects.map((project) => project._id);
            const projectIssues = await Issue.find({ projectId: { $in: projectIds } }).select("_id");
            const issueIds = projectIssues.map((issue) => issue._id);

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
                    .limit(6)
            ]);

            return res.json({
                success: true,
                meta,
                summary: {
                    totalProjects: myProjects.length,
                    totalIssues: issuesByStatus.reduce((sum, item) => sum + item.count, 0),
                    totalBugs: bugsByStatus.reduce((sum, item) => sum + item.count, 0),
                    totalSprints: sprintStatus.reduce((sum, item) => sum + item.count, 0),
                },
                charts: { issuesByStatus, issuesByPriority, bugsByStatus, bugsByPriority, sprintStatus },
                recentActivity
            });
        }

        if (role === "Developer" || role === "Tester") {
            const userMatchValues = buildUserMatchValues(userObjectId, loggedInUserId);

            const taskMatch = {
                assigned: { $in: userMatchValues }
            };

            const bugMatch = {
                $or: [
                    { assignedId: { $in: userMatchValues } },
                    { reportedBy: { $in: userMatchValues } }
                ]
            };

            const [
                issuesByStatus,
                myTaskPriority,
                bugsByStatus,
                bugsByPriority,
                notifications
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
                Notification.find({ receiver: userObjectId })
                    .sort({ createdAt: -1 })
                    .limit(10)
            ]);

            return res.json({
                success: true,
                meta,
                summary: {
                    myTasks: issuesByStatus.reduce((sum, item) => sum + item.count, 0),
                    myBugs: bugsByStatus.reduce((sum, item) => sum + item.count, 0),
                },
                charts: { issuesByStatus, myTaskPriority, bugsByStatus, bugsByPriority },
                notifications
            });
        }

        return res.status(403).json({
            success: false,
            message: `Role ${role} does not have a dashboard configuration.`
        });
    } catch (error) {
        console.error("Dashboard Logic Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during dashboard generation.",
            error: error.message
        });
    }
};

module.exports = { getDashboardData };
