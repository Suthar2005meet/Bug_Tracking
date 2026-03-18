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

module.exports = {
    getAllUser,
    AddUser,
    loginUser,
    testerUser
}