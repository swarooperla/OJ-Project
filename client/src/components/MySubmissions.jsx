import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?._id) {
      setUserId(user._id);
    }
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!userId) return;

      try {
        console.log(userId);
        const res = await axios.get(`${API_URL}/api/submissions`, {
          params: { userId },
        });
        console.log(res.data);
        setSubmissions(res.data || []);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [userId]);

  const getBadgeColor = (verdict) => {
    if (verdict.includes('✅')) return 'bg-green-100 text-green-700';
    if (verdict.includes('❌')) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="text-center py-12 text-lg font-semibold">Loading submissions...</div>;
  }

  if (!submissions.length) {
    return <div className="text-center py-12 text-gray-500 italic">No submissions yet.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Your Submissions</h2>
      {submissions.map((sub, index) => (
        <div
          key={sub._id || index}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition duration-200"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${getBadgeColor(sub.verdict)}`}>
              {sub.verdict}
            </span>
            <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
              {sub.problemTitle || 'Unknown Problem'}
            </span>
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              {sub.language.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(sub.createdAt).toLocaleString()}
            </span>
          </div>
          <pre className="overflow-auto bg-gray-50 text-sm text-gray-800 p-4 rounded-xl border border-gray-200">
            <code>{sub.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
};

export default MySubmissions;
