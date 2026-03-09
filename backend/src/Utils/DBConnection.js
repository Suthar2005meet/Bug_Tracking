const mongoose = require('mongoose')
require("dotenv").config()

const dbConnection = () => {

    mongoose.connect(process.env.Mongo_Url).then(()=>{
        console.log('db connected')
    }).catch((err)=>{
        console.log('database not connected...',err)
    })
}

module.exports = dbConnection