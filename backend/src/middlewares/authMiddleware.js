const jwt = require("jsonwebtoken")
require("dotenv").config()
const secret = process.env.JWT_SECRET

const validateToken = (req,resp,next) => {
    try{
        const token = req.headers.authorization
        if(token){
            if(token.startsWith("Bearer ")){
                const tokenValue = token.split(" ")[1]
                const decodedData = jwt.verify(tokenValue,secret)
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
        resp.status(401).json({
            message : "token has not been validated or expired"
        })
    }
}

module.exports = validateToken