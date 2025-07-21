import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/ManageUsers.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from "./NavigationBar";

const API_URL = import.meta.env.VITE_API_URL;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/users/getAllUsers`);
        setUsers(res.data);
      } catch (err) {
        toast.error("Failed to fetch users");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/api/users/deleteUser/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // Change user role
  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`${API_URL}/api/users/changeUserRole/${id}`, { role: newRole });
      setUsers(users => users.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success("Role changed successfully");
    } catch (err) {
      toast.error("Failed to change role");
    }
  };

  // Filtered users
  const filteredUsers = users.filter(
    user =>
      (user.username || '').toLowerCase().includes(search.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <NavigationBar />
    <div className="manage-users-bg">
      <div className="manage-users-header">
        <h2 className="manage-users-title">User Management</h2>
        <p className="manage-users-desc">Manage all registered users</p>
      </div>
      <div className="manage-users-filters">
        <input
          className="manage-users-search-input"
          type="text"
          placeholder="Search users"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="manage-users-table-card">
        <div className="manage-users-table-header">
          <span className="manage-users-table-title">Users ({filteredUsers.length})</span>
        </div>
        <div className="manage-users-table-scroll">
          <table className="manage-users-table">
            <thead>
              <tr>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>JOINED</th>
                <th className="actions-header">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{textAlign:'center'}}>Loading users...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={4} style={{textAlign:'center'}}>No users found.</td></tr>
              ) : filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className="manage-users-role-select"
                      value={user.role}
                      onChange={e => handleRoleChange(user._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="actions-cell">
                    <div className="manage-users-actions">
                      <button className="manage-users-delete-btn" onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
    </>
  );
};

export default ManageUsers;