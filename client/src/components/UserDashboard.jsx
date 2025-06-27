import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

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
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Welcome to Your Dashboard</h2>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Attempt Problems</h5>
                            <p className="card-text">Browse and solve coding challenges.</p>
                            <button className="btn btn-success w-100" onClick={() => navigate('/UserDashboard/ProblemList')}>Start Solving</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">My Submissions</h5>
                            <p className="card-text">View your submitted solutions and results.</p>
                            <button className="btn btn-primary w-100">View Submissions</button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Leaderboard</h5>
                            <p className="card-text">See how you rank against others.</p>
                            <button className="btn btn-warning w-100">View Leaderboard</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 text-center text-muted">
                <small>Keep practicing. Every submission counts!</small>
            </div>
        </div>
        </>
    );
};

export default UserDashboard;
