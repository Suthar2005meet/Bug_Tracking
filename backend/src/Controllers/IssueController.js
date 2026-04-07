    const IssueSchema = require("../Models/IssueModel");
    const uploadToCloudinary = require("../Utils/uploadToCloudinary");
    const mongoose = require("mongoose");

    const ActivityLogModel = require("../Models/ActivityLogModel");
    const NotificationModel = require("../Models/NotificationModel");

    // ================= HELPER FUNCTIONS =================

    // ✅ Activity Logger
    const logActivity = async ({ user, action, bug, project, task }) => {
    try {
        if (!user) {
        console.warn("Activity skipped: no user provided");
        return;
        }

        await ActivityLogModel.create({
        user,
        action,
        bug: bug || null,
        project: project || null,
        task: task || null,
        });
    } catch (err) {
        console.error("Activity Error:", err.message);
    }
    };

    // ✅ Notification Sender
    const sendNotification = async ({
    receivers = [],
    sender,
    type,
    bug,
    project,
    task,
    message,
    }) => {
    try {
        const filteredReceivers = Array.isArray(receivers)
        ? receivers.filter((id) => {
            if (!sender) return true;
            return id.toString() !== sender.toString();
            })
        : [];

        const notifications = filteredReceivers.map((receiver) => ({
            receiver,
            sender,
            type,
            bug: bug || null,
            project: project || null,
            task: task || null,
            message,
        }));

        if (notifications.length > 0) {
        await NotificationModel.insertMany(notifications);
        }
    } catch (err) {
        console.error("Notification Error:", err.message);
    }
    };

    // ================= CONTROLLERS =================

    // ✅ GET ALL
    const getData = async (req, resp) => {
    try {
        const res = await IssueSchema.find().populate([
        { path: "projectId" },
        { path: "reporterId" },
        { path: "assigned" },
        { path: "sprintId" },
        ]);

        resp.json({
        message: "Data Found SuccessFully",
        data: res,
        });
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err,
        });
    }
    };

    // ✅ CREATE ISSUE (BUG CREATED + NOTIFICATION)
    const addTask = async (req, resp) => {
    try {
        if (!req.file) {
        return resp.status(400).json({
            error: "file not upload",
        });
        }

        const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);

        const savedTask = await IssueSchema.create({
        ...req.body,
        document: cloudinaryResponse.secure_url,
        });

        const currentUserId = req.user?._id || req.body?.reporterId || req.body?.sender;

        // 🔥 Activity
        await logActivity({
        user: currentUserId,
        action: "TASK_CREATED",
        bug: savedTask._id,
        project: savedTask.projectId,
        task: savedTask._id,
        });

        // 🔥 Notification
        await sendNotification({
        receivers: savedTask.assigned || [],
        sender: currentUserId,
        type: "TASK_ASSIGNED",
        bug: savedTask._id,
        project: savedTask.projectId,
        task: savedTask._id,
        message: "New task assigned to you",
        });

        resp.status(201).json({
        message: "project create Successfully",
        data: savedTask,
        });
    } catch (err) {
        resp.status(500).json({ err });
    }
    };

    // ✅ GET BY SPRINT
    const sprintByTask = async (req, resp) => {
    const { id } = req.params;
    try {
        const res = await IssueSchema.find({ sprintId: id });

        resp.json({
        message: "Sprint data found",
        data: res,
        });
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err,
        });
    }
    };

    // ✅ GET BY ID
    const issueById = async (req, resp) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
        return resp.status(400).json({
            message: "Invalid Issue ID",
        });
        }

        const issue = await IssueSchema.findById(id).populate([
        { path: "projectId" },
        { path: "reporterId" },
        { path: "assigned" },
        { path: "sprintId" },
        ]);

        if (!issue) {
        return resp.status(404).json({
            message: "Issue Not Found",
        });
        }

        resp.status(200).json({
        message: "Issue Data Found",
        data: issue,
        });
    } catch (err) {
        console.log(err)
        resp.status(500).json({
        message: "Server Error",
        error: err.message,
        });
    }
    };

    // ✅ UPDATE ISSUE
    const updateIssue = async (req, resp) => {
    try {
        const res = await IssueSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        });

        // 🔥 Activity
        const currentUserId = req.user?._id || req.body?.updatedBy || req.body?.sender || res.reporterId;
        await logActivity({
        user: currentUserId,
        action: "TASK_UPDATED",
        bug: res._id,
        project: res.projectId,
        task: res._id,
        });

        resp.json({
        message: "Update Successfully",
        data: res,
        });
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err,
        });
    }
    };

    // ✅ GET BY USER
    const getDataByUser = async (req, resp) => {
    const { id } = req.params;

    try {
        const issues = await IssueSchema.find({
        assigned: id,
        issueType: "Task",
        status: ["Open", "In Progress", "In Testing", "Re-Open", "Closed"],
        }).populate([
        { path: "projectId" },
        { path: "reporterId" },
        { path: "assigned" },
        { path: "sprintId" },
        ]);

        resp.status(200).json({
        message: "Issues Found Successfully",
        data: issues,
        });
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        error: err.message,
        });
    }
    };

    // ✅ UPDATE STATUS
    const updateIssueStatus = async (req, resp) => {
    try {
        const { status } = req.body;

        const res = await IssueSchema.findById(req.params.id);

        if (res) {
        res.status = status;
        await res.save();

        const currentUserId = req.user?._id || req.body?.updatedBy || req.body?.sender || res.reporterId;

        // 🔥 Activity
        await logActivity({
            user: currentUserId,
            action: "TASK_STATUS_CHANGED",
            bug: res._id,
            project: res.projectId,
            task: res._id,
        });

        // 🔥 Notification (Reporter)
        await sendNotification({
            receivers: res.reporterId ? [res.reporterId] : [],
            sender: currentUserId,
            type: "TASK_STATUS_CHANGED",
            bug: res._id,
            project: res.projectId,
            task: res._id,
            message: `Task status changed to ${status}`,
        });

        resp.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: res,
        });
        } else {
        resp.status(404).json({
            message: "Task Not Find",
        });
        }
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err,
        });
    }
    };

    // ✅ ASSIGN USER
    const addUserToIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned } = req.body;

        const updatedIssue = await IssueSchema.findByIdAndUpdate(
        id,
        {
            $addToSet: { assigned: assigned },
        },
        { new: true }
        ).populate("assigned");

        const currentUserId = req.user?._id || req.body?.assignedBy || req.body?.sender || updatedIssue.reporterId;

        // 🔥 Activity
        await logActivity({
        user: currentUserId,
        action: "TASK_ASSIGNED",
        bug: updatedIssue._id,
        project: updatedIssue.projectId,
        task: updatedIssue._id,
        });

        // 🔥 Notification
        await sendNotification({
        receivers: [assigned],
        sender: currentUserId,
        type: "TASK_ASSIGNED",
        bug: updatedIssue._id,
        project: updatedIssue.projectId,
        task: updatedIssue._id,
        message: "You have been assigned a task",
        });

        res.json({
        message: "User Added Successfully",
        data: updatedIssue,
        });
    } catch (err) {
        res.status(500).json({
        message: "Server Error",
        error: err.message,
        });
    }
    };

    // ✅ TESTER DATA
    const getDataByTester = async (req, resp) => {
    const { id } = req.params;
    try {
        const res = await IssueSchema.find({
        assigend: id,
        status: ["In Testing", "Resolved", "Closed", "Re-Open"],
        });

        resp.json({
        message: "Tester All Data Find",
        data: res,
        });
    } catch (err) {
        resp.status(500).json({
        message: "Server Error",
        err: err,
        });
    }
    };

    module.exports = {
    getData,
    addTask,
    sprintByTask,
    issueById,
    updateIssue,
    getDataByUser,
    updateIssueStatus,
    addUserToIssue,
    getDataByTester,
    };