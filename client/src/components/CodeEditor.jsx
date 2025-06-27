import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './NavigationBar';

const API_URL = 'http://localhost:8000';

function CodeEditor() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your code here...');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/problems/getProbById/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error('Failed to load problem:', err.response?.data || err.message, err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleRun = () => {
    setOutput('✅ Code ran successfully (mock output)');
  };

  const handleSubmit = () => {
    setOutput('🎯 Code submitted for evaluation (mock response)');
  };

  if (loading || !problem) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading problem...</p>
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="container-fluid py-4">
        <div className="row">
          {/* Problem Description */}
          <div className="col-md-6 border-end pe-4">
            <h3 className="fw-bold">{problem.title}</h3>
            <span className={`badge bg-${getDifficultyColor(problem?.difficulty || '')} mb-3`}>
              {problem.difficulty}
            </span>
            <p><strong>Description:</strong> {problem.description}</p>
            <p><strong>Input Format:</strong> {problem.inputFormat}</p>
            <p><strong>Output Format:</strong> {problem.outputFormat}</p>
            <p><strong>Constraints:</strong> {problem.constraints}</p>
            <p><strong>Sample Input:</strong><br /><code>{problem.sampleInput}</code></p>
            <p><strong>Sample Output:</strong><br /><code>{problem.sampleOutput}</code></p>
          </div>

          {/* Code Editor */}
          <div className="col-md-6">
            <h5 className="mb-2">Editor</h5>
            <textarea
              className="form-control mb-3"
              rows="15"
              style={{
                fontFamily: 'monospace',
                backgroundColor: '#f8f9fa',
                resize: 'vertical',
                padding: '10px'
              }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-outline-primary" onClick={handleRun}>
                ▶️ Run
              </button>
              <button className="btn btn-success" onClick={handleSubmit}>
                🚀 Submit
              </button>
            </div>

            <div className="border p-3 bg-light rounded">
              <h6 className="fw-bold">Output:</h6>
              <pre className="m-0">{output || 'No output yet.'}</pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function getDifficultyColor(level) {
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
}

export default CodeEditor;
