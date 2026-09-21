import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExams = () => {
    setLoading(true);
    setError('');
    api
      .get('/exams/available')
      .then(({ data }) => setExams(data))
      .catch((err) => {
        setError(err.response?.data?.message || 'Could not load exams. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    logout();
    navigate('/');
  };

  return (
    <div className="dash">
      <div className="dash-topbar">
        <div className="dash-brand">
          <span>◈</span> ExamGuard
        </div>
        <div className="dash-user">
          <span className="dash-role-tag">Student</span>
          <span>{user?.name}</span>
          <Link to="/profile" style={{ color: 'var(--white)', fontSize: '0.85rem', opacity: 0.85 }}>
            My Profile
          </Link>
          <button className="dash-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <div className="dash-body">
        <div className="dash-heading">
          <h1>My Exams</h1>
          <p>Exams currently open for you to attempt.</p>
        </div>

        {error && (
          <div className="admin-alert error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
            <span>{error}</span>
            <button className="dash-btn" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={fetchExams}>
              Retry
            </button>
          </div>
        )}

        {loading && <div className="dash-empty">Loading exams…</div>}

        {!loading && !error && exams.length === 0 && (
          <div className="dash-empty">No exams are open right now. Check back later.</div>
        )}

        {!loading && exams.length > 0 && (
          <div className="dash-grid">
            {exams.map((exam) => (
              <div className="dash-card" key={exam._id}>
                <h3>{exam.title}</h3>
                <p>{exam.description || 'No description provided.'}</p>
                <p style={{ marginTop: 10, fontSize: '0.82rem', color: 'var(--slate)' }}>
                  Duration: {exam.duration} min · Pass mark: {exam.passMark}% · Closes{' '}
                  {new Date(exam.endDate).toLocaleString()}
                </p>

                {exam.submitted ? (
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="status-pill status-published">Completed</span>
                    <button
                      className="dash-btn"
                      style={{ background: 'transparent', color: 'var(--ink)', border: '1.5px solid #d8d5cb' }}
                      onClick={() => navigate(`/exam/${exam._id}/result`)}
                    >
                      View Result
                    </button>
                  </div>
                ) : (
                  <button
                    className="dash-btn"
                    style={{ marginTop: 14 }}
                    onClick={() => navigate(`/exam/${exam._id}/instructions`)}
                  >
                    Start Exam
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;