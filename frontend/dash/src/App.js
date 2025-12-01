import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Account from './pages/Account';
import Create from './pages/Create';
import Verify from './pages/Verify';
import Delete from './pages/Delete';
import UploadHistory from './pages/UploadHistory';
import Support from './pages/Support';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import Header from './components/Header';
import SidebarNav from './components/SidebarNav';
import About from './components/About';
import Contact from './components/Contact';
import Blog from './components/Blog';
import Features from './components/Features';
import FaqQ from './components/FaqQ';
import Res1 from './pages/Res1';
import Res2 from './pages/Res2';
import Res3 from './pages/Res3';
import './App.css';

// Dashboard layout wrapper
function DashboardLayout() {
  const [activePage, setActivePage] = React.useState('account');
  const [navOpen, setNavOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 600);
  const mainRef = React.useRef(null);

  React.useEffect(() => {
    if (activePage === 'chat' && mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activePage]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
      if (window.innerWidth > 600) setNavOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-root">
      <Header isMobile={isMobile} navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="dashboard-content-row">
        <SidebarNav
          activePage={activePage}
          setActivePage={setActivePage}
          isMobile={isMobile}
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
        <main
          className="dashboard-main"
          ref={mainRef}
          style={isMobile && navOpen ? { filter: 'blur(2px)', pointerEvents: 'none' } : {}}
        >
          {activePage === 'account' && <Account />}
          {activePage === 'verify-download' && <Verify />}
          {activePage === 'create' && <Create />}
          {activePage === 'delete' && <Delete />}
          {activePage === 'history' && <UploadHistory />}
          {activePage === 'support' && <Support />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/faq" element={<FaqQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/dash" element={<DashboardLayout />} />
        <Route path="/res1" element={<Res1 />} />
        <Route path="/res2" element={<Res2 />} />
        <Route path="/res3" element={<Res3 />} />
      </Routes>
    </Router>
  );
}

export default App;
