import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function CreateProblem() {
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
    hiddenTestcases: [{ input: '', output: '' }],
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/api/problems/createProblem`, formData);
      setSuccess('Problem added successfully!');
      setTimeout(() => navigate('/AdminDashboard/ManageProblems'), 1000);
    } catch (err) {
      setError(err.message);
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

  return (
    <>
      <NavigationBar />
      <div className="max-w-5xl mx-auto px-6 py-8 bg-white shadow-md rounded-xl mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Problem</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required className="w-full border rounded-lg px-3 py-2"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Input Format</label>
              <textarea name="inputFormat" value={formData.inputFormat} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"></textarea>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Output Format</label>
              <textarea name="outputFormat" value={formData.outputFormat} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"></textarea>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Constraints</label>
            <textarea name="constraints" value={formData.constraints} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Sample Input-1</label>
              <textarea name="sampleInput1" value={formData.sampleInput1} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"></textarea>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Sample Output-1</label>
              <textarea name="sampleOutput1" value={formData.sampleOutput1} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"></textarea>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Sample Input-2</label>
              <textarea name="sampleInput2" value={formData.sampleInput2} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"></textarea>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Sample Output-2</label>
              <textarea name="sampleOutput2" value={formData.sampleOutput2} onChange={handleChange} className="w-full border rounded-lg px-3 py-2"></textarea>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">Hidden Testcases</label>
            {formData.hiddenTestcases.map((tc, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-2">
                <input type="text" placeholder={`Input ${idx + 1}`} value={tc.input} onChange={(e) => updateHiddenTestcase(idx, 'input', e.target.value)} className="md:col-span-5 border rounded-lg px-3 py-2" required />
                <input type="text" placeholder={`Output ${idx + 1}`} value={tc.output} onChange={(e) => updateHiddenTestcase(idx, 'output', e.target.value)} className="md:col-span-5 border rounded-lg px-3 py-2" required />
                <button type="button" onClick={() => removeHiddenTestcase(idx)} className="md:col-span-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  ❌ Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addHiddenTestcase} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              ➕ Add Hidden Testcase
            </button>
          </div>

          <div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow">
              Submit Problem
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateProblem;
