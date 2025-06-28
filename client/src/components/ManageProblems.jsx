import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

function ManageProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () =>{
      try {
        const res = await axios.get(`${API_URL}/api/problems/getProblems`);
        setProblems(res.data);
      } catch (error) {
        console.error('Error fetching problems', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      await axios.delete(`${API_URL}/api/problems/deleteProblem/${id}`);

      setProblems(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <>
    <NavigationBar />
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Manage Problems</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/AdminDashboard/ManageProblems/CreateProblem')}
        >
          + Add Problem
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading problems...</p>
      ) : problems.length === 0 ? (
        <div className="alert alert-info">No problems added yet.</div>
      ) : (
        <div className="row g-4">
          {problems.map(problem => (
            <div className="col-md-6 col-lg-4" key={problem._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">{problem.title}</h5>
                    <p className="card-text">
                      <span className="badge bg-secondary">{problem.difficulty}</span>
                    </p>
                  </div>
                  <div className="mt-3 d-flex justify-content-between">
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => navigate(`/AdminDashboard/ManageProblems/EditProblem/${problem._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(problem._id)}
                    >
                      Delete
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

export default ManageProblems;
