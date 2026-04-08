import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [auth, setAuth] = useState({ isAuthenticated: false, role: 'user' });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Keep internal state in sync with URL
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Check auth status continuously
  useEffect(() => {
    const checkAuth = () => {
      const profileStr = localStorage.getItem('bytelog_profile');
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        setAuth({ isAuthenticated: true, role: profile.role || 'user' });
      } else {
        setAuth({ isAuthenticated: false, role: 'user' });
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate(`/?search=${encodeURIComponent(val)}`);
    } else {
      if (val) {
        setSearchParams({ search: val });
      } else {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('search');
        setSearchParams(newParams);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bytelog_profile');
    setAuth({ isAuthenticated: false, role: 'user' });
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? "text-blog-text" : "text-blog-textMuted";

  return (
    <header className="sticky top-0 z-50 bg-[#0e0f11]/90 backdrop-blur-md border-b border-blog-border">
      <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between gap-8">
        
        <div className="flex items-center gap-8 flex-1">
          <Link to="/" className="font-mono text-[1.05rem] font-bold text-white flex items-center gap-1.5 tracking-tight group shrink-0">
            ByteLog
            <span className="text-blog-accent group-hover:animate-none">{'{…}'}</span>
            <span className="inline-block w-[9px] h-[1.1em] bg-blog-accent align-bottom animate-blink"></span>
          </Link>

          {/* Search Bar */}
          <div className="relative max-w-sm w-full hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blog-textDim group-focus-within:text-blog-accent transition-colors" size={14} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="SEARCH_REGISTRY..."
              className="w-full bg-blog-bg/50 border border-blog-border rounded pl-9 pr-4 py-1.5 font-mono text-[0.7rem] text-white outline-none focus:border-blog-accent transition-all placeholder:text-blog-textDim"
            />
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-7">
          <Link to="/" className={`font-mono text-xs tracking-wider uppercase transition-colors hover:text-blog-accent relative before:content-['//_'] before:text-blog-accentDim before:text-[0.72rem] ${isActive('/')}`}>
            Home
          </Link>
          <Link to="/about" className={`font-mono text-xs tracking-wider uppercase transition-colors hover:text-blog-accent relative before:content-['//_'] before:text-blog-accentDim before:text-[0.72rem] ${isActive('/about')}`}>
            About
          </Link>
          
          {auth.isAuthenticated && (
            <Link to="/create" className={`font-mono text-xs tracking-wider uppercase transition-colors hover:text-blog-accent relative before:content-['//_'] before:text-blog-accentDim before:text-[0.72rem] ${isActive('/create')}`}>
              Draft
            </Link>
          )}

          {auth.isAuthenticated && auth.role === 'admin' && (
            <Link to="/admin" className={`font-mono text-xs tracking-wider uppercase transition-colors hover:text-blog-accent relative before:content-['//_'] before:text-blog-accentDim before:text-[0.72rem] ${isActive('/admin')}`}>
              Admin
            </Link>
          )}
          <span className="font-mono text-[0.7rem] bg-blog-accentDim text-blog-accent border border-blog-accent px-2.5 py-1 rounded-sm">V2.0</span>
        </nav>

        {/* Right Corner: Auth & Profile */}
        <div className="flex items-center gap-4">
          {!auth.isAuthenticated ? (
            <>
              <Link to="/login" className="font-mono text-xs px-4 py-2 text-blog-textMuted border border-transparent rounded hover:text-white transition-colors">
                LOGIN
              </Link>
              <Link to="/register" className="font-mono text-xs font-bold px-4 py-2 bg-white text-black border border-white rounded hover:bg-transparent hover:text-white transition-all">
                JOIN
              </Link>
            </>
          ) : (
             <>
               <Link to="/profile" className={`font-mono text-[0.75rem] px-4 py-2 bg-blog-card border border-blog-border rounded hover:border-blog-accent hover:text-blog-accent transition-colors ${isActive('/profile')}`}>
                 PROFILE
               </Link>
               <button onClick={handleLogout} className="font-mono text-xs px-4 py-2 text-[rgba(249,115,22,0.8)] border border-[rgba(249,115,22,0.3)] rounded hover:bg-[rgba(249,115,22,0.1)] transition-colors">
                 LOGOUT
               </button>
             </>
          )}
        </div>
      </div>
    </header>
  );
}
