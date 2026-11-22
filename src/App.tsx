import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/sections/Navbar';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';
import { ProjectModal } from './components/ui/ProjectModal';
import { Toast, ToastProps } from './components/ui/Toast';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Project } from './types/portfolio';

const PortfolioApp: React.FC = () => {
  const { isAdmin } = usePortfolio();

  // Modals & Panels
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastProps['type'] } | null>(null);

  // Check URL path or hash for /admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        if (isAdmin) {
          setShowAdminDashboard(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, [isAdmin]);

  const showToast = (message: string, type: ToastProps['type'] = 'success') => {
    setToast({ message, type });
  };

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setShowAdminDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
    showToast('Admin authenticated successfully!');
  };

  const handleCloseAdminDashboard = () => {
    setShowAdminDashboard(false);
    // Reset url hash/path if on /admin
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-cyber-purple selection:text-white">
      {/* Navigation */}
      <Navbar onOpenAdmin={handleOpenAdmin} />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Projects onSelectProject={(project) => setSelectedProject(project)} />
        <Contact onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Project Screenshot Gallery Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Full Admin Dashboard */}
      {showAdminDashboard && (
        <AdminDashboard
          onClose={handleCloseAdminDashboard}
          onShowToast={showToast}
          onPreviewProject={(proj) => setSelectedProject(proj)}
          onRequireLogin={() => setShowAdminLogin(true)}
        />
      )}

      {/* Global Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
};

export default App;

