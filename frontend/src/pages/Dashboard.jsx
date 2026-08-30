// Dashboard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';

const Dashboard = (user, setAuth) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} user={user} setAuth={setAuth} />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`pt-16 px-6 transition-all duration-300 ${
          isSidebarOpen ? 'ml-72' : 'ml-0'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-black mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-black/60 text-lg">
            Manage your interviews, track progress, and land your dream job.
          </p>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;