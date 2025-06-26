import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div style={{paddingTop: "6px"}}>

            <div className="container text-white d-flex flex-column justify-content-center align-items-center"
                 style={{ height: "83vh", backgroundColor: "#2c2e43" }}>
                 
                <h1 className="display-4 fw-bold mb-3">Welcome to CodeArena</h1>
                <p className="lead text-center mb-4">
                    Practice coding, compete with others, and improve your skills in our online judge platform.
                </p>
                <div>
                    <Link className="btn btn-primary btn-lg me-3" to="/register">Get Started</Link>
                    <Link className="btn btn-outline-light btn-lg" to="/login">Login</Link> 
                </div>
            </div>
        </div>
    )
}
export default Home;