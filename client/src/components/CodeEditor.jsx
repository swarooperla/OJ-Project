import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './NavigationBar';

const API_URL = import.meta.env.VITE_API_URL;
const COMPILER_URL = import.meta.env.VITE_COMPILER_API_URL;

function CodeEditor() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your code here...');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('cpp');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/problems/getProbById/${id}`);
        setProblem(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('Failed to load problem:', err.response?.data || err.message, err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    try {
      const res = await axios.post(`${COMPILER_URL}/api/compiler/run`, { language, code, input: problem.sampleInput });
      setOutput(res.data.output);
    } catch (error) {
      console.error("Error running code: ", error);
      setOutput("Failed to run code!!");
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${COMPILER_URL}/api/compiler/submit`, { language, code });
      setOutput(res.data.output);
    } catch (error) {
      console.error("Error submitting code: ", error);
      setOutput("Failed to submit code!!");
    }
  };

  if (loading || !problem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-lg font-semibold">Loading problem...</p>
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100 min-h-screen">
        {/* Problem Description */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-2 text-gray-800">{problem.title}</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-${getDifficultyColor(problem?.difficulty || '')}-100 text-${getDifficultyColor(problem?.difficulty || '')}-800 mb-4`}>{problem.difficulty}</span>
          <div className="space-y-3 text-gray-700">
            <p><strong>Description:</strong> {problem.description}</p>
            <p><strong>Input Format:</strong> {problem.inputFormat}</p>
            <p><strong>Output Format:</strong> {problem.outputFormat}</p>
            <p><strong>Constraints:</strong><br />
  <code className="block whitespace-pre-wrap bg-gray-100 p-2 rounded-md text-sm">{problem.constraints}</code>
</p>

            <p><strong>Sample Input:</strong><br /><code className="block whitespace-pre-wrap bg-gray-100 p-2 rounded-md text-sm">{problem.sampleInput}</code></p>
            <p><strong>Sample Output:</strong><br /><code className="block whitespace-pre-wrap bg-gray-100 p-2 rounded-md text-sm">{problem.sampleOutput}</code></p>
          </div>
        </div>

        {/* Code Editor */}
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
          <h5 className="text-xl font-semibold mb-4">Editor</h5>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Language:</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>

          <textarea
            className="flex-1 rounded-md border border-gray-300 bg-gray-50 font-mono p-4 resize-y text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="15"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="flex gap-4 mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
              onClick={handleRun}
            >
              ▶️ Run
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
              onClick={handleSubmit}
            >
              🚀 Submit
            </button>
          </div>

          <div className="mt-6 bg-gray-100 p-4 rounded-xl">
            <h6 className="font-semibold text-gray-700 mb-2">Output:</h6>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{output || 'No output yet.'}</pre>
          </div>
        </div>
      </div>
    </>
  );
}

function getDifficultyColor(level) {
  switch (level.toLowerCase()) {
    case 'easy':
      return 'green';
    case 'medium':
      return 'yellow';
    case 'hard':
      return 'red';
    default:
      return 'gray';
  }
}

export default CodeEditor;
