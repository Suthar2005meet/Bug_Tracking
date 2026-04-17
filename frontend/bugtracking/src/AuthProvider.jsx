    import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { getCanonicalRole } from "./utils/roles";

    export const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [name, setname] = useState(null)

    // 🔥 Run when app loads
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        console.log('📱 App load - storedToken:', storedToken ? 'present' : 'MISSING');
        console.log('📱 localStorage userId on load:', localStorage.getItem('userId'));

        if (storedToken) {
        try {
            const decoded = jwtDecode(storedToken);
            console.log('📦 Load decoded:', decoded);
            
            const userId = decoded._id || decoded.id || decoded.sub || decoded.userId;
            const role = getCanonicalRole(decoded.role);
            setToken(storedToken);
            setUserId(userId);
            setRole(role);
            setname(decoded.name);
            console.log('✅ Loaded userId to state:', userId);
        } catch (err) {
            console.error('❌ Load - Invalid Token:', err);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
        }
        }
    }, []);

    // 🔥 Login function
    const login = (newToken) => {
        console.log('🔑 Login called with token:', newToken ? 'present' : 'MISSING');
        
        if (!newToken) {
            console.error('❌ No token provided to login()');
            return;
        }
        
        localStorage.setItem("token", newToken);
        
        try {
            const decoded = jwtDecode(newToken);
            console.log('📦 Decoded JWT payload:', decoded);
            
            const userId = decoded._id || decoded.id || decoded.sub || decoded.userId;
            const role = getCanonicalRole(decoded.role);
            console.log('🆔 Extracted userId:', userId);
            
            if (!userId) {
                console.error('❌ No userId found in token! Payload keys:', Object.keys(decoded));
                return;
            }
            
            localStorage.setItem("userId", userId);
            localStorage.setItem("role", role);
            localStorage.setItem("name", decoded.name);
            console.log('💾 Saved to localStorage:', { userId, role });
            console.log('🔍 Verify localStorage userId:', localStorage.getItem('userId'));
            
            setToken(newToken);
            setUserId(userId);
            setRole(role);
            setname(decoded.name);
        } catch (err) {
            console.error('❌ JWT decode failed:', err);
            localStorage.removeItem('token');
        }
    };

    // 🔥 Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        setToken(null);
        setUserId(null);
        setRole(null);
        setname(null);
    };

    return (
        <AuthContext.Provider value={{ token, userId, role, login, logout, name }}>
        {children}
        </AuthContext.Provider>
    );
    };
