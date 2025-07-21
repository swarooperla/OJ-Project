import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CodeBox_logo from "../assets/CodeBox_logo.png";
import '../css/NavigationBar.css'; // Import your external CSS

function NavigationBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    const handleLogo = () => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token) {
            navigate('/');
        } else if (role === 'admin') {
            navigate('/AdminDashboard');
        } else {
            navigate('/UserDashboard');
        }
    };

    const location = useLocation();
    const isHome = location.pathname === '/';
    const isRegister = location.pathname === '/register';
    const isLogin = location.pathname === '/login';

    let authLink = null;
    let navLinks = null;
    let logOut = null;

    if (isHome) {
        authLink = (
            <ul className="navibar-nav">
                <li>
                    <Link className="navbar-link" to="/login">Login</Link>
                </li>
                <li>
                    <Link className="navbar-link" to="/register">Register</Link>
                </li>
            </ul>
        );
    }

    if (!isHome && !isRegister && !isLogin) {
        // Determine user role for correct dashboard paths
        const role = localStorage.getItem('role');
        const basePath = role === 'admin' ? '/AdminDashboard' : '/UserDashboard';
        navLinks = (
            <ul className="navibar-nav">
                <li>
                    <Link className="navbar-link" to={`${basePath}/ProblemList`}>ProblemList</Link>
                </li>
                <li>
                    <Link className="navbar-link" to={`${basePath}/MySubmissions`}>Submissions</Link>
                </li>
                <li>
                    <Link className="navbar-link" to={`${basePath}/Compiler`}>Compiler</Link>
                </li>
            </ul>
        );
        logOut = (
            <button className="button button-outline-danger" onClick={handleLogout}>Logout</button>
        );
    }

    return (
        <nav className="navbar">
            <div className="navibar-brand" onClick={handleLogo}>
                <img
                    src={CodeBox_logo}
                    alt="logo"
                    width="40"
                    height="40"
                />
                <span>ByteCode</span>
            </div>
            {authLink}
            {navLinks}
            {logOut}
        </nav>
    );
}

export default NavigationBar;