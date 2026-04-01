    import axios from "axios";
    import React, { useEffect, useState } from "react";
    import { Link, useParams } from "react-router-dom";

    export const SprintProject = () => {
    const { id } = useParams();
    const [sprints, setSprints] = useState([]);
    const [search, setSearch] = useState("");

    const getData = async () => {
        try {
        const res = await axios.get(`/sprint/project/${id}`);
        const sprintData = Array.isArray(res.data.data)
            ? res.data.data
            : [res.data.data];

        setSprints(sprintData);
        } catch (err) {
        console.error("Error fetching sprints:", err);
        }
    };

    useEffect(() => {
        getData();
    }, [id]);

    const filteredSprints = sprints.filter((sprint) =>
        sprint.name?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Sprint List</h2>

            <Link
                to={`addsprint`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
                Add Sprint
            </Link>
            </div>

            {/* Search */}
            <input
            type="text"
            placeholder="Search Sprints..."
            className="w-full mb-6 px-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />

            {/* Sprint List */}
            {filteredSprints.length === 0 ? (
            <div className="text-center py-10 bg-white rounded shadow">
                No Sprints Found
            </div>
            ) : (
            <div className="grid gap-4">
                {filteredSprints.map((sprint) => (
                <div
                    key={sprint._id}
                    className="bg-white p-5 rounded-xl shadow border"
                >
                    <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-blue-600">
                        {sprint.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                        Project: {sprint.projectId?.title || "N/A"}
                        </p>
                    </div>

                    <span className="px-3 py-1 bg-gray-200 rounded text-sm">
                        {sprint.status}
                    </span>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                    <p className="text-sm">
                        Due Date: <b>{sprint.dueDate}</b>
                    </p>

                    {/* ✅ Add Task Button */}
                    <Link
                        to={`addtask`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Add Task
                    </Link>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    );
    };
