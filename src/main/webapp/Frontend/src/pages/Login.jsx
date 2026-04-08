import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login({ defaultTab = 'signin' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Mock login check: If sign in, assign 'admin' if email starts with 'admin' or 'author'
      let finalRole = role;
      if (activeTab === 'signin') {
        finalRole = (email.startsWith('admin') || email.startsWith('author')) ? 'admin' : 'user';
      }

      const currentProfile = JSON.parse(localStorage.getItem('bytelog_profile')) || {};
      currentProfile.name = (activeTab === 'signup' && alias) ? alias.toUpperCase() : email.split('@')[0].toUpperCase();
      currentProfile.role = finalRole;
      
      localStorage.setItem('bytelog_profile', JSON.stringify(currentProfile));
      
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-60px)] w-full overflow-hidden bg-blog-bg">
      
      {/* ─── LEFT: DECORATIVE PANEL ─── */}
      <div className="hidden md:flex flex-col relative overflow-hidden bg-[#0a0b0d] border-r border-blog-border p-8 lg:p-12">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_50%_at_30%_40%,rgba(57,211,83,0.06)_0%,transparent_65%),radial-gradient(ellipse_50%_70%_at_80%_80%,rgba(56,189,248,0.03)_0%,transparent_60%)] z-0"></div>
        <div className="absolute inset-0 pointer-events-none opacity-[0.3] bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[length:40px_40px] z-0"></div>

        <div className="relative z-10 flex flex-col h-full">
          <Link to="/" className="font-mono text-sm font-bold text-white flex items-center gap-1 no-underline tracking-tight">
            <span className="text-blog-accent">{'{'}</span>ByteLog<span className="text-blog-accent">{'}'}</span>
          </Link>

          <div className="flex flex-col justify-center gap-6 flex-1">
            <div>
              <h2 className="font-display text-3xl font-bold text-white leading-tight tracking-[-0.02em]">
                Write code.<br/>
                Share what you<br/>
                <em className="italic text-blog-accent">actually learned.</em>
              </h2>
            </div>

            {/* Code Window (Condensed) */}
            <div className="bg-[#0e0f11]/85 border border-blog-border rounded-md overflow-hidden font-mono text-[0.7rem] backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.3)] max-w-sm">
              <div className="bg-blog-card border-b border-blog-border px-3 py-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff5f57]"></span>
                <span className="w-2 h-2 rounded-full bg-[#febc2e]"></span>
                <span className="w-2 h-2 rounded-full bg-[#28c840]"></span>
                <span className="ml-auto text-blog-textDim text-[0.65rem]">auth.ts</span>
              </div>
              <div className="px-4 py-3 leading-[1.8] text-blog-text">
                <div><span className="text-blog-purple">async function</span> <span className="text-blog-blue">signIn</span>(user) {'{'}</div>
                <div>&nbsp;&nbsp;<span className="text-blog-purple">const</span> token <span className="text-blog-red">=</span> <span className="text-blog-purple">await</span> <span className="text-blog-blue">verify</span>(user);</div>
                <div>&nbsp;&nbsp;<span className="text-blog-purple">return</span> {'{'} token, <span className="text-blog-accent">role</span>: user.role {'}'};</div>
                <div>{'}'}</div>
                <div className="overflow-hidden whitespace-nowrap border-r border-blog-accent animate-[typing_2s_steps(20,end)_1s_both,caret_0.75s_step-end_infinite] w-fit pt-1">
                  <span className="text-blog-textDim italic">// Ready? →</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-[0.75rem] text-blog-textMuted font-light">
              <span className="w-[18px] h-[18px] rounded border border-[rgba(57,211,83,0.3)] bg-blog-accentDim flex items-center justify-center text-[0.6rem] text-blog-accent shrink-0">✦</span>
              <span>Access 200+ in-depth systemic articles</span>
            </div>
          </div>
          <p className="font-mono text-[0.65rem] text-blog-textDim mt-auto pb-4">© 2026 ByteLog</p>
        </div>
      </div>

      {/* ─── RIGHT: AUTH FORMS ─── */}
      <div className="flex flex-col items-center justify-center p-6 relative overflow-hidden bg-blog-bg h-full">
        <div className="w-full max-w-[360px] relative z-10 flex flex-col items-center">
          
          {/* Tab Bar */}
          <div className="flex bg-blog-card border border-blog-border rounded p-1 mb-6 w-full gap-1">
            <button 
              onClick={() => { setActiveTab('signin'); navigate('/login'); }}
              className={`flex-1 py-1.5 rounded font-mono text-[0.7rem] font-bold uppercase transition-all ${
                activeTab === 'signin' ? 'bg-blog-accentDim text-blog-accent border border-[rgba(57,211,83,0.3)]' : 'bg-transparent text-blog-textDim'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setActiveTab('signup'); navigate('/register'); }}
              className={`flex-1 py-1.5 rounded font-mono text-[0.7rem] font-bold uppercase transition-all ${
                activeTab === 'signup' ? 'bg-blog-accentDim text-blog-accent border border-[rgba(57,211,83,0.3)]' : 'bg-transparent text-blog-textDim'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="w-full animate-[fadeUp_0.35s_ease_both]">
            <h2 className="font-display text-2xl font-bold text-white tracking-[-0.02em] leading-tight mb-4 text-center">
              {activeTab === 'signin' ? <>Sign <em className="italic text-blog-accent">in</em></> : <>Join <em className="italic text-blog-blue">network</em></>}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
              {activeTab === 'signup' && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[0.65rem] tracking-wider uppercase text-blog-textDim">Alias</label>
                    <input type="text" required value={alias} onChange={e => setAlias(e.target.value)} placeholder="Neo" className="w-full bg-blog-card border border-blog-border rounded px-3 py-2 text-white font-mono text-sm outline-none focus:border-blog-accent transition-all placeholder:text-blog-textDim" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[0.65rem] tracking-wider uppercase text-blog-textDim">Role</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-blog-card border border-blog-border rounded px-3 py-2 text-white font-mono text-sm outline-none focus:border-blog-accent transition-all appearance-none cursor-pointer bg-[url('data:image/svg+xml,%3Csvg_xmlns=%22http://www.w3.org/2000/svg%22_width=%2212%22_height=%2212%22_fill=%22%234b5563%22_viewBox=%220_0_16_16%22%3E%3Cpath_d=%22M1.5_5.5l6.5_6_6.5-6%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_1rem_center]">
                      <option value="user">Reader (User)</option>
                      <option value="admin">Author (Admin)</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[0.65rem] tracking-wider uppercase text-blog-textDim">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com" className="w-full bg-blog-card border border-blog-border rounded px-3 py-2 text-white font-mono text-sm outline-none focus:border-blog-accent transition-all placeholder:text-blog-textDim" />
                {activeTab === 'signin' && email.startsWith('admin') && <span className="font-mono text-[0.6rem] text-blog-accent mt-0.5">Admin access granted via email prefix</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[0.65rem] tracking-wider uppercase text-blog-textDim flex justify-between items-center">
                  Password
                  {activeTab === 'signin' && <span className="text-blog-accent capitalize tracking-normal cursor-pointer">Forgot?</span>}
                </label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-blog-card border border-blog-border rounded px-3 py-2 text-white font-mono text-sm outline-none focus:border-blog-accent transition-all placeholder:text-blog-textDim" />
              </div>

              <button type="submit" className="w-full py-2.5 mt-2 bg-blog-accent text-blog-bg border border-blog-accent rounded font-mono text-[0.75rem] font-bold tracking-wider uppercase transition-all hover:bg-transparent hover:text-blog-accent">
                {activeTab === 'signin' ? 'Sign In →' : 'Create Account →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
