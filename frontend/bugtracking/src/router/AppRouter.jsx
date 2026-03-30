import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AdDash } from "../components/Admin/AdDash";
import { AdminSidebar } from "../components/Admin/AdminSidbar";
import { ForgotPassword } from "../components/Admin/ForgotPassword";
import { AssignProject } from "../components/projetcmanager/AssignProject";
import { ResetPassword } from "../components/Admin/ResetPassword";
import { SignUp } from "../components/Admin/SignUp";
import { EditUser } from "../components/Admin/users/EditUser";
import { ShowUser } from "../components/Admin/users/ShowUser";
import { UserDetail } from "../components/Admin/users/UserDetail";
import { DevelopNavbar } from "../components/developer/DevelopNavbar";
import { Login } from "../components/Login";
import { PmDashboard } from "../components/projetcmanager/PmDashboard";
import { PmNavbar } from "../components/projetcmanager/PmNavbar";
import { ProtectedRoutes } from "../components/ProtectedRoutes";
import { CreateBug } from "../components/Admin/CreateBug";
import { TestDashBoard } from "../components/Tester/TestDashBoard";
import { TesterNavbar } from "../components/Tester/TesterNavbar";
import { AddComment } from "../pages/bug/AddComment";
import { BugDetails } from "../pages/bug/BugDetails";
import { Bugs } from "../components/Admin/Bugs";
import { Editbug } from "../pages/bug/Editbug";
import { AddUser } from "../pages/project/AddUser";
import { CreateProject } from "../pages/project/CreateProject";
import { EditProject } from "../pages/project/EditProject";
import { ProjectDetails } from "../pages/project/ProjectDetails";
import { Projects } from "../pages/project/Projects";
import { AllComments } from "../pages/bug/AllComments";
import { Project } from "../components/developer/Project";
import { DevDashboard } from "../components/developer/DevDashboard";
import { Bug } from "../pages/bug/Bug";

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
            {path:'project/assign/:id',element:<AssignProject/>},
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
        path:'/developer', element:<ProtectedRoutes userRoles={["Developer"]}>
        <DevelopNavbar/>
        </ProtectedRoutes>,
        children:[
            {index: true,element:<Navigate to="dashboard" replace />},
            {path:'dashboard',element:<DevDashboard/>},
            {path:'project/:id',element:<Project/>},
            {path:'bugs/:id',element:<Bug/>},
            {path:'profile/:id',element:<EditUser/>}
        ]
    },
    {
        path:'/tester', element:<ProtectedRoutes userRoles={["Tester"]}>
            <TesterNavbar/>,
        </ProtectedRoutes>,
        children:[
            {index: true,element:<Navigate to="dashboard" replace />},
            {path:'dashboard',element:<TestDashBoard/>},
            {path:'createbug',element:<CreateBug/>},
            {path:'bug/:id',element:<Bug/>},
            {path:'bug/bugdetail/:id',element:<BugDetails/>},
            {path:'bug/comment/:id',element:<AddComment/>},
            {path:'bug/allcomment/:id',element:<AllComments/>},
            {path:'profile/:id',element:<EditUser/>},
            {path:'bug/editbug/:id',element:<Editbug/>}
        ]
    },
    {
        path:'/projectmanager', element:<ProtectedRoutes userRoles={['ProjectManager']}><PmNavbar/></ProtectedRoutes>,
        children:[
            {index: true,element:<Navigate to="dashboard" replace />},
            {path:'dashboard',element:<PmDashboard/>},
            {path:'bugs',element:<Bugs/>},
            {path:'bugs/bugdetail/:id',element:<BugDetails/>},
            {path:'bugs/editbug/:id',element:<Editbug/>},
            {path:'bugs/comment/:id',element:<AddComment/>},
            {path:'bugs/allcomment/:id',element:<AllComments/>},
            {path:'projects',element:<Projects/>},
            {path:'projects/details/:id',element:<ProjectDetails/>},
            {path:'projects/createproject',element:<CreateProject/>},
            {path:'projects/edit/:id',element:<EditProject/>},
            {path:'projects/assign/:id',element:<AssignProject/>},
            {path:'user',element:<ShowUser/>},
            {path:'user/adduser',element:<AddUser/>}

        ]
    }
    
])

const AppRouter = () => {
    return <RouterProvider router={router}></RouterProvider>
}

export default AppRouter