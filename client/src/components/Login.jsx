import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import '../css/Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const [formData, setFromData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) =>{
        setFromData({...formData, [e.target.name]: e.target.value});
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if(token && role){
            if(role === 'admin'){
                navigate('/AdminDashboard');
            }else{
                navigate('/UserDashboard');
            }
        }
    }, []);
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, formData);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("token", response.data.user.token);
            toast.success("Successfully logged in");
            setTimeout(() => {
                if(response.data.user.role === 'admin'){
                    navigate('/AdminDashboard');
                }else{
                    navigate('/UserDashboard');
                }
            }, 1000);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-bg">
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label htmlFor="email" className="login-label">Email address</label>
                        <input name="email" type="email" className="login-input" id="email" placeholder="Enter email" onChange={handleChange} />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password" className="login-label">Password</label>
                        <input name="password" type="password" className="login-input" id="password" placeholder="Enter password" onChange={handleChange} />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;