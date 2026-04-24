const ProjectSchema = require("../Models/ProjectModel");
const uploadToCloudinary = require("../Utils/uploadToCloudinary");
const mongoose = require("mongoose");

const ActivityLogModel = require("../Models/ActivityLogModel");
const NotificationModel = require("../Models/NotificationModel");

// ================= HELPERS =================

// ✅ Activity Logger
const logActivity = async ({ user, action, project }) => {
  try {
    await ActivityLogModel.create({
      user,
      action,
      project: project || null,
    });
  } catch (err) {
    console.log("Activity Error:", err.message);
  }
};

// ✅ Notification Sender
const sendNotification = async ({
  receivers = [],
  sender,
  type,
  project,
  message,
}) => {
  try {
    const notifications = receivers
      .filter((id) => id.toString() !== sender.toString()) // ❌ prevent self notify
      .map((receiver) => ({
        receiver,
        sender,
        type,
        project,
        message,
      }));

    if (notifications.length > 0) {
      await NotificationModel.insertMany(notifications);
    }
  } catch (err) {
    console.log("Notification Error:", err.message);
  }
};

// ================= CONTROLLERS =================

const getAllProject = async (req, resp) => {
  try {
    const allProject = await ProjectSchema.find()
      .populate("createdBy")
      .sort({ createdAt: -1 });

    resp.json({
      success: true,
      message: "All Project Details",
      data: allProject,
    });
  } catch (err) {
    resp.status(500).json({
      success: false,
      message: "Error while fetching the Details",
    });
  }
};

const createProject = async (req, resp) => {
  try {
    if (!req.file) {
      return resp.status(400).json({
        error: "file not upload",
      });
    }

    const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);

    const savedProject = await ProjectSchema.create({
      ...req.body,
      document: cloudinaryResponse.secure_url,
    });

    // 🔥 Activity
    await logActivity({
      user: req.body.createdBy,
      action: "PROJECT_CREATED",
      project: savedProject._id,
    });

    // 🔥 Notification (developers + testers)
    await sendNotification({
      receivers: [
        ...(savedProject.assignedDevelopers || []),
        ...(savedProject.assignedTester || []),
      ],
      sender: req.body._id,
      type: "PROJECT_ADDED",
      project: savedProject._id,
      message: "You have been added to a new project",
    });

    resp.status(201).json({
      success: true,
      message: "project create Successfully",
      data: savedProject,
    });
  } catch (err) {
    console.log(err)
    resp.status(500).json({
      err: err,
    });
  }
};

const getProjectById = async (req, resp) => {
  try {
    const res = await ProjectSchema.findById(req.params.id).populate([
      { path: "createdBy" }
    ]);

    resp.json({
      success: true,
      message: "Project Details Fetched",
      data: res,
    });
  } catch (err) {
    console.log(err)
    resp.status(500).json({
      success: false,
      message: "Error while fetched the details",
    });
  }
};

const updateById = async (req, resp) => {
  try {
    const res = await ProjectSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("createdBy members");

    // 🔥 Activity
    await logActivity({
      user: req.body._id || req.user?.id,
      action: "PROJECT_UPDATED",
      project: res._id,
    });

    resp.json({
      success: true,
      message: "Update Succesfully",
      data: res,
    });
  } catch (err) {
    console.log(err)
    resp.status(500).json({
      success: false,
      message: "error while fetching the data",
      err: err,
    });
  }
};

const getProjectByStatus = async (req, resp) => {
  try {
    const statusData = await ProjectSchema.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
        },
      },
    ]);

    resp.status(200).json({
      success: true,
      data: statusData,
    });
  } catch (err) {
    resp.status(500).json({
      message: "Data not Found",
      data: err.message,
    });
  }
};

const getProjectsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required in URL",
      });
    }

    const projects = await ProjectSchema.find({
      createdBy: id,
    })

    res.status(200).json({
      success: true,
      totalProjects: projects.length,
      data: projects,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const startTesting = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID",
      });
    }

    const project = await ProjectSchema.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project Not Found",
      });
    }

    if (project.inTesting === true) {
      return res.status(400).json({
        success: false,
        message: "Project is already in Testing",
      });
    }

    // ✅ FIXED: only boolean
    project.inTesting = true;

    await project.save();

    // 🔥 Activity
    await logActivity({
      user: req.body._id,
      action: "PROJECT_UPDATED",
      project: project._id,
    });

    // 🔥 Notify testers
    await sendNotification({
      receivers: project.assigend || [],
      sender: req.body._id,
      type: "PROJECT_ADDED",
      project: project._id,
      message: "Project moved to testing phase",
    });

    return res.status(200).json({
      success: true,
      message: "Project moved to Testing successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getProjectByTester = async (req, resp) => {
  const { id } = req.params;
  try {
    const res = await ProjectSchema.find({
      assignedTester: id,
      inTesting: true,
    }).populate([
      { path: "createdBy" },
      { path: "members" },
    ]);

    resp.json({
      success: true,
      message: "Tester Project Find Successfully",
      data: res,
    });
  } catch (err) {
    resp.status(500).json({
      message: "Error while Fetching the testerassign project",
      err: err,
    });
  }
};

module.exports = {
  getAllProject,
  createProject,
  getProjectById,
  updateById,
  getProjectByStatus,
  getProjectsByUser,
  startTesting,
  getProjectByTester,
};