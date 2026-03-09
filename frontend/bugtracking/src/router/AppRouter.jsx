import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdDash } from "../components/Admin/AdDash";
import { AddUser } from "../pages/project/AddUser";
import { AdminSidebar } from "../components/Admin/AdminSidbar";
import { AssignProject } from "../components/Admin/project/AssignProject";
import { SignUp } from "../components/Admin/SignUp";
import { EditUser } from "../components/Admin/users/EditUser";
import { ShowUser } from "../components/Admin/users/ShowUser";
import { UserDetail } from "../components/Admin/users/UserDetail";
import { DevelopNavbar } from "../components/developer/DevelopNavbar";
import { Login } from "../components/Login";
import { CreateBug } from "../components/Tester/CreateBug";
import { TesterNavbar } from "../components/Tester/TesterNavbar";
import { BugDetails } from "../pages/bug/BugDetails";
import { Bugs } from "../pages/bug/Bugs";
import { CreateProject } from "../pages/project/CreateProject";
import { Editbug } from "../pages/bug/Editbug";
import { EditProject } from "../pages/project/EditProject";
import { ProjectDetails } from "../pages/project/ProjectDetails";
import { Projects } from "../pages/project/Projects";
import { PmNavbar } from "../components/projetcmanager/PmNavbar";

const router = createBrowserRouter([
    {path:'/' , element:<Login/>},
    {path:'/signup', element:<SignUp/>},
    {
        path:'/admin', element:<AdminSidebar/>,
        children: [
            {path:'',element:<AdDash/>},
            {path:'Bug',element:<Bugs/>},
            {path:'Bug/createbug',element:<CreateBug/>},
            {path:'Bug/editbug',element:<Editbug/>},
            {path:'Bug/bugdetail',element:<BugDetails/>},
            {path:'project',element:<Projects/>},
            {path:'project/assignproject',element:<AssignProject/>},
            {path:'project/createproject',element:<CreateProject/>},
            {path:'project/editproject',element:<EditProject/>},
            {path:'project/projectdetails',element:<ProjectDetails/>},
            {path:'user',element:<ShowUser/>},
            {path:'user/userdetails',element:<UserDetail/>},
            {path:'user/adduser',element:<AddUser/>},
            {path:'user/edituser',element:<EditUser/>},
            
        ]
    },
    {
        path:'/developer', element:<DevelopNavbar/>,
        children:[
            {path:'projects',element:<Projects/>},
            {path:'bugs',element:<Bugs/>}
        ]
    },
    {
        path:'/tester', element:<TesterNavbar/>,
        children:[
            {path:'createbug',element:<CreateBug/>},
            {path:'allbug',element:<Bugs/>},
            {path:'bugdetail',element:<BugDetails/>}
        ]
    },
    {
        path:'/projectmanager', element:<PmNavbar/>,
        children:[
            {path:'bugs',element:<Bugs/>},
            {path:'projects',element:<Projects/>},

        ]
    }
    
])

const AppRouter = () => {
    return <RouterProvider router={router}></RouterProvider>
}

export default AppRouter