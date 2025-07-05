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
  const [output1, setOutput1] = useState('');
  const [output2, setOutput2] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('cpp');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState(null); // 'run', 'submit', 'custom'

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/problems/getProbById/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error('Failed to load problem:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const getDifficultyColorClass = (level) => {
    switch ((level || '').toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setIsSubmitting(false);
    setMode('run');
    setOutput1(''); setOutput2(''); setCustomOutput('');

    try {
      const [res1, res2] = await Promise.all([
        axios.post(`${COMPILER_URL}/api/compiler/run`, { language, code, input: problem.sampleInput1 }),
        axios.post(`${COMPILER_URL}/api/compiler/run`, { language, code, input: problem.sampleInput2 }),
      ]);
      setOutput1(res1.data.output);
      setOutput2(res2.data.output);
    } catch (err) {
      console.error('Error running code:', err);
      setOutput1('Failed to run code!!');
      setOutput2('Failed to run code!!');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsRunning(false);
    setMode('submit');
    setOutput1(''); setOutput2(''); setCustomOutput('');

    try {
      const res = await axios.post(`${COMPILER_URL}/api/compiler/submit`, { language, code, problemId: id });
      const verdict = res.data.verdict;
      setOutput1(verdict);
      console.log(verdict, "from console");
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;
      const problemTitle = problem.title;
      await axios.post(`${API_URL}/api/submissions/addSubmission`, {
        userId,
        problemId: id,
        language,
        code,
        verdict,
        problemTitle,
      })
    } catch (err) {
      console.error('Error submitting code:', err);
      setOutput1('Failed to submit code!!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomRun = async () => {
    setIsRunning(true);
    setIsSubmitting(false);
    setMode('custom');
    setOutput1(''); setOutput2(''); setCustomOutput('');

    try {
      const res = await axios.post(`${COMPILER_URL}/api/compiler/run`, {
        language,
        code,
        input: customInput,
      });
      setCustomOutput(res.data.output);
    } catch (err) {
      console.error('Error running custom input:', err);
      setCustomOutput('❌ Failed to run with custom input');
    } finally {
      setIsRunning(false);
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
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColorClass(problem?.difficulty)} mb-4`}>
            {problem.difficulty}
          </span>
          <div className="space-y-3 text-gray-700">
            <p><strong>Description:</strong> {problem.description}</p>
            <p><strong>Input Format:</strong> {problem.inputFormat}</p>
            <p><strong>Output Format:</strong> {problem.outputFormat}</p>
            <p><strong>Constraints:</strong><br /><code className="block whitespace-pre-wrap bg-gray-100 p-2 rounded-md text-sm">{problem.constraints}</code></p>
            <p><strong>Sample Input-1:</strong><br /><code className="block whitespace-pre-wrap bg-gray-100 p-2 rounded-md text-sm">{problem.sampleInput1}</code></p>
            <p><strong>Sample Output-1:</strong><br /><code className="block whitespace-pre-wrap bg-gray-100 p-2 rounded-md text-sm">{problem.sampleOutput1}</code></p>
            <p><strong>Sample Input-2:</strong><br /><code className="block whitespace-pre-wrap bg-gray-100 p-2 rounded-md text-sm">{problem.sampleInput2}</code></p>
            <p><strong>Sample Output-2:</strong><br /><code className="block whitespace-pre-wrap bg-gray-100 p-2 rounded-md text-sm">{problem.sampleOutput2}</code></p>
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
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow" onClick={handleRun} disabled={isRunning || isSubmitting}>▶️ Run</button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow" onClick={handleSubmit} disabled={isRunning || isSubmitting}>🚀 Submit</button>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Input</label>
            <textarea
              rows="4"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full p-2 border rounded-md font-mono text-sm bg-gray-50"
              placeholder="Enter custom input here..."
            />
            <button
              className="mt-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
              onClick={handleCustomRun}
              disabled={isRunning}
            >🧪 Run Custom Test</button>
          </div>

          {/* Unified Output Display */}
          {(isRunning || isSubmitting || output1 || output2 || customOutput) && (
            <div className="mt-6 bg-gray-100 p-4 rounded-xl w-full">
              {(isRunning || isSubmitting) && (
                <div className="flex justify-center items-center">
                  <div className="w-6 h-6 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {!isRunning && !isSubmitting && (
                <>
                  <h6 className="font-semibold text-gray-700 mb-2">Output:</h6>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {mode === 'run' && `${output1}\n${output2}`}
                    {mode === 'submit' && output1}
                    {mode === 'custom' && customOutput}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CodeEditor;
