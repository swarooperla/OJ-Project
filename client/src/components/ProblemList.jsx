import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import { useNavigate } from 'react-router-dom';
import '../css/ProblemList.css';

const API_URL = import.meta.env.VITE_API_URL;

function ProblemList() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchTag, setSearchTag] = useState('');

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
        return 'badge badge-success';
      case 'medium':
        return 'badge badge-warning';
      case 'hard':
        return 'badge badge-error';
      default:
        return 'badge badge-muted';
    }
  };

  const filteredProblems = problems.filter(prob => {
    const matchesName = prob.title.toLowerCase().includes(searchName.toLowerCase());
    const matchesTag = searchTag === '' || (prob.tags && prob.tags.some(tag => tag.toLowerCase().includes(searchTag.toLowerCase())));
    return matchesName && matchesTag;
  });

  return (
    <>
      <NavigationBar />
      <div className="problem-list-bg">
        <div className="problem-list-search-row">
          <input
            type="text"
            placeholder="Search by problem name…"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="problem-list-search-input"
          />
          <input
            type="text"
            placeholder="Search by tag…"
            value={searchTag}
            onChange={e => setSearchTag(e.target.value)}
            className="problem-list-search-input"
          />
        </div>
        <div className="problem-list-card" style={{maxWidth: '1100px'}}>
          <h2 className="problem-list-title">🧠 Problem List</h2>

          {loading ? (
            <div className="problem-list-loading">Loading problems...</div>
          ) : filteredProblems.length === 0 ? (
            <div className="problem-list-empty">No problems available.</div>
          ) : (
            <div className="problem-list-table">
              <div className="problem-list-header-row">
                <div className="problem-list-header-title">Title</div>
                <div className="problem-list-header-tags">Tags</div>
                <div className="problem-list-header-difficulty">Difficulty</div>
                <div className="problem-list-header-action">Action</div>
              </div>
              <ul className="problem-list-ul">
                {filteredProblems.map((prob, idx) => (
                  <li
                    key={prob._id}
                    className={`problem-list-row${idx % 2 === 0 ? ' even' : ' odd'}`}
                  >
                    {/* Title */}
                    <div className="problem-list-title-cell">{prob.title}</div>

                    {/* Tags */}
                    <div className="problem-list-tags-cell">
                      {prob.tags && prob.tags.length > 0 ? (
                        prob.tags.map((tag, i) => (
                          <span key={i} className="badge badge-muted problem-list-tag-badge">{tag}</span>
                        ))
                      ) : (
                        <span className="problem-list-tag-empty">—</span>
                      )}
                    </div>

                    {/* Difficulty */}
                    <div className="problem-list-difficulty-cell">
                      <span className={getDifficultyClass(prob.difficulty)}>
                        {prob.difficulty}
                      </span>
                    </div>

                    {/* Solve Button */}
                    <div className="problem-list-action-cell">
                      <button
                        onClick={() => navigate(`/CodeEditor/${prob._id}`)}
                        className="problem-list-solve-btn"
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
      </div>
    </>
  );
}

export default ProblemList;
