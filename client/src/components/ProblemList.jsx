import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

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

  const getDifficultyClass = (level) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-center mb-6">🧠 Problem List</h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading problems...</div>
        ) : problems.length === 0 ? (
          <div className="text-center text-blue-500">No problems available.</div>
        ) : (
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <div className="flex justify-between bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-600 border-b">
              <div className="w-1/2">Title</div>
              <div className="w-1/4 text-center">Difficulty</div>
              <div className="w-1/4 text-right">Action</div>
            </div>
            <ul>
              {problems.map((prob, idx) => (
                <li
                  key={prob._id}
                  className={`flex items-center justify-between px-6 py-4 text-sm ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100 transition`}
                >
                  {/* Title */}
                  <div className="w-1/2 text-gray-800 font-medium truncate">{prob.title}</div>

                  {/* Difficulty */}
                  <div className="w-1/4 text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${getDifficultyClass(
                        prob.difficulty
                      )}`}
                    >
                      {prob.difficulty}
                    </span>
                  </div>

                  {/* Solve Button */}
                  <div className="w-1/4 text-right">
                    <button
                      onClick={() => navigate(`/CodeEditor/${prob._id}`)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Solve →
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default ProblemList;
