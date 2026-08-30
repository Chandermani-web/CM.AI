import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GiArtificialHive } from 'react-icons/gi';
import { FiUploadCloud, FiFile, FiX, FiArrowUpRight, FiArrowLeft, FiRefreshCw, FiCheckCircle, FiAlertTriangle, FiZap, FiTrendingUp, FiUser } from 'react-icons/fi';
import api from '../utils/api.js';
import { useDispatch, useSelector } from 'react-redux';
import { setResume } from '../redux/resumeSlice.js';
import { setUser } from "../redux/authSlice.js";
import { useCoin } from '../apis/user.api.js';

const MAX_SIZE_MB = 20;

const ratingLabel = (score) => {
  if (score >= 85) return 'Strong';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Average';
  return 'Needs Work';
};

const ScoreRing = ({ score }) => {
  const r = 46;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score || 0));
  return (
    <div className="relative w-[110px] h-[110px] shrink-0">
      <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
        <motion.circle
          cx="55" cy="55" r={r} fill="none" stroke="#a855f7" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (pct / 100) * c }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-serif text-2xl font-bold text-white">
          {pct}<span className="text-sm text-white/30">/100</span>
        </span>
      </div>
    </div>
  );
};

const Tag = ({ children, tone }) => {
  const tones = {
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };
  return (
    <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${tones[tone]}`}>
      {children}
    </span>
  );
};

const Card = ({ icon: Icon, iconColor, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-[#161615] rounded-2xl p-6 shadow-lg shadow-black/10"
  >
    <div className="flex items-center gap-2 mb-4">
      <Icon size={15} className={iconColor} />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </motion.div>
);

const Scorer = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const resume = useSelector((state) => state.resume.resume);
  const user = useSelector((state) => state.auth.user);

  const validateAndSetFile = (selected) => {
    if (!selected) return;
    if (selected.type !== 'application/pdf') return setError('Only PDF files are supported.');
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) return setError(`File must be under ${MAX_SIZE_MB}MB.`);
    setError('');
    setFile(selected);
  };

  const handleContinue = async () => {
    if (!file) return alert('Please upload a file before continuing.');
    try {
      setLoading(true);
      setError('');

      const coinResponse = await useCoin({ coins: 5, action: 'resume-scorer' });
      if (!coinResponse?.success) {
        setError(coinResponse?.message || 'Something went wrong while deducting coins.');
        return;
      }

      console.log(`Coin deduction successful. New interviewCoin balance: ${coinResponse.interviewCoin}`);

      dispatch(
        setUser({
          ...user,
          interviewCoin: coinResponse.interviewCoin,
        })
      );

      const formdata = new FormData();
      formdata.append('resume', file);
      const response = await api('/api/resume/upload', { method: 'POST', body: formdata });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        setError(data?.message || 'Something went wrong while analyzing your resume.');
        return;
      }
      dispatch(setResume(data?.data));
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReupload = () => {
    dispatch(setResume(null));
    setFile(null);
    setError('');
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <motion.nav
        className="fixed top-0 left-0 right-0 w-full bg-[#FAF9F6]/90 backdrop-blur-xl border-b border-black/5 h-[64px] z-50 flex items-center px-6"
        initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <GiArtificialHive size={24} className="text-black" />
            <span className="font-serif font-bold text-lg text-black">CM<span className="text-black/40">.AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            {resume && (
              <button onClick={handleReupload} className="text-xs font-medium bg-black/5 text-black/60 hover:text-black px-3 py-1.5 rounded-full transition-colors">
                Re-upload
              </button>
            )}
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-black/50 hover:text-black transition-colors">
              <FiArrowLeft size={14} /> Back
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        {!resume ? (
          <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="pt-[64px] min-h-screen flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#161615] rounded-3xl p-8 w-full max-w-md shadow-xl">
              <h2 className="font-serif text-3xl font-bold text-white mb-2">Upload Your Resume</h2>
              <p className="text-white/40 mb-8">We'll score it and give you actionable feedback.</p>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); validateAndSetFile(e.dataTransfer.files?.[0]); }}
                onClick={() => inputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center text-center cursor-pointer transition-colors ${dragActive ? 'border-white/60 bg-white/5' : 'border-white/15 hover:border-white/30'}`}
              >
                <input ref={inputRef} type="file" accept="application/pdf" onChange={(e) => validateAndSetFile(e.target.files?.[0])} className="hidden" />
                {!file ? (
                  <>
                    <FiUploadCloud className="text-white mb-4" size={26} />
                    <p className="text-white font-medium">Drop your resume, or <span className="underline">browse</span></p>
                    <p className="text-xs text-white/30 mt-2">PDF only &middot; Max {MAX_SIZE_MB}MB</p>
                  </>
                ) : (
                  <>
                    <FiFile className="text-white mb-4" size={22} />
                    <p className="text-white font-semibold break-all">{file.name}</p>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white">
                      <FiX size={13} /> Remove
                    </button>
                  </>
                )}
              </div>

              {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}

              <button
                onClick={handleContinue}
                disabled={!file || loading}
                className={`w-full mt-8 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-medium text-sm transition-colors ${file && !loading ? 'bg-white text-black hover:bg-white/90' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
                <FiArrowUpRight size={15} />
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="pt-[100px] px-6 pb-16 max-w-4xl mx-auto space-y-5">
            <div>
              <span className="text-xs font-medium tracking-widest uppercase text-black/30">Resume Analysis</span>
              <h1 className="font-serif text-3xl font-bold text-black mt-1">{resume.name || 'Your Resume'}</h1>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#161615] rounded-2xl p-6 flex items-center gap-6 shadow-lg shadow-black/10">
              <ScoreRing score={resume.score} />
              <div>
                <p className="text-xs text-white/30 tracking-wider uppercase">Resume Score</p>
                <p className="font-serif text-xl font-bold text-white">{ratingLabel(resume.score)}</p>
                {resume.suggestedRole && (
                  <p className="inline-flex items-center gap-1.5 text-sm text-white/50 mt-1">
                    <FiUser size={13} /> {resume.suggestedRole}
                  </p>
                )}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {resume.strengths?.length > 0 && (
                <Card icon={FiCheckCircle} iconColor="text-green-400" title="Strengths">
                  {resume.strengths.map((s, i) => <Tag key={i} tone="green">{s}</Tag>)}
                </Card>
              )}
              {resume.weaknesses?.length > 0 && (
                <Card icon={FiAlertTriangle} iconColor="text-amber-400" title="Weaknesses">
                  {resume.weaknesses.map((w, i) => <Tag key={i} tone="amber">{w}</Tag>)}
                </Card>
              )}
            </div>

            {resume.missingSkills?.length > 0 && (
              <Card icon={FiZap} iconColor="text-red-400" title="Missing Skills">
                {resume.missingSkills.map((s, i) => <Tag key={i} tone="red">{s}</Tag>)}
              </Card>
            )}

            {resume.recommendations?.length > 0 && (
              <Card icon={FiTrendingUp} iconColor="text-purple-400" title="Recommendations">
                {resume.recommendations.map((r, i) => <Tag key={i} tone="purple">{r}</Tag>)}
              </Card>
            )}

            <div className="flex justify-center pt-4">
              <button onClick={handleReupload} className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/85 transition-colors">
                <FiRefreshCw size={14} /> Analyze another resume
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scorer;