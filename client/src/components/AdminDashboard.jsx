import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import '../css/Dashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "admin") {
            navigate("/login");
        }
    }, []);

    return (
        <>
        <NavigationBar />
        <div className="dashboard-bg">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Admin Dashboard</h2>
            </div>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">Attempt Problems</h5>
                    <p className="dashboard-card-text">Try and solve coding challenges.</p>
                    <button className="dashboard-btn dashboard-btn-success" onClick={() => navigate('/AdminDashboard/ProblemList')}>Start Solving</button>
                </div>
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">My Submissions</h5>
                    <p className="dashboard-card-text">Check your submission history.</p>
                    <button className="dashboard-btn dashboard-btn-primary" onClick={() => navigate('/AdminDashboard/MySubmissions')}>View Submissions</button>
                </div>
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">Leaderboard</h5>
                    <p className="dashboard-card-text">Track top users and scores.</p>
                    <button className="dashboard-btn dashboard-btn-warning" onClick={() => navigate('/AdminDashboard/Leaderboard')}>View Leaderboard</button>
                </div>
                {/* Compiler Feature Card */}
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">Compiler</h5>
                    <p className="dashboard-card-text">Run code with your own inputs.</p>
                    <button className="dashboard-btn dashboard-btn-accent" onClick={() => navigate('/AdminDashboard/Compiler')}>Open Compiler</button>
                </div>
                <div className="dashboard-row-break" />
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">Manage Problems</h5>
                    <p className="dashboard-card-text">View, update, or delete problems.</p>
                    <button className="dashboard-btn dashboard-btn-accent" onClick={() => navigate('/AdminDashboard/ManageProblems')}>Manage Problems</button>
                </div>
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">Manage Users</h5>
                    <p className="dashboard-card-text">Control user roles and accounts.</p>
                    <button className="dashboard-btn dashboard-btn-error" onClick={() => navigate('/AdminDashboard/ManageUsers')}>Manage Users</button>
                </div>
            </div>
            <div className="dashboard-footer">
                <small>You have full control as an admin. Use it wisely!</small>
            </div>
        </div>
        </>
    );
};

export default AdminDashboard;
