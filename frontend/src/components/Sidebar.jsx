// components/Sidebar.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { GiArtificialHive } from 'react-icons/gi';
import {
  FiFileText,
  FiMap,
  FiFilter,
  FiMail,
  FiMenu,
  FiX,
  FiPlus,
  FiHome,
  FiList,
  FiUserCheck,
  FiLogOut
} from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';
import api from '../utils/api.js';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, setUser } from '../redux/authSlice.js';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const agentItems = [
    { icon: FiFileText, label: 'Resume Builder', link: '/resume-builder' },
    { icon: FiMap, label: 'Roadmap Builder', link: '/roadmap' },
    { icon: FiFilter, label: 'Resume Scorer', link: '/scorer' },
  ];

  const goTo = (link) => {
    navigate(link);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const isActive = (link) => location.pathname === link;

  const handleLogout = async () => {
    try {
      const response = await api('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        dispatch(setAuth(false));
        dispatch(setUser(null));
        navigate('/', { replace: true });
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={toggleSidebar}
        className="fixed top-2 left-4 z-50 bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-72 bg-[#FAF9F6] text-black z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <GiArtificialHive size={32} className="text-black" />
                  <span className="font-serif text-xl font-bold tracking-tight">
                    CM<span className="text-black/40">.AI</span>
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Create Interview Button */}
                <motion.button
                  onClick={() => goTo('/create-interview')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black text-white hover:bg-black/85 rounded-xl p-3 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium text-sm">+ Create Interview</span>
                  <FiPlus size={18} className="text-white/60" />
                </motion.button>

                {/* Agents Section */}
                <div>
                  <h3 className="text-xs font-medium tracking-widest uppercase text-black/30 mb-3">
                    Agents
                  </h3>
                  <div className="space-y-1">
                    {agentItems.map((item, idx) => (
                      <motion.button
                        onClick={() => goTo(item.link)}
                        key={idx}
                        whileHover={{ x: 4 }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                          isActive(item.link)
                            ? 'bg-black text-white'
                            : 'text-black/70 hover:bg-black/5 hover:text-black'
                        }`}
                      >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-black/10 space-y-4">
                {/* Interview Coins */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-yellow-500/15 to-yellow-600/5 rounded-xl p-4 border border-yellow-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/15 flex items-center justify-center">
                      <FaCoins className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-black/40 tracking-wider">INTERVIEW COINS</p>
                      <p className="text-xl font-bold text-yellow-600">{user.interviewCoin || 0}</p>
                    </div>
                  </div>
                </motion.div>

                {/* User Profile */}
                <motion.div
                  onClick={() => goTo('/profile')}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                  className="rounded-xl p-3 border border-black/5 mt-auto cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.username || 'User'}</p>
                      <p className="text-xs text-black/40 truncate flex items-center gap-1">
                        <FiMail size={12} />
                        {user.email || ''}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ x: 4 }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 transition-colors text-sm text-black/70 hover:text-black"
                >
                  <FiLogOut size={18} />
                  <span>Log out</span>
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;