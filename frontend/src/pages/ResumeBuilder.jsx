// pages/ResumeBuilder.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GiArtificialHive } from 'react-icons/gi';
import {
  FiUser,
  FiFileText,
  FiBriefcase,
  FiBookOpen,
  FiCode,
  FiFolder,
  FiEye,
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiCheck,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiGlobe,
} from 'react-icons/fi';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const emptyExperience = () => ({
  id: genId(),
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
});

const emptyEducation = () => ({
  id: genId(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: '',
});

const emptyProject = () => ({
  id: genId(),
  name: '',
  techStack: '',
  description: '',
  link: '',
});

const STEPS = [
  { id: 'personal', label: 'Personal Info', icon: FiUser },
  { id: 'summary', label: 'Summary', icon: FiFileText },
  { id: 'experience', label: 'Experience', icon: FiBriefcase },
  { id: 'education', label: 'Education', icon: FiBookOpen },
  { id: 'skills', label: 'Skills', icon: FiCode },
  { id: 'projects', label: 'Projects', icon: FiFolder },
  { id: 'preview', label: 'Preview', icon: FiEye },
];

// --- shared input styles ---
const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#F5A524]/50 focus:ring-1 focus:ring-[#F5A524]/20 transition-colors';
const labelClass = 'text-xs font-medium tracking-wider uppercase text-white/40 mb-2 block';

const Field = ({ label, children }) => (
  <div>
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');
    .font-mono-r { font-family: 'IBM Plex Mono', 'SF Mono', monospace; }
    @media print {
      body * { visibility: hidden; }
      #resume-preview, #resume-preview * { visibility: visible; }
      #resume-preview {
        position: absolute;
        inset: 0;
        width: 100%;
        box-shadow: none !important;
        border: none !important;
      }
      .no-print { display: none !important; }
    }
  `}</style>
);

/* Small underline mark used as a section signature in the resume preview */
const SectionMark = ({ children }) => (
  <div className="mt-6">
    <h2 className="text-xs font-bold tracking-widest uppercase text-black">{children}</h2>
    <div className="h-[3px] w-6 bg-[#F5A524] rounded-full mt-1.5 mb-2.5" />
  </div>
);

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
    },
    summary: '',
    experience: [emptyExperience()],
    education: [emptyEducation()],
    skills: [],
    projects: [emptyProject()],
  });

  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  // --- personal info ---
  const updatePersonal = (field, value) =>
    setFormData((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }));

  // --- generic list helpers (experience / education / projects) ---
  const updateListItem = (listKey, id, field, value) =>
    setFormData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));

  const addListItem = (listKey, factory) =>
    setFormData((prev) => ({ ...prev, [listKey]: [...prev[listKey], factory()] }));

  const removeListItem = (listKey, id) =>
    setFormData((prev) => ({ ...prev, [listKey]: prev[listKey].filter((item) => item.id !== id) }));

  const toggleCurrentRole = (id, checked) =>
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) =>
        item.id === id ? { ...item, current: checked, endDate: checked ? '' : item.endDate } : item
      ),
    }));

  // --- skills ---
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (formData.skills.includes(trimmed)) {
      setSkillInput('');
      return;
    }
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput('');
  };

  const removeSkill = (skill) =>
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  const handleDownload = () => window.print();

  return (
    <div className="bg-[#0E1013] min-h-screen">
      <FontImport />

      {/* ===== NAVBAR ===== */}
      <motion.nav
        className="fixed top-0 left-0 right-0 w-full bg-[#0E1013]/90 backdrop-blur-xl border-b border-white/[0.06] h-[64px] z-50 flex items-center px-6 no-print"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <GiArtificialHive size={26} className="text-white" />
              <span className="font-serif font-bold text-xl text-white tracking-tight">
                CM<span className="text-white/40">.AI</span>
              </span>
            </div>
            <span className="text-xs font-medium tracking-wider uppercase bg-white/5 text-white/50 px-3 py-1 rounded-full border border-white/10">
              Resume Builder
            </span>
          </div>

          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <FiArrowLeft size={15} />
            Back
          </motion.button>
        </div>
      </motion.nav>

      <div className="pt-[64px] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {/* ===== STEP PROGRESS ===== */}
          <div className="no-print mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const active = i === stepIndex;
                const done = i < stepIndex;
                return (
                  <div key={s.id} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.button
                        onClick={() => setStepIndex(i)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                          active
                            ? 'bg-white text-[#0E1013]'
                            : done
                            ? 'bg-[#F5A524] text-[#161615]'
                            : 'bg-white/5 text-white/30 border border-white/10'
                        }`}
                      >
                        {done ? <FiCheck size={15} /> : <Icon size={14} />}
                      </motion.button>
                      <span
                        className={`text-[10px] tracking-wide uppercase hidden sm:block ${
                          active ? 'text-white font-medium' : 'text-white/30'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-2 transition-colors ${
                          i < stepIndex ? 'bg-[#F5A524]/60' : 'bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== MAIN LAYOUT ===== */}
          <div className={`grid grid-cols-1 ${isLast ? '' : 'lg:grid-cols-2'} gap-8 items-start`}>
            {/* ---- FORM PANEL ---- */}
            {!isLast && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#161615] rounded-3xl p-8 shadow-xl shadow-black/10 no-print"
                >
                  <span className="font-mono-r text-[11px] tracking-[0.2em] text-[#F5A524] uppercase">
                    Step {String(stepIndex + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white mt-1 mb-1">{step.label}</h2>
                  <p className="text-white/40 text-sm mb-6">
                    {step.id === 'personal' && 'How recruiters will reach you.'}
                    {step.id === 'summary' && 'A punchy 2-3 sentence pitch.'}
                    {step.id === 'experience' && 'Your work history, most recent first.'}
                    {step.id === 'education' && 'Degrees, diplomas, and certifications.'}
                    {step.id === 'skills' && 'Keywords ATS systems scan for.'}
                    {step.id === 'projects' && 'Things you built worth showing off.'}
                  </p>

                  {/* --- PERSONAL --- */}
                  {step.id === 'personal' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Full Name">
                        <input
                          className={inputClass}
                          value={formData.personal.fullName}
                          onChange={(e) => updatePersonal('fullName', e.target.value)}
                          placeholder="Jane Doe"
                        />
                      </Field>
                      <Field label="Email">
                        <input
                          className={inputClass}
                          value={formData.personal.email}
                          onChange={(e) => updatePersonal('email', e.target.value)}
                          placeholder="jane@example.com"
                        />
                      </Field>
                      <Field label="Phone">
                        <input
                          className={inputClass}
                          value={formData.personal.phone}
                          onChange={(e) => updatePersonal('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </Field>
                      <Field label="Location">
                        <input
                          className={inputClass}
                          value={formData.personal.location}
                          onChange={(e) => updatePersonal('location', e.target.value)}
                          placeholder="City, Country"
                        />
                      </Field>
                      <Field label="LinkedIn">
                        <input
                          className={inputClass}
                          value={formData.personal.linkedin}
                          onChange={(e) => updatePersonal('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/janedoe"
                        />
                      </Field>
                      <Field label="Portfolio / GitHub">
                        <input
                          className={inputClass}
                          value={formData.personal.portfolio}
                          onChange={(e) => updatePersonal('portfolio', e.target.value)}
                          placeholder="github.com/janedoe"
                        />
                      </Field>
                    </div>
                  )}

                  {/* --- SUMMARY --- */}
                  {step.id === 'summary' && (
                    <Field label="Professional Summary">
                      <textarea
                        rows={8}
                        className={inputClass}
                        value={formData.summary}
                        onChange={(e) => setFormData((p) => ({ ...p, summary: e.target.value }))}
                        placeholder="Final-year CS student with hands-on experience building full-stack web apps using React, Node.js, and MongoDB..."
                      />
                      <p className="text-xs text-white/25 mt-2">
                        Tip: mention your role, core stack, and one measurable achievement.
                      </p>
                    </Field>
                  )}

                  {/* --- EXPERIENCE --- */}
                  {step.id === 'experience' && (
                    <div className="space-y-6">
                      {formData.experience.map((exp, i) => (
                        <div
                          key={exp.id}
                          className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium tracking-wider uppercase text-white/30">
                              Role {i + 1}
                            </span>
                            {formData.experience.length > 1 && (
                              <button
                                onClick={() => removeListItem('experience', exp.id)}
                                className="text-white/30 hover:text-red-400 transition-colors"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              className={inputClass}
                              placeholder="Job Title"
                              value={exp.title}
                              onChange={(e) => updateListItem('experience', exp.id, 'title', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => updateListItem('experience', exp.id, 'company', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="Location"
                              value={exp.location}
                              onChange={(e) => updateListItem('experience', exp.id, 'location', e.target.value)}
                            />
                            <div className="flex gap-2">
                              <input
                                className={inputClass}
                                placeholder="Start (e.g. Jun 2025)"
                                value={exp.startDate}
                                onChange={(e) => updateListItem('experience', exp.id, 'startDate', e.target.value)}
                              />
                              <input
                                className={inputClass}
                                placeholder="End"
                                value={exp.current ? 'Present' : exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => updateListItem('experience', exp.id, 'endDate', e.target.value)}
                              />
                            </div>
                          </div>

                          <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => toggleCurrentRole(exp.id, e.target.checked)}
                              className="accent-[#F5A524] w-3.5 h-3.5"
                            />
                            I currently work here
                          </label>

                          <textarea
                            rows={4}
                            className={inputClass}
                            placeholder={'One bullet point per line, e.g.\nBuilt reusable UI components with React and Tailwind\nCut page load time by 30% via code splitting'}
                            value={exp.description}
                            onChange={(e) => updateListItem('experience', exp.id, 'description', e.target.value)}
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => addListItem('experience', emptyExperience)}
                        className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-white/30 text-white/50 hover:text-white text-sm py-3 rounded-xl transition-colors"
                      >
                        <FiPlus size={15} /> Add another role
                      </button>
                    </div>
                  )}

                  {/* --- EDUCATION --- */}
                  {step.id === 'education' && (
                    <div className="space-y-6">
                      {formData.education.map((edu, i) => (
                        <div
                          key={edu.id}
                          className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium tracking-wider uppercase text-white/30">
                              Education {i + 1}
                            </span>
                            {formData.education.length > 1 && (
                              <button
                                onClick={() => removeListItem('education', edu.id)}
                                className="text-white/30 hover:text-red-400 transition-colors"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              className={inputClass}
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) => updateListItem('education', edu.id, 'institution', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="Degree (e.g. B.Tech)"
                              value={edu.degree}
                              onChange={(e) => updateListItem('education', edu.id, 'degree', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="Field of Study"
                              value={edu.field}
                              onChange={(e) => updateListItem('education', edu.id, 'field', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="GPA / Percentage (optional)"
                              value={edu.gpa}
                              onChange={(e) => updateListItem('education', edu.id, 'gpa', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="Start Year"
                              value={edu.startDate}
                              onChange={(e) => updateListItem('education', edu.id, 'startDate', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="End Year"
                              value={edu.endDate}
                              onChange={(e) => updateListItem('education', edu.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addListItem('education', emptyEducation)}
                        className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-white/30 text-white/50 hover:text-white text-sm py-3 rounded-xl transition-colors"
                      >
                        <FiPlus size={15} /> Add another degree
                      </button>
                    </div>
                  )}

                  {/* --- SKILLS --- */}
                  {step.id === 'skills' && (
                    <div>
                      <Field label="Add a skill">
                        <div className="flex gap-2">
                          <input
                            className={inputClass}
                            placeholder="e.g. React.js — press Enter to add"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill();
                              }
                            }}
                          />
                          <button
                            onClick={addSkill}
                            className="shrink-0 bg-white text-black px-4 rounded-xl text-sm font-medium hover:bg-white/90 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </Field>
                      <div className="flex flex-wrap gap-2 mt-5">
                        {formData.skills.length === 0 && (
                          <p className="text-white/25 text-sm">No skills added yet.</p>
                        )}
                        {formData.skills.map((skill) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full"
                          >
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="text-white/40 hover:text-white">
                              &times;
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- PROJECTS --- */}
                  {step.id === 'projects' && (
                    <div className="space-y-6">
                      {formData.projects.map((proj, i) => (
                        <div
                          key={proj.id}
                          className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium tracking-wider uppercase text-white/30">
                              Project {i + 1}
                            </span>
                            {formData.projects.length > 1 && (
                              <button
                                onClick={() => removeListItem('projects', proj.id)}
                                className="text-white/30 hover:text-red-400 transition-colors"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                              className={inputClass}
                              placeholder="Project Name"
                              value={proj.name}
                              onChange={(e) => updateListItem('projects', proj.id, 'name', e.target.value)}
                            />
                            <input
                              className={inputClass}
                              placeholder="Tech Stack (e.g. React, Node, MongoDB)"
                              value={proj.techStack}
                              onChange={(e) => updateListItem('projects', proj.id, 'techStack', e.target.value)}
                            />
                          </div>
                          <input
                            className={inputClass}
                            placeholder="Live link (optional)"
                            value={proj.link}
                            onChange={(e) => updateListItem('projects', proj.id, 'link', e.target.value)}
                          />
                          <textarea
                            rows={3}
                            className={inputClass}
                            placeholder="What it does, what you built, any measurable impact"
                            value={proj.description}
                            onChange={(e) => updateListItem('projects', proj.id, 'description', e.target.value)}
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => addListItem('projects', emptyProject)}
                        className="w-full inline-flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-white/30 text-white/50 hover:text-white text-sm py-3 rounded-xl transition-colors"
                      >
                        <FiPlus size={15} /> Add another project
                      </button>
                    </div>
                  )}

                  {/* --- NAV BUTTONS --- */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <button
                      onClick={goBack}
                      disabled={isFirst}
                      className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                        isFirst ? 'text-white/15 cursor-not-allowed' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <FiArrowLeft size={15} /> Previous
                    </button>
                    <button
                      onClick={goNext}
                      className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
                    >
                      {stepIndex === STEPS.length - 2 ? 'Preview Resume' : 'Next'}
                      <FiArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* ---- LIVE PREVIEW PANEL (ATS-friendly) ---- */}
            <div className={isLast ? 'max-w-3xl mx-auto w-full' : ''}>
              {isLast && (
                <div className="flex items-center justify-between mb-5 no-print">
                  <div>
                    <span className="font-mono-r text-[11px] tracking-widest uppercase text-white/30">
                      Step {STEPS.length} of {STEPS.length}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-white mt-1">Your resume is ready</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={goBack}
                      className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                    >
                      <FiArrowLeft size={14} /> Edit
                    </button>
                    <motion.button
                      onClick={handleDownload}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 bg-white text-[#0E1013] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/90 transition-colors shadow-lg shadow-black/40"
                    >
                      <FiDownload size={14} /> Download PDF
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Resume sheet — plain, single-column, ATS-friendly layout */}
              <motion.div
                id="resume-preview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white text-black rounded-2xl shadow-xl shadow-black/5 border border-black/5 p-10 font-sans"
                style={{ minHeight: isLast ? '600px' : 'auto' }}
              >
                <h1 className="text-[26px] font-bold tracking-tight">
                  {formData.personal.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-xs text-black/60">
                  {formData.personal.email && (
                    <span className="inline-flex items-center gap-1">
                      <FiMail size={11} /> {formData.personal.email}
                    </span>
                  )}
                  {formData.personal.phone && (
                    <span className="inline-flex items-center gap-1">
                      <FiPhone size={11} /> {formData.personal.phone}
                    </span>
                  )}
                  {formData.personal.location && (
                    <span className="inline-flex items-center gap-1">
                      <FiMapPin size={11} /> {formData.personal.location}
                    </span>
                  )}
                  {formData.personal.linkedin && (
                    <span className="inline-flex items-center gap-1">
                      <FiLinkedin size={11} /> {formData.personal.linkedin}
                    </span>
                  )}
                  {formData.personal.portfolio && (
                    <span className="inline-flex items-center gap-1">
                      <FiGlobe size={11} /> {formData.personal.portfolio}
                    </span>
                  )}
                </div>
                <div className="h-px bg-black/10 mt-4" />

                {formData.summary && (
                  <section>
                    <SectionMark>Summary</SectionMark>
                    <p className="text-sm leading-relaxed text-black/80">{formData.summary}</p>
                  </section>
                )}

                {formData.skills.length > 0 && (
                  <section>
                    <SectionMark>Skills</SectionMark>
                    <p className="text-sm text-black/80">{formData.skills.join('  \u00b7  ')}</p>
                  </section>
                )}

                {formData.experience.some((e) => e.title || e.company) && (
                  <section>
                    <SectionMark>Experience</SectionMark>
                    <div className="space-y-4">
                      {formData.experience
                        .filter((e) => e.title || e.company)
                        .map((exp) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-baseline flex-wrap gap-x-2">
                              <p className="text-sm font-semibold">
                                {exp.title}
                                {exp.company ? ` — ${exp.company}` : ''}
                              </p>
                              <span className="font-mono-r text-[11px] text-black/40 tracking-tight">
                                {exp.startDate} {exp.startDate || exp.endDate || exp.current ? '–' : ''}{' '}
                                {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            {exp.location && <p className="text-xs text-black/40">{exp.location}</p>}
                            {exp.description && (
                              <ul className="mt-1.5 space-y-1 list-disc list-inside">
                                {exp.description
                                  .split('\n')
                                  .filter(Boolean)
                                  .map((line, idx) => (
                                    <li key={idx} className="text-sm text-black/70 leading-relaxed">
                                      {line}
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {formData.projects.some((p) => p.name) && (
                  <section>
                    <SectionMark>Projects</SectionMark>
                    <div className="space-y-3">
                      {formData.projects
                        .filter((p) => p.name)
                        .map((proj) => (
                          <div key={proj.id}>
                            <p className="text-sm font-semibold">
                              {proj.name}
                              {proj.techStack ? (
                                <span className="font-normal text-black/50"> — {proj.techStack}</span>
                              ) : null}
                            </p>
                            {proj.description && (
                              <p className="text-sm text-black/70 leading-relaxed mt-0.5">{proj.description}</p>
                            )}
                            {proj.link && (
                              <p className="font-mono-r text-[11px] text-black/40 mt-0.5">{proj.link}</p>
                            )}
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {formData.education.some((e) => e.institution) && (
                  <section>
                    <SectionMark>Education</SectionMark>
                    <div className="space-y-2">
                      {formData.education
                        .filter((e) => e.institution)
                        .map((edu) => (
                          <div key={edu.id} className="flex justify-between items-baseline flex-wrap gap-x-2">
                            <p className="text-sm">
                              <span className="font-semibold">{edu.institution}</span>
                              {edu.degree ? ` — ${edu.degree}` : ''}
                              {edu.field ? `, ${edu.field}` : ''}
                              {edu.gpa ? ` (${edu.gpa})` : ''}
                            </p>
                            <span className="font-mono-r text-[11px] text-black/40 tracking-tight">
                              {edu.startDate} {edu.startDate || edu.endDate ? '–' : ''} {edu.endDate}
                            </span>
                          </div>
                        ))}
                    </div>
                  </section>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;