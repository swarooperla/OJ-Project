import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const API_URL = 'http://localhost:8000'

function Login() {
    const [formData, setFromData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleChange = (e) =>{
        setFromData({...formData, [e.target.name]: e.target.value});
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, formData);
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("token", response.data.user.token);
        //    console.log("Login response:", response.data);
            alert(response.data.message);

            if(response.data.user.role === 'admin'){
                navigate('/AdminDashboard');
            }else{
                navigate('/UserDashboard');
            }
        } catch (error) {
            alert(error.response?.data || "Login failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center position-relative" style={{ minHeight: "100vh", backgroundColor: "" }}>
            <div className="text-center position-absolute top-0 start-5 p-3 mt-5" style={{color: "black"}}>
                {/* <h3>Welcome to CodeArena</h3> */}
                {/* <h4>Please login to continue.</h4> */}
            </div>
            <div
                className="d-flex flex-column justify-content-center align-items-center p-5 rounded mb-5"
                style={{ backgroundColor: "#2b2d42", height: "50vh", width: "80vh" }}
            >
                <h2 className = "text-white mb-4 align-self-start">Login</h2>
                <form style={{width: '100%'}} onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-black">Email address</label>
                        <input name="email" type="email" className="form-control" id="email" placeholder="Enter email" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-black">Password</label>
                        <input name="password" type="password" className="form-control" id="password" placeholder="Enter password" onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                
                
            </div>
        </div>
    );
}

export default Login