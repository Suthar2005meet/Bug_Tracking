const express = require('express')
const cors = require("cors");
require("dotenv").config()

const dbconnection = require('./src/Utils/DBConnection')
dbconnection()

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


const bugRoute = require('./src/Routes/BugRoute')
app.use('/bug',bugRoute)

const UserRoute = require('./src/Routes/UserRouter')
app.use('/user',UserRoute)

const ProjectRoute = require('./src/Routes/ProjectRoute')
app.use('/project',ProjectRoute)

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server Has been start at port ${PORT}`);
})