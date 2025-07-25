import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CodeBox_logo from "../assets/CodeBox_logo.png";
import '../css/NavigationBar.css'; // Import your external CSS

function NavigationBar() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
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
    let navLinks = (
        <ul className="navibar-nav">
            <li>
                <Link className="navbar-link" to="/UserDashboard/ProblemList">ProblemList</Link>
            </li>
            <li>
                <Link className="navbar-link" to="/UserDashboard/MySubmissions">Submissions</Link>
            </li>
            <li>
                <Link className="navbar-link" to="/UserDashboard/Compiler">Compiler</Link>
            </li>
        </ul>
    );
    const isLoggedIn = Boolean(localStorage.getItem('token'));
    let logOut = null;
    if (isLoggedIn) {
        logOut = (
            <button className="button button-outline-danger" onClick={() => setShowLogoutModal(true)}>Logout</button>
        );
    }
    return (
        <>
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <div className="navibar-brand" style={{ flex: '0 0 auto' }} onClick={handleLogo}>
                    <img
                        src={CodeBox_logo}
                        alt="logo"
                        width="40"
                        height="40"
                    />
                    <span>ByteCode</span>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    {navLinks}
                </div>
                {!isLoggedIn && (
                    <div style={{ display: 'flex', gap: 8, flex: '0 0 auto', marginLeft: 'auto' }}>
                        <Link className="navbar-link" to="/login">Login</Link>
                        <Link className="navbar-link" to="/register">Register</Link>
                    </div>
                )}
                {isLoggedIn && logOut}
            </div>
        </nav>
        {showLogoutModal && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}>
                <div style={{
                    background: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-card)',
                    padding: '32px 24px',
                    minWidth: '300px',
                    maxWidth: '90vw',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '1.15rem', marginBottom: 24, fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                        Are you sure you want to log out?
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                        <button
                            className="button"
                            style={{ background: 'var(--color-background)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
                            onClick={() => setShowLogoutModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="button button-outline-danger"
                            style={{ background: 'var(--color-error)', color: '#fff', border: 'none' }}
                            onClick={() => { setShowLogoutModal(false); handleLogout(); }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default NavigationBar;