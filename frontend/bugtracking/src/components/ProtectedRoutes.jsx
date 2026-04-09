import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { hasRole } from '../utils/roles'

export const ProtectedRoutes = ({children,userRoles}) => {

    const [token, settoken] = useState()
    const [role, setrole] = useState()
    const [loading, setloading] = useState(true)

    useEffect(()=>{
        settoken(localStorage.getItem("token"))
        setrole(localStorage.getItem("role"))
        setloading(false)
    },[])

    if(loading){
        return <h1>Loading....</h1>
    }

    if(!token){
        return <Navigate to="/" />
    }

    if(!userRoles.some((allowedRole) => hasRole(role, allowedRole))){
        return <Navigate to="/" />
    }
    return children
}
