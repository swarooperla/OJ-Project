import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000';

function ProblemList() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/problems/getProblems`);
        setProblems(res.data);
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="container py-5">
        <h2 className="mb-4 text-center fw-bold">🧠 Problem List</h2>

        {loading ? (
          <div className="text-center text-muted">Loading problems...</div>
        ) : problems.length === 0 ? (
          <div className="alert alert-info text-center">No problems available.</div>
        ) : (
          <div className="row g-4">
            {problems.map((prob) => (
              <div className="col-md-6 col-lg-4" key={prob._id}>
                <div className="card shadow-sm h-100 border-start border-5 border-primary">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title">{prob.title}</h5>
                      <p className="card-text text-muted" style={{ minHeight: "50px" }}>
                        {prob.description.length > 100
                          ? prob.description.slice(0, 100) + '...'
                          : prob.description}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className={`badge bg-${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/CodeEditor/${prob._id}`)}>
                        Solve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ProblemList;
