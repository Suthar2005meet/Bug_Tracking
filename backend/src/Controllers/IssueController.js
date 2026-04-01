const IssueSchema = require('../Models/IssueModel')

const getData = async (req,resp) => {
    try{
        const res = await IssueSchema.find()
        resp.json({
            message : "Data Found SuccessFully",
            data : res
        })
    }catch(err){
        resp.status(500).json({
            message : "Server Error",
            err : err
        })
    }
}



module.exports = {
    getData
}