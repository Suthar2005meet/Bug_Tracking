import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const ProfileUser = () => {
    const { id } = useParams();
    const token = localStorage.getItem("token"); // make sure token exists
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`/user/details/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("User data fetched:", res.data.data);
            setUserData(res.data.data);
        } catch (err) {
            console.log("Error fetching user data:", err);
            setError(err.message || 'Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            getUserData();
        }
    }, [id]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!userData) return <div className="p-4">No user data found</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">User Profile</h1>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Mobile:</strong> {userData.mobileno}</p>
                <p><strong>Role:</strong> {userData.role}</p>
            </div>
        </div>
    );
};
