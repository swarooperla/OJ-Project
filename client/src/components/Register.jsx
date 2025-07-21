import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../css/Register.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;

function Register() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        confirmpassword: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) =>{
        setFormData({...formData, [e.target.name]: e.target.value});
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
            const response = await axios.post(`${API_URL}/api/auth/register`, formData);
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("token", response.data.user.token);  
            toast.success("Successfully registered");
            setTimeout(() => {
                if(response.data.user.role === 'admin'){
                    navigate('/AdminDashboard');
                }
                else{
                    navigate('/UserDashboard');
                }
            }, 1000);
        } catch (error) {
            console.log(error.response.data);
            toast.error(error.response?.data?.message || "Registration failed");
        } 
    };

    return (
        <div className="register-bg">
            <div className="register-card">
                <h2 className="register-title">Register</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-form-group">
                        <label htmlFor="fullname" className="register-label">Fullname</label>
                        <input name="fullname" type="text" className="register-input" id="fullname" onChange={handleChange} />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="email" className="register-label">Email address</label>
                        <input name="email" type="email" className="register-input" id="email" onChange={handleChange} />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="password" className="register-label">Password</label>
                        <input name="password" type="password" className="register-input" id="password" onChange={handleChange} />
                    </div>
                    <div className="register-form-group">
                        <label htmlFor="confirmPassword" className="register-label">Confirm password</label>
                        <input name="confirmpassword" type="password" className="register-input" id="confirmPassword" onChange={handleChange}  />
                    </div>
                    <button type="submit" className="register-btn">Register</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Register;