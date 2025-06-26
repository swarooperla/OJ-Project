import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const API_URL = 'http://localhost:8000'

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
    const handleSubmit = async (e) =>{
        e.preventDefault();
        console.log("Form submitted");
        try {
            const response = await axios.post(`${API_URL}/register`, formData);
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("token", response.data.user.token);  
              
            alert(response.data.message);
        //    console.log(response.data.user);
            if(response.data.user.role === 'admin'){
                navigate('/AdminDashboard');
            }
            else{
                navigate('/UserDashboard');
            }
        } catch (error) {
            console.log(error.response.data);
            alert(error.response.data);
        } 
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "" }}>
            
            <div className="d-flex flex-column justify-content-center align-items-center p-5 rounded" style={{backgroundColor: "#2b2d42", height: "80vh", width: "80vh"}}>
                <h2 className="text-white mb-4 align-self-start">Register</h2>
                <form style={{ width: '100%'}} onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fullname" className="form-label text-black">Fullname</label>
                        <input name="fullname" type="text" className="form-control" id="fullname" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-black">Email address</label>
                        <input name="email" type="email" className="form-control" id="email" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-black">Password</label>
                        <input name="password" type="password" className="form-control" id="password" onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label text-black">Confirm password</label>
                        <input name="confirmpassword" type="password" className="form-control" id="confirmPassword" onChange={handleChange}  />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Register</button>
                </form>
            </div>

        </div>
    )
}

export default Register