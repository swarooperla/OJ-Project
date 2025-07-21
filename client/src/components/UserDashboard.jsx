import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import '../css/Dashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        // Redirect if not logged in or not a user
        if (!token || role !== "user") {
            navigate("/login");
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
        <NavigationBar/>
        <div className="dashboard-bg">
            <div className="dashboard-header">
                <h2 className="dashboard-title">Welcome to Your Dashboard</h2>
            </div>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">Attempt Problems</h5>
                    <p className="dashboard-card-text">Browse and solve coding challenges.</p>
                    <button className="dashboard-btn dashboard-btn-success" onClick={() => navigate('/UserDashboard/ProblemList')}>Start Solving</button>
                </div>
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">My Submissions</h5>
                    <p className="dashboard-card-text">View your submitted solutions and results.</p>
                    <button className="dashboard-btn dashboard-btn-primary" onClick={() => navigate('/UserDashboard/MySubmissions')}>View Submissions</button>
                </div>
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">Leaderboard</h5>
                    <p className="dashboard-card-text">See how you rank against others.</p>
                    <button className="dashboard-btn dashboard-btn-warning" onClick={() => navigate('/UserDashboard/Leaderboard')}>View Leaderboard</button>
                </div>
                {/* Compiler Feature Card */}
                <div className="dashboard-card">
                    <h5 className="dashboard-card-title">Compiler</h5>
                    <p className="dashboard-card-text">Run code with your own inputs.</p>
                    <button className="dashboard-btn dashboard-btn-accent" onClick={() => navigate('/UserDashboard/Compiler')}>Open Compiler</button>
                </div>
            </div>
            <div className="dashboard-footer">
                <small>Keep practicing. Every submission counts!</small>
            </div>
        </div>
        </>
    );
};

export default UserDashboard;
