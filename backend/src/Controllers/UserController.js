const UserSchema = require('../Models/UserModel')
const ActivityLogModel = require('../Models/ActivityLogModel')
const NotificationModel = require('../Models/NotificationModel')

const bcrypt = require('bcrypt')
const mailSend = require('../Utils/MailUtils')
const jwt = require("jsonwebtoken")
const uploadToCloudinary = require('../Utils/uploadToCloudinary')

require('dotenv').config()
const secret = process.env.JWT_SECRET



// ======================== GET ALL USERS ========================
const getAllUser = async (req, resp) => {
    try {
        const allUser = await UserSchema.find()

        resp.json({
            message: 'All User List',
            data: allUser
        })
    } catch (err) {
        resp.status(500).json({
            message: "Server Error",
            err: err
        })
    }
}



// ======================== ADD USER ========================
const AddUser = async (req, resp) => {
    try {
        const existingUser = await UserSchema.findOne({ email: req.body.email })

        if (existingUser) {
            return resp.status(400).json({
                message: "Email already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const savedUser = await UserSchema.create({
            ...req.body,
            password: hashedPassword
        })

        await mailSend(savedUser.email, "Welcome to our app", "welcome.html")

        // ✅ Activity Log
        await ActivityLogModel.create({
            user: savedUser._id,
            action: "USER_CREATED"
        })

        // ✅ Notification
        await NotificationModel.create({
            receiver: savedUser._id,
            sender: savedUser._id,
            type: "USER_ADDED",
            message: `Welcome ${savedUser.email}! Your account created successfully.`
        })

        resp.status(201).json({
            message: 'User Data Saved',
            data: savedUser
        })

    } catch (err) {
        console.log(err)
        resp.status(500).json({
            message: "User Data not Saved",
            err: err
        })
    }
}



// ======================== LOGIN USER ========================
const loginUser = async (req, resp) => {
    try {
        const { email, password } = req.body

        const foundUserFromEmail = await UserSchema.findOne({ email })

        if (!foundUserFromEmail) {
            return resp.status(404).json({
                message: "User Not Found"
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, foundUserFromEmail.password)

        if (!isPasswordMatched) {
            return resp.status(401).json({
                message: "Invalid Password"
            })
        }

        // 🔐 Secure JWT
        const token = jwt.sign(
            { id: foundUserFromEmail._id, role: foundUserFromEmail.role },
            secret,
            { expiresIn: "1d" }
        )

        // ✅ Activity
        await ActivityLogModel.create({
            user: foundUserFromEmail._id,
            action: "LOGIN"
        })

        // ✅ Notification
        await NotificationModel.create({
            receiver: foundUserFromEmail._id,
            sender: foundUserFromEmail._id,
            type: "LOGIN",
            message: `You logged in successfully`
        })

        resp.status(200).json({
            message: "Login Successfully",
            token: token,
            role: foundUserFromEmail.role
        })

    } catch (err) {
        resp.status(500).json({
            message: "Error while login",
            err: err
        })
    }
}



// ======================== GET USERS BY ROLE ========================
const testerUser = async (req, resp) => {
    try {
        const res = await UserSchema.find({ role: "Tester" })

        resp.json({
            message: "Tester User details found",
            data: res
        })
    } catch (err) {
        resp.status(500).json({
            message: "Details Not Fetched"
        })
    }
}

const developerUser = async (req, resp) => {
    try {
        const res = await UserSchema.find({ role: "Developer" })

        resp.json({
            message: "Developer Details Fetched",
            data: res
        })
    } catch (err) {
        resp.status(500).json({
            message: "Developer details not found"
        })
    }
}

const projectmanagerUser = async (req, resp) => {
    try {
        const res = await UserSchema.find({ role: "ProjectManager" })

        resp.json({
            message: "ProjectManager details found",
            data: res
        })
    } catch (err) {
        resp.status(500).json({
            message: "Server Error",
            err: err
        })
    }
}



// ======================== GET USER BY ID ========================
const getUserById = async (req, resp) => {
    try {
        const res = await UserSchema.findById(req.params.id)

        resp.json({
            message: "User Details Found",
            data: res
        })
    } catch (err) {
        resp.status(500).json({
            message: "User Id Not Found",
            err: err
        })
    }
}



// ======================== UPDATE USER ========================
const updateUser = async (req, resp) => {
    try {
        const updateData = { ...req.body }

        if (req.file && req.file.buffer) {
            const cloudinaryResponse = await uploadToCloudinary(req.file.buffer)
            updateData.image = cloudinaryResponse.secure_url
        }

        const res = await UserSchema.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )

        if (!res) {
            return resp.status(404).json({
                message: 'User not found'
            })
        }

        // ✅ Activity
        await ActivityLogModel.create({
            user: res._id,
            action: "USER_UPDATED"
        })

        // ✅ Notification
        await NotificationModel.create({
            receiver: res._id,
            sender: res._id,
            type: "USER_UPDATED",
            message: `Your profile has been updated`
        })

        resp.json({
            message: "User updated successfully",
            data: res
        })

    } catch (err) {
        resp.status(500).json({
            message: "User not updated",
            err: err
        })
    }
}



// ======================== FORGOT PASSWORD ========================
const forgotPassword = async (req, resp) => {
    const { email } = req.body

    if (!email) {
        return resp.status(400).json({
            message: "Email is not provided"
        })
    }

    const foundUserFromEmail = await UserSchema.findOne({ email })

    if (!foundUserFromEmail) {
        return resp.status(404).json({
            message: "User Not Found"
        })
    }

    const token = jwt.sign(
        { id: foundUserFromEmail._id },
        secret,
        { expiresIn: "10m" }
    )

    await mailSend(foundUserFromEmail.email, "Reset Password Link", "forgetPassword.html", token)

    resp.status(200).json({
        message: "Mail sent successfully"
    })
}



// ======================== RESET PASSWORD ========================
const resetPassword = async (req, resp) => {
    const { newPassword, token } = req.body

    try {
        const decodedUser = jwt.verify(token, secret)

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await UserSchema.findByIdAndUpdate(decodedUser.id, {
            password: hashedPassword
        })

        // ✅ Activity
        await ActivityLogModel.create({
            user: decodedUser.id,
            action: "USER_PASSWORD_CHANGED"
        })

        // ✅ Notification
        await NotificationModel.create({
            receiver: decodedUser.id,
            sender: decodedUser.id,
            type: "USER_PASSWORD_CHANGED",
            message: `Your password has been changed`
        })

        resp.status(200).json({
            message: "Password Reset Successfully"
        })

    } catch (err) {
        console.log(err)
        resp.status(500).json({
            message: "Password reset failed"
        })
    }
}



// ======================== GET USER COUNT BY ROLE ========================
const getUserByRole = async (req, resp) => {
    try {
        const roleData = await UserSchema.aggregate([
            {
                $group: {
                    _id: "$role",
                    total: { $sum: 1 }
                }
            }
        ])

        resp.status(200).json({
            success: true,
            data: roleData
        })

    } catch (err) {
        resp.status(500).json({
            message: "Data not Found",
            data: err.message
        })
    }
}



module.exports = {
    getAllUser,
    AddUser,
    loginUser,
    testerUser,
    developerUser,
    projectmanagerUser,
    getUserById,
    updateUser,
    forgotPassword,
    resetPassword,
    getUserByRole
}