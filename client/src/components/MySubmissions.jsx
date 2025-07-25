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
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    const fetchSubmissions = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?._id) {
        setLoading(false);
        return;
      }
      const userId = user._id;
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
  }, [userId, isLoggedIn]);

  const getBadgeClass = (verdict) => {
    if (verdict.includes('Accepted')) return 'submission-badge badge-success';
    if (verdict.includes('Wrong Answer')) return 'submission-badge badge-error';
    return 'submission-badge badge-warning';
  };

  if (loading) {
    return (
      <>
        <NavigationBar />
        <div className="submissions-bg"><div className="submissions-loading">Loading submissions...</div></div>
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <NavigationBar />
        <div className="submissions-bg">
          <div className="submissions-empty" style={{ color: 'var(--color-error)', fontWeight: 600 }}>
            Login to see your submissions
          </div>
        </div>
      </>
    );
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
