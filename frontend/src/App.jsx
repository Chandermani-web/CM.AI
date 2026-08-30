import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { getCurrentUser } from './apis/user.api.js';
import Scorer from './pages/Scorer.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setAuth } from './redux/authSlice.js';
import { setResume } from './redux/resumeSlice.js';
import { getResume } from './apis/resume.api.js';
import ResumeBuilder from './pages/ResumeBuilder.jsx';

const App = () => {
  const dispatch = useDispatch();
  const { user, auth } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const getUser = async () => {
      const data = await getCurrentUser();
      dispatch(setUser(data));
      dispatch(setAuth(!!data));
      setLoading(false);
    };

    getUser();
  }, []);

  useEffect(() => {
    
    const getUser = async () => {
      const data = await getResume();
      dispatch(setResume(data));
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return <div className="loading fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
      </div>  
    </div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={auth ? <Navigate to="/dashboard" replace/> : <Home />} />
        <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/scorer" element={auth ? <Scorer /> : <Navigate to="/" replace />} />
        <Route path="/resume-builder" element={auth ? <ResumeBuilder /> : <Navigate to="/" replace />} />
        <Route path="/" element={<Navigate to={auth ? "/dashboard" : "/"} replace />} />
      </Routes>
    </>
  )
}

export default App
