const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret = process.env.JWT_SECRET

const validateToken = (req,resp,next) => {
    try{
        const token = req.headers.authorization
        console.log(token)
        if(token){
            if(token.startsWith("Bearer ")){
                const tokenValue = token.split(" ")[1]
                const decodedData = jwt.verify(tokenValue,secret)
                console.log(decodedData)
                req.user = decodedData
                next()
            }else{
                resp.status(401).json({
                    message : "token is not bearer"
                })
            }
        }else{
            resp.status(401).json({
                message:"token has been not Present"
            })
        }
    }catch(err){
        console.log(err)
        resp.status(500).json({
            message : "token has not been validate"
        })
    }
}

module.exports = validateToken