const UserSchema = require('../Models/UserModel')

const getAllUser = async (req,resp) => {
    const allUser = await UserSchema.find()
    resp.json({
        message : 'All User List',
        data : allUser
    })
}

const AddUser = async (req,resp) => {
    const savedUser = await UserSchema.create(req.body)
    resp.json({
        message : 'User Data Saved',
        data : savedUser
    })
}

module.exports = {
    getAllUser,AddUser
    
}