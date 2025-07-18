import React from "react";
import { Link } from "react-router-dom";
import '../css/Home.css';

function Home() {
  // Example static data (replace with real data as needed)
  const stats = [
    { icon: "💡", label: "Problems", value: "100+", color: "#fbbf24" },
    { icon: "👥", label: "Active Users", value: "100+", color: "#38bdf8" },
    { icon: "🚀", label: "Submissions Today", value: "1,024", color: "#f472b6" },
  ];

  const testimonials = [
    {
      quote: "ByteCode helped me land my first internship!",
      user: "— Priya S.",
      color: "#fbbf24"
    },
    {
      quote: "The leaderboard keeps me motivated every day.",
      user: "— Alex T.",
      color: "#38bdf8"
    },
    {
      quote: "I love the instant feedback on my code.",
      user: "— Samir R.",
      color: "#f472b6"
    },
  ];

  const badges = [
    { icon: "🏅", name: "Streak Master", desc: "Solve problems 7 days in a row", color: "#fbbf24" },
    { icon: "🎯", name: "Accuracy Pro", desc: "Achieve 90% correct submissions", color: "#38bdf8" },
    { icon: "⚡", name: "Speedster", desc: "Solve a problem in under 5 minutes", color: "#f472b6" },
  ];

  const featureColors = ["#fbbf24", "#38bdf8", "#f472b6"];
  const featureTitles = [
    { title: "📝 Practice Problems", desc: "Sharpen your skills with a variety of coding challenges." },
    { title: "🏆 Leaderboard", desc: "Compete with others and track your progress in real time." },
    { title: "👨‍💻 Code Editor", desc: "Write, run, and test your code directly in the browser." },
  ];

  return (
    <div className="home-container">
      <section className="home-hero colorful-hero">
        <h1 className="home-title">Welcome to ByteCode</h1>
        <p className="home-subtitle">
          Practice coding challenges, track your progress, and join a vibrant community to boost your programming skills.
        </p>
        <div className="home-actions">
          <Link to="/login" className="home-btn home-btn-primary">
            Login
          </Link>
          <Link to="/register" className="home-btn home-btn-secondary">
            Register
          </Link>
        </div>
      </section>

      {/* Features Section (enlarged width/height) */}
      <section className="home-features card-section enlarged-features-section">
        {featureTitles.map((feature, idx) => (
          <div
            className="feature-card card enlarged-feature-card"
            key={feature.title}
            style={{ borderBottom: `4px solid ${featureColors[idx]}` }}
          >
            <h2>{feature.title}</h2>
            <p>{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Testimonials Section (card layout, colorful) */}
      <section className="home-testimonials card-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonial-list">
          {testimonials.map((t, idx) => (
            <div
              className="testimonial-card card"
              key={idx}
              style={{ borderBottom: `4px solid ${t.color}` }}
            >
              <p className="testimonial-quote">"{t.quote}"</p>
              <p className="testimonial-user" style={{ color: t.color }}>{t.user}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gamification Teaser Section (card layout, colorful) */}
      <section className="home-gamification card-section">
        <h2 className="section-title">Unlock Achievements</h2>
        <div className="badge-list">
          {badges.map((b, idx) => (
            <div
              className="badge-card card"
              key={idx}
              style={{ borderBottom: `4px solid ${b.color}` }}
            >
              <span className="badge-icon" style={{ color: b.color }}>{b.icon}</span>
              <span className="badge-name">{b.name}</span>
              <span className="badge-desc">{b.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* User Stats Section (now below achievements) */}
      <section className="home-stats card-section">
        <h2 className="section-title">Platform Stats</h2>
        {stats.map((stat, idx) => (
          <div
            className="stat-card card"
            key={idx}
            style={{ borderBottom: `4px solid ${stat.color}` }}
          >
            <span className="stat-icon" style={{ color: stat.color }}>{stat.icon}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;