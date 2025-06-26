import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
       // localStorage.removeItem("email"); // optional
        navigate("/login");
    };
    const location = useLocation();
    const isHome = location.pathname === '/';
    let authLink = null;
    let logOut = null;
    const isRegister = location.pathname ==='/register';
    const isLogin = location.pathname === '/login';
    if(isHome){
        authLink = (
            <ul className="navbar-nav ms-auto d-flex flex-row gap-3">
            <li className="nav-item">
                <Link className="nav-link text-white" to="/login">Login</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link text-white" to="/register">Register</Link>
            </li>
        </ul>
        );
    }
    if(!isHome && !isRegister && !isLogin){
        logOut = (
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
        );
    }

    return (
        <nav className="navbar navbar-dark bg-dark px-4">

            <Link className="navbar-brand d-flex align-items-center" to="/">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/732/732212.png" // You can replace this with your preferred logo
                    alt="logo"
                    width="30"
                    height="30"
                    className="me-2"
                />
                <span>CodeArena</span>
            </Link>

            {authLink}
            {logOut}
        </nav>
    );
}

export default NavigationBar;
