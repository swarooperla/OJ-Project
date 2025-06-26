import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import axios from 'axios';
const API_URL = 'http://localhost:8000'
function CreateProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    sampleInput: '',
    sampleOutput: '',
    difficulty: 'Easy',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(`${API_URL}/api/problems/createProblem`, formData) 
      setSuccess('Problem added successfully!');
      setTimeout(() => navigate('/AdminDashboard/ManageProblems'), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
    <NavigationBar />
    <div className="container py-5">
      <h2 className="mb-4">Add New Problem</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Difficulty</label>
          <select
            className="form-select"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Input Format</label>
          <input
            className="form-control"
            name="inputFormat"
            value={formData.inputFormat}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Output Format</label>
          <input
            className="form-control"
            name="outputFormat"
            value={formData.outputFormat}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Constraints</label>
          <input
            className="form-control"
            name="constraints"
            value={formData.constraints}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Sample Input</label>
          <textarea
            className="form-control"
            name="sampleInput"
            rows="2"
            value={formData.sampleInput}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Sample Output</label>
          <textarea
            className="form-control"
            name="sampleOutput"
            rows="2"
            value={formData.sampleOutput}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <button className="btn btn-success" type="submit">
            Submit Problem
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

export default CreateProblem;
