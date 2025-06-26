import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

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
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard</h2>
            </div>

            <div className="row g-4">

                {/* User-side buttons */}
                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Attempt Problems</h5>
                            <p className="card-text">Try and solve coding challenges.</p>
                            <button className="btn btn-success w-100" onClick={() => navigate('/AdminDashboard/ProblemList')}>Start Solving</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">My Submissions</h5>
                            <p className="card-text">Check your submission history.</p>
                            <button className="btn btn-primary w-100" onClick={() => navigate('/AdminDashboard/MySubmissions')}>View Submissions</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Leaderboard</h5>
                            <p className="card-text">Track top users and scores.</p>
                            <button className="btn btn-warning w-100" onClick={() => navigate('/AdminDashboard/Leaderboard')}>View Leaderboard</button>
                        </div>
                    </div>
                </div>

                {/* Admin-only buttons */}
                

                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Manage Problems</h5>
                            <p className="card-text">View, update, or delete problems.</p>
                            <button className="btn btn-outline-info w-100" onClick={() => navigate('/AdminDashboard/ManageProblems')}>Manage Problems</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <h5 className="card-title">Manage Users</h5>
                            <p className="card-text">Control user roles and accounts.</p>
                            <button className="btn btn-outline-danger w-100" onClick={() => navigate('/AdminDashboard/ManageUsers')}>Manage Users</button>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-5 text-center text-muted">
                <small>You have full control as an admin. Use it wisely!</small>
            </div>
        </div>
        </>
    );
};

export default AdminDashboard;
