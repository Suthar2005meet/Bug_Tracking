import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectedRoutes = ({children,userRoles}) => {

    const [token, settoken] = useState()
    const [role, setrole] = useState()
    const [loading, setloading] = useState(true)

    useEffect(()=>{
        settoken(localStorage.getItem("token"))
        setrole(localStorage.getItem("role"))
        setloading(false)
    },[])

    const normalizedRole = role?.toLowerCase().replace(/\s+/g, "")
    const normalizedAllowedRoles = userRoles.map((allowedRole) =>
        allowedRole.toLowerCase().replace(/\s+/g, "")
    )

    if(loading){
        return <h1>Loading....</h1>
    }

    if(!token){
        return <Navigate to="/" />
    }

    if(!normalizedAllowedRoles.includes(normalizedRole)){
        return <Navigate to="/" />
    }
    return children
}
