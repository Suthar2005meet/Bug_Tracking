const ProjectSchema = require("../Models/ProjectModel");
const uploadToCloudinary = require("../Utils/uploadToCloudinary");
const mongoose = require('mongoose');

const getAllProject = async (req, resp) => {
  const allProject = await ProjectSchema.find();
  try {
    resp.json({
      message: "All Project Details",
      data: allProject,
    });
  } catch (err) {
    resp.status(500).json({
      message: "Error while fetching the Details",
    });
  }
};

const createProject = async (req, resp) => {
  try {
    console.log("BODY", req.body);
    console.log("FILE", req.file);
    if (!req.file) {
      return resp.status(400).json({
        error: "file not upload",
      });
    }
    const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);
    console.log(req.file.buffer);
    console.log("response.....", cloudinaryResponse);
    const savedProject = await ProjectSchema.create({
      ...req.body,
      document: cloudinaryResponse.secure_url,
    });
    resp.status(201).json({
      message: "project create Successfully",
      data: savedProject,
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      err: err,
    });
  }
};

const getProjectById = async (req, resp) => {
  const res = await ProjectSchema.findById(req.params.id).populate([
    { path: "assignedDevelopers" },
    { path: "assignedTester" },
    { path: "createdBy" },
  ]);
  try {
    resp.json({
      message: "Project Details Fetched",
      data: res,
    });
  } catch (err) {
    resp.status(500).json({
      message: "Error while fetched the details",
    });
  }
};

const updateById = async (req, resp) => {
  try {
    const res = await ProjectSchema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    resp.json({
      message: "Update Succesfully",
      data: res,
    });
  } catch (err) {
    resp.status(500).json({
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
    console.log(err);
    resp.status(500).json({
      message: "Data not Found",
      data: err.message,
    });
  }
};

const getProjectsByUser = async (req, res) => {
  try {
    // ✅ 1. Get userId from URL params
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required in URL",
      });
    }

    // ✅ 2. Find projects where assignedMembers array contains userId
    const projects = await ProjectSchema.find({
      assignedDevelopers: id,
    })
      .populate("assignedDevelopers", "name email")
      .populate("assignedTester", "name email");

    // ✅ 3. Send response
    res.status(200).json({
      success: true,
      totalProjects: projects.length,
      data: projects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const startTesting = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID"
      });
    }

    // ✅ Find project
    const project = await ProjectSchema.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project Not Found"
      });
    }

    // ✅ If already in testing
    if (project.inTesting === true) {
      return res.status(400).json({
        success: false,
        message: "Project is already in Testing"
      });
    }

    // ✅ Update only if false
    project.inTesting = true;
    project.inTesting = "true";

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project moved to Testing successfully",
      data: project
    });

  } catch (error) {
    console.log("Start Testing Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

const getProjectByTester = async (req,resp) => {
  const {id} = req.params
  try{
    const res = await ProjectSchema.find({assignedTester: id ,inTesting : "true"}).populate([
      {path: "createdBy" },
      {path : "assignedDevelopers"},
      {path : "assignedTester"}
    ])
    resp.json({
      message : "Tester Project Find Successfully",
      data : res
    })
  }catch(err){
    console.log(err)
    resp.status(500).json({
      message : "Error while Fetching the testerassign project",
      err : err
    })
  }
}

module.exports = {
  getAllProject,
  createProject,
  getProjectById,
  updateById,
  getProjectByStatus,
  getProjectsByUser,
  startTesting,
  getProjectByTester
};
