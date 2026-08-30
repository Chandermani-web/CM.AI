import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GiArtificialHive } from 'react-icons/gi';
import {
  FiFileText,
  FiMap,
  FiFilter,
  FiCheckCircle,
  FiUser,
  FiCpu,
  FiArrowUpRight,
  FiCalendar,
  FiTrendingUp,
  FiArrowRight,
} from 'react-icons/fi';
import LoginModal from '../components/LoginModal.jsx';

// --- Animation presets for reuse ---
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const agents = [
    {
      no: '01',
      icon: FiFileText,
      title: 'Resume Agent',
      desc: 'Builds ATS-friendly resumes, sharpens your profile, and widens the funnel of interviews you land.',
    },
    {
      no: '02',
      icon: FiUser,
      title: 'Interview Agent',
      desc: 'Runs realistic HR, technical, and coding interviews through live AI-powered simulations.',
    },
    {
      no: '03',
      icon: FiCheckCircle,
      title: 'Feedback Agent',
      desc: 'Breaks down every answer with scoring reports and specific, actionable improvements.',
    },
    {
      no: '04',
      icon: FiMap,
      title: 'Roadmap Agent',
      desc: 'Maps a personalized study plan from your goals, current skills, and past performance.',
    },
  ];

  const stats = [
    { value: '21', label: 'Total interviews', icon: FiFileText },
    { value: '126', label: 'Interviews completed', icon: FiCheckCircle },
    { value: '15', label: 'Interviews scheduled', icon: FiCalendar },
    { value: '77%', label: 'Pass rate', icon: FiTrendingUp },
  ];

  const tools = [
    {
      icon: FiFileText,
      title: 'Resume builder',
      desc: 'Turn your experience into a resume that clears ATS screens.',
    },
    {
      icon: FiMap,
      title: 'Roadmap builder',
      desc: 'Get a study plan mapped to the role you actually want.',
    },
    {
      icon: FiFilter,
      title: 'Resume sorter',
      desc: 'Rank and shortlist resumes against a role in seconds.',
    },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen overflow-x-hidden">
      {/* ===== NAVBAR ===== */}
      <motion.nav
        className="fixed top-0 left-0 right-0 w-full bg-[#FAF9F6]/90 backdrop-blur-xl border-b border-black/5 h-[64px] z-50 flex items-center px-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <GiArtificialHive size={26} className="text-black" />
            </motion.div>
            <span className="font-serif font-bold text-xl text-black tracking-tight">
              CM<span className="text-black/40">.AI</span>
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <motion.button
              onClick={openLoginModal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-white hover:text-black border border-black transition-all duration-300 text-sm shadow-sm hover:shadow-lg"
            >
              Log in
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ===== HERO ===== */}
      <div className="pt-[64px]">
        <div className="bg-[#FAF9F6] border-b border-black/5 min-h-[440px] flex items-center relative overflow-hidden">
          {/* Decorative corner accents */}
          <div className="hidden md:block absolute top-12 right-12 w-12 h-12 border-t-2 border-r-2 border-black/10" />
          <div className="hidden md:block absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-black/10" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-black/5 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-6 py-20 w-full relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 border border-black/15 px-4 py-1.5 rounded-full mb-6 bg-white/50 backdrop-blur-sm"
              >
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/40" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-black" />
                </span>
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-black/60">
                  AI-powered interview prep
                </span>
              </motion.div>

              <h1 className="font-serif text-5xl md:text-7xl font-bold text-black mb-6 leading-[1.05] tracking-tight">
                Job interviews don't
                <br />
                <span className="relative">
                  have to suck anymore.
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1 bg-black/10 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  />
                </span>
              </h1>
              <p className="text-lg text-black/50 max-w-xl mb-10 leading-relaxed">
                CM.AI is an innovative AI-powered interview preparation platform
                designed to help job seekers excel in their interviews.
              </p>
              <motion.button
                className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-medium shadow-lg shadow-black/20 hover:shadow-black/40 transition-shadow duration-300"
                onClick={openLoginModal}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              >
                Get started for free
                <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== DASHBOARD ===== */}
      <div className="max-w-7xl mx-auto px-6 pt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUp}
          className="flex items-end justify-between mb-5"
        >
          <div>
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-black/30">
              Your dashboard
            </span>
            <h2 className="font-serif text-3xl font-bold text-black mt-1">Interview history</h2>
          </div>
        </motion.div>

        {/* Stats Ribbon */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="bg-[#161615] rounded-3xl grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10 overflow-hidden mb-14 shadow-xl shadow-black/5"
        >
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                variants={fadeUp}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                className="p-6 md:p-8 transition-colors duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="inline-block"
                >
                  <Icon className="text-white/30 mb-4" size={20} />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-serif text-3xl md:text-4xl font-bold text-white"
                >
                  {s.value}
                </motion.p>
                <p className="text-xs text-white/40 mt-1.5 tracking-wider">{s.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex items-end justify-between mb-5"
        >
          <div>
            <span className="text-xs font-medium tracking-[0.15em] uppercase text-black/30">
              Quick actions
            </span>
            <h2 className="font-serif text-3xl font-bold text-black mt-1">
              Pick up where you left off
            </h2>
          </div>
          <motion.button
            onClick={openLoginModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="hidden sm:inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/90 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-black/40 shrink-0"
          >
            Create interview
            <FiArrowUpRight size={15} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.button
                key={tool.title}
                onClick={openLoginModal}
                variants={fadeUp}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                whileTap={{ scale: 0.97 }}
                className="group text-left bg-white border border-black/5 rounded-2xl p-6 hover:border-black/20 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <motion.div
                    whileHover={{ rotate: -8, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-md"
                  >
                    <Icon className="text-white" size={20} />
                  </motion.div>
                  <FiArrowRight
                    className="text-black/20 group-hover:text-black group-hover:translate-x-1 transition-all duration-300"
                    size={16}
                  />
                </div>
                <h3 className="font-semibold text-black mb-1.5 text-lg">{tool.title}</h3>
                <p className="text-sm text-black/50 leading-relaxed">{tool.desc}</p>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* ===== AI AGENTS ===== */}
      <div className="max-w-6xl mx-auto px-6 py-28 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 border border-black/10 rounded-full px-5 py-1.5 mb-6 bg-white/60 backdrop-blur-sm shadow-sm"
          >
            <FiCpu size={14} className="text-black/60" />
            <span className="text-xs font-medium tracking-[0.1em] uppercase text-black/60">
              AI powered agents
            </span>
          </motion.div>

          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4">
            <span className="text-black">Specialized agents for</span>
            <br />
            <span className="text-black/30">every interview stage</span>
          </h2>

          <p className="text-black/50 max-w-xl mx-auto mb-16 leading-relaxed">
            CM.AI combines multiple AI agents that work together to help you build your resume,
            practice interviews, receive detailed feedback, and follow a personalized roadmap.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left"
        >
          {agents.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.no}
                variants={fadeUp}
                whileHover={{
                  y: -10,
                  backgroundColor: '#1e1e1c',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="bg-[#161615] rounded-3xl p-7 transition-all duration-300 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-8"
                >
                  <Icon className="text-white" size={20} />
                </motion.div>
                <h3 className="text-white font-semibold text-lg mb-2">{agent.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{agent.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ===== LOGIN MODAL ===== */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default Home;