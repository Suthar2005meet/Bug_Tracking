import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddUserPm = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamDetails, setTeamDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch All Available Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/usermanage/users");
      setUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load users list");
    }
  };

  // Fetch Current Team
  const fetchMyTeam = async () => {
    try {
      const res = await axios.get("/usermanage/my-team");
      if (res.data.team) {
        setSelectedUsers(res.data.team.users.map((u) => u._id));
        setTeamDetails(res.data.team.users);
      }
    } catch (err) {
      console.error("Team fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMyTeam();
  }, []);

  // Selection Logic
  const handleCheckbox = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // Update API Call
  const handleUpdate = async () => {
    try {
      await axios.post("/usermanage/save-team", {
        users: selectedUsers,
      });

      // Update the UI state with actual user objects
      const newTeam = users.filter((user) => selectedUsers.includes(user._id));
      setTeamDetails(newTeam);

      setShowModal(false);
      toast.success("Team updated successfully! 🚀");
    } catch (err) {
      toast.error("Could not save team changes.");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      {/* Search and Action Bar */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search team members..."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>

        <button
          className="w-full rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 md:w-auto shadow-lg shadow-blue-200"
          onClick={() => setShowModal(true)}
        >
          Manage Team
        </button>
      </div>

      {/* Main Team Display Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teamDetails.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-xl text-gray-400">No team members assigned.</p>
          </div>
        ) : (
          teamDetails.map((user) => (
            <div
              key={user._id}
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <img
                src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-gray-50 group-hover:ring-blue-50"
                alt={user.name}
              />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <span className="mt-2 inline-block rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {user.role}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
            onClick={() => setShowModal(false)}
          ></div>
          
          {/* Modal Card */}
          <div className="relative w-full max-w-2xl transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Add Team Members</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 hover:bg-gray-100 transition"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-gray-100">
              <table className="w-full border-collapse bg-white text-left text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-900">Select</th>
                    <th className="px-6 py-4 font-medium text-gray-900">User</th>
                    <th className="px-6 py-4 font-medium text-gray-900">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-blue-50/50 transition">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleCheckbox(user._id)}
                        />
                      </td>
                      <td className="flex items-center gap-3 px-6 py-4 font-normal text-gray-900">
                        <img
                          src={user?.image || `https://ui-avatars.com/api/?name=${user.name}`}
                          className="h-10 w-10 rounded-full object-cover"
                          alt=""
                        />
                        <div>
                          <div className="font-medium text-gray-700">{user.name}</div>
                          <div className="text-gray-400 text-xs">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                className="rounded-xl px-6 py-2.5 font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-green-600 px-8 py-2.5 font-semibold text-white shadow-lg shadow-green-100 hover:bg-green-700"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUserPm;