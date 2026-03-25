const UserSchema = require('../Models/UserModel')
const bcrypt = require('bcrypt')
const mailSend = require('../Utils/MailUtils')
const jwt = require("jsonwebtoken")
require('dotenv').config()
const secret = process.env.JWT_SECRET

const getAllUser = async (req,resp) => {
    const allUser = await UserSchema.find()
    resp.json({
        message : 'All User List',
        data : allUser
    })
}

const AddUser = async (req,resp) => {
    try{
        const existingUser = await UserSchema.findOne({ email: req.body.email })

        if (existingUser) {
            return resp.status(400).json({
                message: "Email already registered"
            })
        }else{

            const hashedPassword = await bcrypt.hash(req.body.password,10)
            const savedUser = await UserSchema.create({...req.body,password:hashedPassword})
            await mailSend(savedUser.email,"wellcome to our app","welcome.html")
            resp.status(201).json({
            message : 'User Data Saved',
            data : savedUser
            })
        }
    }catch(err){
        console.log(err)
        resp.status(500).json({
            message : "User Data not Saved",
            err:err
        })
    }
}

const loginUser = async(req,resp) => {

    try{
        const {email,password} = req.body
        const foundUserFromEmail = await UserSchema.findOne({email:email})
        console.log(foundUserFromEmail);
        if(foundUserFromEmail){
            const isPasswordMatched = await bcrypt.compare(password,foundUserFromEmail.password)
            if(isPasswordMatched){
                const token = jwt.sign(foundUserFromEmail.toObject(),secret)
                //const token = jwt.sign({id:foundUserFromEmail._id},secret)
                resp.status(201).json({
                message : "Login Successfully",
                token:token,
                // data : foundUserFromEmail,
                role : foundUserFromEmail.role
            })
            }else{
                resp.status(401).json({
                message : "Invelid Password"
                })
            }
        }else{
            resp.json({
                message : "User Not Found"
            })
        }
    }catch(err){
        resp.status(500).json({
            message : "Errro while login",
            err:err
        })
    }
}

const testerUser = async (req,resp) =>{
    try{
        const res = await UserSchema.find({role:"Tester"})
        resp.json({
            message : "Tester User detsils found",
            data : res
        })
    }catch(err){
        console.log(err);
        resp.status(500).json({
            message : "Details Not Fetched"
        })
    }
}

const developerUser = async(req,resp) => {
    try{
        const res = await UserSchema.find({role:"Developer"})
        resp.json({
            message : "Developer Details Fetched",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "Developer Detail not been exixted"
        })
    }
}

const getUserById = async(req,resp) => {
    try{
        const res = await UserSchema.findById(req.params.id)
        resp.json({
            message : "User Details Found",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "User Id Not Found",
            err : err
        })
    }
}

const updateUser = async(req,resp) => {
    try{
        const cloudinaryResponse = await uploadToCloudinary(req.file.buffer)
        console.log(req.file.path);
        console.log('Response.....', cloudinaryResponse)
        const res = await UserSchema.findByIdAndUpdate({...req.body,image: cloudinaryResponse.secure_url})
        resp.json({
            message : "Update data Successfully",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "User not update",
            err : err
        })
    }
}

const forgotPassword = async(req,resp) => {

    const {email} = req.body
    if(!email){
        return resp.status(400).json({
            message : "email is not provided"
        })
    }

    const foundUserFromEmail = await UserSchema.findOne({email:email})
    if(foundUserFromEmail){
        const token = jwt.sign(foundUserFromEmail.toObject(),secret,{expiresIn:60*10})
        await mailSend(foundUserFromEmail.email,"Reset Password Link","forgetPassword.html",token)
        resp.status(201).json({
            message : "Mail Send Successfull",
            token : token
        })
    }else{
        resp.status(404).json({
            message : "User Not Found"
        })
    }
}

const resetPassword = async(req,resp) => {
    const {newPassword, token} = req.body
    try{
        const decodedUser = jwt.verify(token,secret)
        const hashedPassword = await bcrypt.hash(newPassword,10)
        await UserSchema.findByIdAndUpdate(decodedUser._id,{password:hashedPassword})
        resp.status(200).json({
            message : "Password Reset Successfully"
        })

    }catch(err){
        console.log(err)
        resp.status(500).json({
            message : "Password not sucessfully"
        })
    }
}

const getUserByRole = async(req,resp) => {
    try{
        const roleData = await UserSchema.aggregate([
        {
            $group : {
                _id : "$role",
                total : { $sum : 1}
            }
        }
        ])
        resp.status(200).json({
            success : true,
            data : roleData
        })
    }catch(err){
        console.log(err)
        resp.status(500).json({
            message : "Data not Found",
            data : err.message
        })
    }
}

module.exports = {
    getAllUser,
    AddUser,
    loginUser,
    testerUser,
    developerUser,
    getUserById,
    updateUser,
    forgotPassword,
    resetPassword,
    getUserByRole
}