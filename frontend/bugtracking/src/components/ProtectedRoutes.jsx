import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectedRoutes = ({children,userRoles}) => {

    const [token, settoken] = useState()
    const [role, setrole] = useState()
    const [userId, setuserid] = useState()
    const [loading, setloading] = useState(true)

    useEffect(()=>{
        settoken(localStorage.getItem("token"))
        setrole(localStorage.getItem("role"))
        setuserid(localStorage.getItem("userId"))
        setloading(false)
    },[])

    if(loading){
        return <h1>Loading....</h1>
    }

    if(!token){
        return <Navigate to="/" />
    }

    if(!userRoles.includes(role)){
        return <Navigate to="/" />
    }
    return children
}
