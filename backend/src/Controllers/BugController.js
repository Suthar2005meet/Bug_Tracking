const createBugSchema = require('../Models/BugModel')

const allbugs = async(req,resp) => {
    const bugs = await createBugSchema.find()
    resp.json({
        message : 'all bugs details',
        data : bugs
    })
}

const addBug = async(req,resp) => {
    const savedbug = await createBugSchema.create(req.body)
    resp.json({
        message : 'bug detail saved',
        data : savedbug
    })
}

module.exports = {
    addBug,allbugs
}