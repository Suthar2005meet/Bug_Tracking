    import { jwtDecode } from "jwt-decode";
    import { createContext, useEffect, useState } from "react";

    export const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);

    // 🔥 Run when app loads
    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
        try {
            const decoded = jwtDecode(storedToken);

            setToken(storedToken);
            setUserId(decoded._id); // ✅ FIXED
            setRole(decoded.role); // ✅ OK
        } catch (err) {
            console.log("Invalid Token");
            localStorage.removeItem("token");
        }
        }
    }, []);

    // 🔥 Login function
    const login = (newToken) => {
        localStorage.setItem("token", newToken);

        const decoded = jwtDecode(newToken);

        localStorage.setItem("userId", decoded._id); // ✅ FIXED
        localStorage.setItem("role", decoded.role);

        setToken(newToken);
        setUserId(decoded._id); // ✅ FIXED
        setRole(decoded.role);
    };

    // 🔥 Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        setToken(null);
        setUserId(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, userId, role, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
    };
