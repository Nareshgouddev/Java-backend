import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Create from './pages/Create';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Post from './pages/Post';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const profileStr = localStorage.getItem('bytelog_profile');
  if (!profileStr) {
    return <Navigate to="/login" replace />;
  }
  
  const profile = JSON.parse(profileStr);
  if (requireAdmin && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AuthRoute = ({ children }) => {
  const profile = localStorage.getItem('bytelog_profile');
  if (profile) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
            
            {/* Public/Auth Routes */}
            <Route path="/post/:id" element={<Post />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/deepdive" element={<div style={{padding: '5rem', color: 'white', fontFamily: 'var(--mono)', fontSize: '0.8rem'}}>// ARCHIVES CORRUPTED. AWAITING DECRYPTION.</div>} />
            <Route path="/opensource" element={<div style={{padding: '5rem', color: 'white'}}>Open Source Placeholder</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
