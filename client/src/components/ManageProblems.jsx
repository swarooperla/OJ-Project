import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import axios from 'axios';
import '../css/ManageProblems.css';
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

  const getBadgeClass = (level) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'manage-problem-badge badge-success';
      case 'medium':
        return 'manage-problem-badge badge-warning';
      case 'hard':
        return 'manage-problem-badge badge-error';
      default:
        return 'manage-problem-badge badge-muted';
    }
  };

  return (
    <>
    <NavigationBar />
    <div className="manage-problems-bg">
      <div className="manage-problems-header">
        <h2 className="manage-problems-title">Manage Problems</h2>
        <button
          className="manage-problems-add-btn"
          onClick={() => navigate('/AdminDashboard/ManageProblems/CreateProblem')}
        >
          + Add Problem
        </button>
      </div>

      {loading ? (
        <p className="manage-problems-loading">Loading problems...</p>
      ) : problems.length === 0 ? (
        <div className="manage-problems-empty">No problems added yet.</div>
      ) : (
        <div className="manage-problems-grid">
          {problems.map(problem => (
            <div className="manage-problem-card" key={problem._id}>
              <div>
                <h5 className="manage-problem-title">{problem.title}</h5>
                <span className={getBadgeClass(problem.difficulty)}>{problem.difficulty}</span>
              </div>
              <div className="manage-problem-actions">
                <button
                  className="manage-problem-btn manage-problem-btn-edit"
                  onClick={() => navigate(`/AdminDashboard/ManageProblems/EditProblem/${problem._id}`)}
                >
                  Edit
                </button>
                <button
                  className="manage-problem-btn manage-problem-btn-delete"
                  onClick={() => handleDelete(problem._id)}
                >
                  Delete
                </button>
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
