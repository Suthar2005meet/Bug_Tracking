const UserSchema = require('../Models/UserModel')
const bcrypt = require('bcrypt')

const getAllUser = async (req,resp) => {
    const allUser = await UserSchema.find()
    resp.json({
        message : 'All User List',
        data : allUser
    })
}

const AddUser = async (req,resp) => {

    const hashedPassword = await bcrypt.hash
    const savedUser = await UserSchema.create(req.body)
    try{
        resp.status(201).json({
            message : 'User Data Saved',
            data : savedUser
        })
    }catch(err){
        err.err
    }
}

module.exports = {
    getAllUser,AddUser
    
}