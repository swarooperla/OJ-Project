import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import '../css/CreateProblem.css';

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
    sampleInput1: '',
    sampleOutput1: '',
    sampleInput2: '',
    sampleOutput2: '',
    difficulty: 'Easy',
    hiddenTestcases: [],
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ success: '', error: '' });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/problems/getProbById/${id}`);
        setFormData({ ...res.data, hiddenTestcases: res.data.hiddenTestcases || [] });
        setTagsInput((res.data.tags || []).join(', '));
      } catch (err) {
        setStatus({ ...status, error: 'Problem not found or failed to load.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setTagsInput(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleTagsBlur = () => {
    setFormData((prev) => ({ ...prev, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: '', error: '' });
    // Ensure tags are up to date before submit
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    try {
      await axios.put(`${API_URL}/api/problems/updateProblem/${id}`, { ...formData, tags });
      setStatus({ success: 'Problem updated successfully!', error: '' });
      setTimeout(() => navigate('/AdminDashboard/ManageProblems'), 1000);
    } catch (err) {
      setStatus({ success: '', error: 'Failed to update the problem.' });
    }
  };

  const addHiddenTestcase = () => {
    setFormData((prev) => ({
      ...prev,
      hiddenTestcases: [...prev.hiddenTestcases, { input: '', output: '' }],
    }));
  };

  const removeHiddenTestcase = (index) => {
    setFormData((prev) => ({
      ...prev,
      hiddenTestcases: prev.hiddenTestcases.filter((_, i) => i !== index),
    }));
  };

  const updateHiddenTestcase = (index, field, value) => {
    const updated = [...formData.hiddenTestcases];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, hiddenTestcases: updated }));
  };

  if (loading) return <div className="problem-form-bg"><div className="problem-form-loading">Loading problem...</div></div>;

  return (
    <>
      <NavigationBar />
      <div className="problem-form-bg">
        <div className="problem-form-card">
          <h2 className="problem-form-title">Edit Problem</h2>

          {status.error && <div className="problem-form-error">{status.error}</div>}
          {status.success && <div className="problem-form-success">{status.success}</div>}

          <form onSubmit={handleSubmit} className="problem-form">
            <div className="problem-form-row">
              <div className="problem-form-group">
                <label className="problem-form-label">Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="problem-form-input" />
              </div>
              <div className="problem-form-group">
                <label className="problem-form-label">Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="problem-form-input">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div className="problem-form-group">
              <label className="problem-form-label">Tags <span style={{fontWeight:400, fontSize:'0.95em'}}>(comma separated)</span></label>
              <input name="tags" value={tagsInput} onChange={handleChange} onBlur={handleTagsBlur} className="problem-form-input" placeholder="e.g. dp, greedy, math" />
            </div>

            <div className="problem-form-group">
              <label className="problem-form-label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required className="problem-form-input"></textarea>
            </div>

            <div className="problem-form-row">
              <div className="problem-form-group">
                <label className="problem-form-label">Input Format</label>
                <textarea name="inputFormat" value={formData.inputFormat} onChange={handleChange} className="problem-form-input"></textarea>
              </div>
              <div className="problem-form-group">
                <label className="problem-form-label">Output Format</label>
                <textarea name="outputFormat" value={formData.outputFormat} onChange={handleChange} className="problem-form-input"></textarea>
              </div>
            </div>

            <div className="problem-form-group">
              <label className="problem-form-label">Constraints</label>
              <textarea name="constraints" value={formData.constraints} onChange={handleChange} className="problem-form-input"></textarea>
            </div>

            <div className="problem-form-row">
              <div className="problem-form-group">
                <label className="problem-form-label">Sample Input-1</label>
                <textarea name="sampleInput1" value={formData.sampleInput1} onChange={handleChange} className="problem-form-input"></textarea>
              </div>
              <div className="problem-form-group">
                <label className="problem-form-label">Sample Output-1</label>
                <textarea name="sampleOutput1" value={formData.sampleOutput1} onChange={handleChange} className="problem-form-input"></textarea>
              </div>
              <div className="problem-form-group">
                <label className="problem-form-label">Sample Input-2</label>
                <textarea name="sampleInput2" value={formData.sampleInput2} onChange={handleChange} className="problem-form-input"></textarea>
              </div>
              <div className="problem-form-group">
                <label className="problem-form-label">Sample Output-2</label>
                <textarea name="sampleOutput2" value={formData.sampleOutput2} onChange={handleChange} className="problem-form-input"></textarea>
              </div>
            </div>

            <div className="problem-form-group">
              <label className="problem-form-label">Hidden Testcases</label>
              {formData.hiddenTestcases.map((tc, idx) => (
                <div key={idx} className="problem-form-row problem-form-hidden-row">
                  <textarea type="text" placeholder={`Input ${idx + 1}`} value={tc.input} onChange={(e) => updateHiddenTestcase(idx, 'input', e.target.value)} className="problem-form-input" required />
                  <textarea type="text" placeholder={`Output ${idx + 1}`} value={tc.output} onChange={(e) => updateHiddenTestcase(idx, 'output', e.target.value)} className="problem-form-input" required />
                  <button type="button" onClick={() => removeHiddenTestcase(idx)} className="problem-form-btn problem-form-btn-remove">
                    ❌ Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addHiddenTestcase} className="problem-form-btn problem-form-btn-add">
                ➕ Add Hidden Testcase
              </button>
            </div>

            <div>
              <button type="submit" className="problem-form-btn problem-form-btn-submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProblem;
