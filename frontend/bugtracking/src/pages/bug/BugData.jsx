    import axios from "axios";
    import React, { useEffect, useState } from "react";
    import { useParams } from "react-router-dom";

    export const BugData = () => {
    const { id } = useParams(); // Gets the ID from the URL (bug/bug/:id)
    const [bug, setBug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBugDetails = async () => {
        try {
            const res = await axios.get(`/bug/bug/${id}`);
            // Based on your JSON, data is inside res.data.data
            setBug(res.data.data);
        } catch (err) {
            console.error("Error fetching bug details:", err);
            setError("Could not load bug details.");
        } finally {
            setLoading(false);
        }
        };

        if (id) fetchBugDetails();
    }, [id]);

    if (loading) return <div style={{ padding: "20px" }}>Loading Details...</div>;
    if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
    if (!bug) return <div style={{ padding: "20px" }}>No bug found.</div>;

    return (
        <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
        <h1>Bug Detail View</h1>
        <hr />

        <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
            {/* Bug Image */}
            {bug.image && (
            <div style={{ flex: "1", minWidth: "300px" }}>
                <img 
                src={bug.image} 
                alt={bug.title} 
                style={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }} 
                />
            </div>
            )}

            {/* Bug Info */}
            <div style={{ flex: "2", minWidth: "300px" }}>
            <h2 style={{ color: "#2c3e50" }}>{bug.title}</h2>
            <p><strong>Status:</strong> <span style={{ color: bug.status === "Open" ? "red" : "green" }}>{bug.status}</span></p>
            <p><strong>Priority:</strong> {bug.priority}</p>
            <p><strong>Type:</strong> {bug.type}</p>
            <p><strong>Due Date:</strong> {new Date(bug.dueDate).toLocaleDateString()}</p>
            
            <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px", marginTop: "10px" }}>
                <h4>Description</h4>
                <p>{bug.description}</p>
            </div>

            <div style={{ background: "#f0f7ff", padding: "15px", borderRadius: "8px", marginTop: "10px" }}>
                <h4>Expected Result</h4>
                <p>{bug.expectedResult}</p>
            </div>
            </div>
        </div>

        {/* Project Section */}
        {bug.projectId && (
            <div style={{ marginTop: "40px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3 style={{ marginTop: 0 }}>Project Information</h3>
            <p><strong>Project Name:</strong> {bug.projectId.title}</p>
            <p><strong>Project Description:</strong> {bug.projectId.description}</p>
            <p><strong>Project Timeline:</strong> {new Date(bug.projectId.startDate).toLocaleDateString()} to {new Date(bug.projectId.dueDate).toLocaleDateString()}</p>
            
            {/* List Assigned Developers from the nested project data */}
            {bug.projectId.assignedDevelopers?.length > 0 && (
                <div>
                <strong>Assigned Developers:</strong>
                <ul>
                    {bug.projectId.assignedDevelopers.map((dev) => (
                    <li key={dev._id}>{dev.name} ({dev.email})</li>
                    ))}
                </ul>
                </div>
            )}
            </div>
        )}
        </div>
    );
    };