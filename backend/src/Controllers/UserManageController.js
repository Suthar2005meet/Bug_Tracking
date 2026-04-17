const UserManage = require("../Models/UsermanageModel");
const User = require("../Models/UserModel");

// ==============================
// GET PM TEAM
// ==============================
const getMyTeam = async (req, res) => {
  try {
    const pmId = req.user.id;

    const team = await UserManage.findOne({ managedBy: pmId })
      .populate("users", "name email role image");

    res.status(200).json({
      success: true,
      team
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};


// ==============================
// GET DEV + TESTER USERS ONLY
// ==============================
const getDevTesterUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["Developer", "Tester"] }
    }).select("name email role image");

    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getTesterUsers = async (req, res) => {
  try {
    // const pmId = req.user.id;

    // 1️⃣ Find PM team
    const team = await UserManage.findOne()
      .populate({
        path: "users",
        match: { role: "Tester" }, // 🔥 Only Testers
        select: "name email role"
      });

    if (!team) {
      return res.status(200).json({
        success: true,
        users: []
      });
    }

    res.status(200).json({
  success: true,
  team: {
    users: team.users
  }
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPmAndDevelopers = async (req, res) => {
  try {
    const pmId = req.user.id;

    const team = await UserManage.findOneAndUpdate(
  { managedBy: pmId },
  { $setOnInsert: { managedBy: pmId, users: [] } },
  { new: true, upsert: true }
);

    if (!team) {
      return res.status(404).json({
        message: "Team not found"
      });
    }

    res.status(200).json({
      message: "PM and Developer Details",
      data: {
        projectManager: team.managedBy,
        developers: team.users
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



const getPmAndDevelopersForTester = async (req, res) => {
  try {
    const testerId = req.params.id; // from token

    // Step 1: Find team where this tester exists
    const team = await UserManage.findOne({
      users: testerId
    })
      .populate("managedBy", "name email role") // Project Manager
      .populate({
        path: "users",
        match: { role: { $regex: "^Developer$", $options: "i" } },
        select: "name email role"
      });

    if (!team) {
      return res.status(404).json({
        message: "Team not found for this tester"
      });
    }

    res.status(200).json({
      message: "Project Manager and Developers Details",
      data: {
        projectManager: team.managedBy,
        developers: team.users || []
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// ==============================
// ADD OR UPDATE TEAM
// ==============================
const addOrUpdateTeam = async (req, res) => {
  try {
    const pmId = req.user.id;
    const { users } = req.body;

    let team = await UserManage.findOne({ managedBy: pmId });

    if (!team) {
      // Create team
      team = await UserManage.create({
        managedBy: pmId,
        users
      });
    } else {
      team.users = users;
      await team.save();
    }

    // Populate the newly added/updated team members
    await team.populate("users", "name email role image");

    res.status(200).json({
      success: true,
      message: "Team Saved Successfully",
      team
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
    getMyTeam,
    getDevTesterUsers,
    addOrUpdateTeam,
    getTesterUsers,
    getPmAndDevelopers,
    getPmAndDevelopersForTester
}