import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/MySubmissions.css';
import NavigationBar from './NavigationBar';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [searchVerdict, setSearchVerdict] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('');

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
        const res = await axios.get(`${API_URL}/api/submissions`, {
          params: { userId },
        });
        setSubmissions(res.data || []);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [userId]);

  const getBadgeClass = (verdict) => {
    if (verdict.includes('✅')) return 'submission-badge badge-success';
    if (verdict.includes('❌')) return 'submission-badge badge-error';
    return 'submission-badge badge-warning';
  };

  if (loading) {
    return <div className="submissions-bg"><div className="submissions-loading">Loading submissions...</div></div>;
  }

  if (!submissions.length) {
    return <div className="submissions-bg"><div className="submissions-empty">No submissions yet.</div></div>;
  }

  const filteredSubmissions = submissions.filter(sub => {
    const matchesVerdict = sub.verdict.toLowerCase().includes(searchVerdict.toLowerCase());
    const matchesLanguage = sub.language.toLowerCase().includes(searchLanguage.toLowerCase());
    return matchesVerdict && matchesLanguage;
  });

  return (
    <>
    <NavigationBar />
    <div className="submissions-bg">
      <h2 className="submissions-title">Your Submissions</h2>
      <div className="submissions-search-row">
        <input
          type="text"
          placeholder="Search by verdict…"
          value={searchVerdict}
          onChange={e => setSearchVerdict(e.target.value)}
          className="submissions-search-input"
        />
        <input
          type="text"
          placeholder="Search by language…"
          value={searchLanguage}
          onChange={e => setSearchLanguage(e.target.value)}
          className="submissions-search-input"
        />
      </div>
      {filteredSubmissions.map((sub, index) => (
        <div
          key={sub._id || index}
          className="submission-card"
        >
          <div className="submission-meta">
            <span className={getBadgeClass(sub.verdict)}>
              {sub.verdict}
            </span>
            <span className="submission-problem-title">
              {sub.problemTitle || 'Unknown Problem'}
            </span>
            <span className="submission-language">
              {sub.language.toUpperCase()}
            </span>
            <span className="submission-time">
              {new Date(sub.createdAt).toLocaleString()}
            </span>
          </div>
          <pre className="submission-code-block">
            <code>{sub.code}</code>
          </pre>
        </div>
      ))}
    </div>
    </>
  );
};

export default MySubmissions;
