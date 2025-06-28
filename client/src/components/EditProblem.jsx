import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './NavigationBar';

const API_URL = import.meta.env.VITE_API_URL;

function EditProblem() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ success: '', error: '' });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/problems/getProbById/${id}`);
        setFormData(res.data); // assuming backend returns full problem object
        setLoading(false);
      } catch (err) {
        setStatus({ ...status, error: 'Problem not found or failed to load.' });
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: '', error: '' });

    try {
      await axios.put(`${API_URL}/api/problems/updateProblem/${id}`, formData);
      setStatus({ success: 'Problem updated successfully!', error: '' });
      setTimeout(() => navigate('/AdminDashboard/ManageProblems'), 1200);
    } catch (err) {
      setStatus({ success: '', error: 'Failed to update the problem.' });
    }
  };

  if (loading) return <div className="container py-5">Loading problem...</div>;

  return (
    <>
      <NavigationBar />
      <div className="container py-5">
        <h2 className="mb-4">Edit Problem</h2>

        {status.error && <div className="alert alert-danger">{status.error}</div>}
        {status.success && <div className="alert alert-success">{status.success}</div>}

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
            <textarea
              className="form-control"
              name="inputFormat"
              value={formData.inputFormat}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Output Format</label>
            <textarea
              className="form-control"
              name="outputFormat"
              value={formData.outputFormat}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Constraints</label>
            <textarea
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditProblem;
