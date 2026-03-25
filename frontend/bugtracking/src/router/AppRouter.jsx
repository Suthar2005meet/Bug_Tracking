import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
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
import { TestDashBoard } from "../components/Tester/TestDashBoard";
import { ForgotPassword } from "../components/Admin/ForgotPassword";
import { ResetPassword } from "../components/Admin/ResetPassword";
import { PmDashboard } from "../components/projetcmanager/PmDashboard";

const router = createBrowserRouter([
    {path:'/' , element:<Login/>},
    {path:'/signup', element:<SignUp/>},
    {path:"/forgetpassword",element:<ForgotPassword/>},
    {path:"/resetpassword/:token",element:<ResetPassword/>},
    {
        path:'/admin', element:<AdminSidebar/>,
        children: [
            {index: true,element:<Navigate to="dashboard" replace />},
            {path:'dashboard',element:<AdDash/>},
            {path:'bug',element:<Bugs/>},
            {path:'bug/createbug',element:<CreateBug/>},
            {path:'bug/editbug/:id',element:<Editbug/>},
            {path:'bug/bugdetail/:id',element:<BugDetails/>},
            {path:'project',element:<Projects/>},
            {path:'project/assignproject',element:<AssignProject/>},
            {path:'project/createproject',element:<CreateProject/>},
            {path:'project/edit/:id',element:<EditProject/>},
            {path:'project/details/:id',element:<ProjectDetails/>},
            {path:'user',element:<ShowUser/>},
            {path:'user/userdetail/:id',element:<UserDetail/>},
            {path:'user/adduser',element:<AddUser/>},
            {path:'user/edituser/:id',element:<EditUser/>},
            
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
            {index: true,element:<Navigate to="dashboard" replace />},
            {path:'dashboard',element:<TestDashBoard/>},
            {path:'createbug',element:<CreateBug/>},
            {path:'bug',element:<Bugs/>},
            {path:'bug/bugdetail/:id',element:<BugDetails/>},
            {path:'tester/profile/:id',element:<UserDetail/>},
            {path:'bug/editbug/:id',element:<Editbug/>}
        ]
    },
    {
        path:'/projectmanager', element:<PmNavbar/>,
        children:[
            {index: true,element:<Navigate to="dashboard" replace />},
            {path:'dashboard',element:<PmDashboard/>},
            {path:'bugs',element:<Bugs/>},
            {path:'projects',element:<Projects/>},
            {path:'user',element:<ShowUser/>}

        ]
    }
    
])

const AppRouter = () => {
    return <RouterProvider router={router}></RouterProvider>
}

export default AppRouter