import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Globe, Cpu, Activity, ShieldCheck, ExternalLink } from 'lucide-react';

// Custom Brand Icons (Lucide missing these in current version)
const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState({ 
    name: 'SYS_ADMIN', 
    bio: '', 
    active: true,
    github: '',
    twitter: '',
    website: ''
  });
  const [authorPosts, setAuthorPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [activeTab, setActiveTab] = useState('archive'); // 'archive' | 'bookmarks'
  const [showModal, setShowModal] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    const localProfileStr = localStorage.getItem('bytelog_profile');
    const localProfile = localProfileStr ? JSON.parse(localProfileStr) : null;
    
    // Determine if we are viewing own profile or someone else's
    const targetUserId = userId ? userId.toLowerCase() : null;
    const currentUserId = localProfile ? localProfile.name.toLowerCase().replace(/\s+/g, '_') : null;
    
    const viewingOwn = !targetUserId || targetUserId === currentUserId;
    setIsOwnProfile(viewingOwn);

    // Set Profile Info
    if (viewingOwn && localProfile) {
      setProfile({
        name: localProfile.name || 'SYS_ADMIN',
        bio: localProfile.bio || '',
        active: localProfile.active !== undefined ? localProfile.active : true,
        github: localProfile.github || '',
        twitter: localProfile.twitter || '',
        website: localProfile.website || ''
      });
    } else if (targetUserId) {
      // Find a post by this author to get their display name (simplified for local-only)
      const allPosts = JSON.parse(localStorage.getItem('bytelog_posts')) || [];
      const authorMatch = allPosts.find(p => (p.author || 'SYS_ADMIN').toLowerCase().replace(/\s+/g, '_') === targetUserId);
      if (authorMatch) {
         setProfile({ 
           name: authorMatch.author, 
           bio: `Verified Technical Contributor at ByteLog. Analysis indicates high-density output.`, 
           active: true,
           github: '',
           twitter: '',
           website: ''
         });
      } else {
         setProfile({ 
           name: targetUserId.toUpperCase(), 
           bio: 'NO_BIOS_DATA_RETRIEVED. NODE_STATUS: OFFLINE.', 
           active: false,
           github: '',
           twitter: '',
           website: ''
         });
      }
    }

    // Load Posts
    const allPosts = JSON.parse(localStorage.getItem('bytelog_posts')) || [];
    const filteredAuthorPosts = allPosts.filter(p => {
       const authorId = (p.author || 'SYS_ADMIN').toLowerCase().replace(/\s+/g, '_');
       return viewingOwn ? (p.author === 'SYS_ADMIN' || (localProfile && p.author === localProfile.name)) : (authorId === targetUserId);
    });
    setAuthorPosts(filteredAuthorPosts);

    // Calculate Top Skills
    const tagCounts = {};
    filteredAuthorPosts.forEach(post => {
      post.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const skills = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
    setTopSkills(skills);

    // Load Bookmarks (Only for own profile)
    if (viewingOwn) {
      const bookmarks = JSON.parse(localStorage.getItem('bytelog_bookmarks')) || [];
      const filteredBookmarks = allPosts.filter(p => bookmarks.includes(p.id.toString()));
      setBookmarkedPosts(filteredBookmarks);
    }
  }, [userId]);

  const saveProfile = () => {
    localStorage.setItem('bytelog_profile', JSON.stringify(profile));
    setShowModal(false);
  };

  const deletePost = (id) => {
    const allPosts = JSON.parse(localStorage.getItem('bytelog_posts')) || [];
    const updated = allPosts.filter(p => p.id !== id);
    localStorage.setItem('bytelog_posts', JSON.stringify(updated));
    setAuthorPosts(authorPosts.filter(p => p.id !== id));
  };

  const removeBookmark = (id) => {
    const bookmarks = JSON.parse(localStorage.getItem('bytelog_bookmarks')) || [];
    const updated = bookmarks.filter(b => b !== id.toString());
    localStorage.setItem('bytelog_bookmarks', JSON.stringify(updated));
    setBookmarkedPosts(bookmarkedPosts.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
      {/* Sidebar Profile Info */}
      <div className="flex flex-col gap-6">
        <div className="border border-blog-border bg-blog-card rounded-md overflow-hidden p-6 relative group shadow-sm transition-all hover:border-blog-accent/30">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blog-blue to-transparent"></div>
          
          <div className="w-20 h-20 bg-blog-bg border border-blog-border rounded-full flex items-center justify-center font-mono text-xl text-blog-blue mb-4 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
            {profile.name.substring(0,2).toUpperCase()}
          </div>
          
          <h2 className="font-display text-2xl font-bold text-white mb-1.5 flex items-center gap-2">
            {profile.name}
            {profile.active && <ShieldCheck size={18} className="text-blog-accent" title="VERIFIED_CONTRIBUTOR" />}
          </h2>

          <div className="font-mono text-[0.65rem] text-blog-accent flex items-center gap-1.5 mb-4 uppercase tracking-[0.1em]">
            <span className={`w-1.5 h-1.5 rounded-full ${profile.active ? 'bg-blog-accent' : 'bg-blog-textDim animate-pulse'}`}></span>
            {profile.active ? 'AUTHORIZATION LEVEL 9' : 'DATA_PURGED'}
          </div>
          
          <p className="text-sm text-blog-textMuted leading-relaxed border-y border-blog-border py-4 font-light italic">
            "{profile.bio || 'Executing terminal sequences. Awaiting objective...'}"
          </p>

          {/* Social Manifest */}
          <div className="flex gap-4 mt-6">
            {profile.github && (
              <a href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`} target="_blank" rel="noreferrer" className="text-blog-textDim hover:text-white transition-colors">
                <GithubIcon size={18} />
              </a>
            )}
            {profile.twitter && (
              <a href={profile.twitter.startsWith('http') ? profile.twitter : `https://x.com/${profile.twitter}`} target="_blank" rel="noreferrer" className="text-blog-textDim hover:text-blog-blue transition-colors">
                <TwitterIcon size={18} />
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="text-blog-textDim hover:text-blog-accent transition-colors">
                <Globe size={18} />
              </a>
            )}
          </div>

          {isOwnProfile && (
            <button 
              onClick={() => setShowModal(true)}
              className="mt-6 w-full py-2 bg-transparent border border-blog-border font-mono text-[0.65rem] text-blog-textMuted rounded uppercase tracking-widest hover:border-blog-blue hover:text-blog-blue transition-colors"
            >
              CONFIGURE_NODES
            </button>
          )}
        </div>

        {/* Top Contributions (Skills) */}
        {topSkills.length > 0 && (
          <div className="border border-blog-border bg-blog-card rounded-md p-5 shadow-sm">
            <h3 className="font-mono text-[0.65rem] text-white tracking-widest uppercase mb-4 pb-2 border-b border-blog-border flex items-center gap-2">
              <Cpu size={14} className="text-blog-accent" /> TOP_CONTRIBUTIONS
            </h3>
            <div className="flex flex-wrap gap-2">
              {topSkills.map((skill, i) => (
                <span key={i} className="font-mono text-[0.6rem] bg-blog-bg border border-blog-border px-2 py-1 text-blog-textDim uppercase">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Telemetry */}
        <div className="border border-blog-border bg-blog-card rounded-md p-5 shadow-sm">
          <h3 className="font-mono text-[0.65rem] text-white tracking-widest uppercase mb-4 pb-2 border-b border-blog-border flex items-center gap-2">
            <Activity size={14} className="text-blog-blue" /> Telemetry
          </h3>
          <div className="flex flex-col gap-3 font-mono text-[0.7rem]">
            <div className="flex justify-between text-blog-textDim">
              <span>ARCHIVE_SIZE</span>
              <span className="text-white">{authorPosts.length}</span>
            </div>
            {isOwnProfile && (
              <div className="flex justify-between text-blog-textDim">
                <span>INTEL_SAVED</span>
                <span className="text-blog-accent">{bookmarkedPosts.length}</span>
              </div>
            )}
            <div className="flex justify-between text-blog-textDim">
              <span>NODE_STATUS</span>
              <span className={profile.active ? 'text-blog-accent' : 'text-blog-red'}>{profile.active ? 'ONLINE' : 'LOCKED'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Tab System */}
        <div className="flex gap-8 border-b border-blog-border mb-10">
          <button 
            onClick={() => setActiveTab('archive')}
            className={`pb-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase transition-all relative ${activeTab === 'archive' ? 'text-blog-accent' : 'text-blog-textMuted hover:text-white'}`}
          >
            {isOwnProfile ? 'MY_TRANSMISSIONS' : 'PUBLIC_LOGS'}
            {activeTab === 'archive' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blog-accent"></div>}
          </button>
          {isOwnProfile && (
             <button 
               onClick={() => setActiveTab('bookmarks')}
               className={`pb-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase transition-all relative ${activeTab === 'bookmarks' ? 'text-blog-accent' : 'text-blog-textMuted hover:text-white'}`}
             >
               INTEL_VAULT
               {activeTab === 'bookmarks' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blog-accent"></div>}
             </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {activeTab === 'archive' ? (
            authorPosts.length > 0 ? (
              authorPosts.map(post => (
                <div key={post.id} className="p-6 border border-blog-border bg-blog-card rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-blog-blue/30 group">
                  <div>
                    <Link to={`/post/${post.id}`}>
                      <h4 className="font-display text-xl text-white font-bold mb-1.5 group-hover:text-blog-accent transition-colors tracking-tight">{post.title}</h4>
                    </Link>
                    <div className="font-mono text-[0.65rem] text-blog-textDim flex gap-4 uppercase tracking-[0.05em]">
                      <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                      <span className="text-blog-accent border border-blog-accent/20 px-1.5 rounded-sm">{post.tags?.[0] || 'DRAFT'}</span>
                      <span className="text-blog-blue">{post.readTime || 5}MIN_INDEX</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isOwnProfile ? (
                      <>
                        <Link to="/create" state={{ post }} className="font-mono text-[0.65rem] text-blog-blue border border-blog-border px-4 py-2 rounded hover:border-blog-blue hover:shadow-[0_0_12px_rgba(56,189,248,0.1)] transition-all uppercase">EDIT</Link>
                        <button onClick={() => deletePost(post.id)} className="font-mono text-[0.65rem] text-blog-red border border-blog-border px-4 py-2 rounded hover:border-blog-red hover:bg-blog-red/5 transition-all uppercase">PURGE</button>
                      </>
                    ) : (
                      <Link to={`/post/${post.id}`} className="font-mono text-[0.65rem] text-blog-accent border border-blog-border px-6 py-2 rounded hover:border-blog-accent transition-all uppercase tracking-widest">DECRYPT_LOG</Link>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 font-mono text-[0.7rem] text-blog-textDim border border-dashed border-blog-border rounded-md bg-white/[0.01]">
                NULL_POINTER. NO LOGS IDENTIFIED IN THIS NODE.
              </div>
            )
          ) : (
            bookmarkedPosts.length > 0 ? (
              bookmarkedPosts.map(post => (
                <div key={post.id} className="p-6 border border-blog-border bg-blog-card rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-blog-blue/30 group">
                  <div>
                    <Link to={`/post/${post.id}`}>
                      <h4 className="font-display text-xl text-white font-bold mb-1.5 group-hover:text-blog-accent transition-colors tracking-tight">{post.title}</h4>
                    </Link>
                    <div className="font-mono text-[0.65rem] text-blog-textDim flex gap-4 uppercase tracking-[0.05em]">
                      <span>SAVED_ON: {new Date(post.timestamp).toLocaleDateString()}</span>
                      <span className="text-blog-blue border border-blog-blue/20 px-1.5 rounded-sm">{post.tags?.[0] || 'LOG'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/post/${post.id}`} className="font-mono text-[0.65rem] text-blog-accent border border-blog-border px-4 py-2 rounded hover:border-blog-accent transition-all uppercase">VIEW</Link>
                    <button onClick={() => removeBookmark(post.id)} className="font-mono text-[0.65rem] text-blog-red border border-blog-border px-4 py-2 rounded hover:border-blog-red hover:bg-blog-red/5 transition-all uppercase">PURGE</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 font-mono text-[0.7rem] text-blog-textDim border border-dashed border-blog-border rounded-md bg-white/[0.01]">
                VOID_SEARCH. NO SAVED TRANSMISSIONS IN INTEL_VAULT.
              </div>
            )
          )}
        </div>
      </div>

      {/* Config Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#0e0f11]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-blog-card border border-blog-border rounded w-full max-w-md overflow-hidden shadow-2xl animate-[fadeUp_0.3s_ease_both]">
            <div className="px-6 py-4 border-b border-blog-border flex justify-between items-center font-mono text-[0.7rem] text-white bg-blog-bg">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blog-accent"></span>
                IDENTITY_CONFIG.JSON
              </span>
              <button onClick={() => setShowModal(false)} className="text-blog-textDim hover:text-white transition-colors">ESC</button>
            </div>
            <div className="p-8 flex flex-col gap-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block font-mono text-[0.6rem] text-blog-textDim uppercase tracking-widest mb-2">PUBLIC_ALIAS</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-blog-bg border border-blog-border px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-blog-accent rounded transition-all"
                />
              </div>
              <div>
                <label className="block font-mono text-[0.6rem] text-blog-textDim uppercase tracking-widest mb-2">BIOGRAPHY_DIRECTIVE</label>
                <textarea 
                  value={profile.bio} 
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-blog-bg border border-blog-border px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-blog-accent rounded resize-none h-24 leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-blog-border pt-4">
                 <div className="font-mono text-[0.6rem] text-blog-accent tracking-widest uppercase mb-1">Social_Manifest_Nodes</div>
                 <div>
                    <label className="flex items-center gap-2 font-mono text-[0.6rem] text-blog-textDim uppercase mb-1.5"><GithubIcon size={12}/> Github_Handle</label>
                    <input 
                      type="text" 
                      placeholder="e.g. janesmith"
                      value={profile.github} 
                      onChange={e => setProfile({...profile, github: e.target.value})}
                      className="w-full bg-blog-bg border border-blog-border px-4 py-2 text-white font-mono text-xs outline-none focus:border-blog-blue rounded"
                    />
                 </div>
                 <div>
                    <label className="flex items-center gap-2 font-mono text-[0.6rem] text-blog-textDim uppercase mb-1.5"><TwitterIcon size={12}/> Twitter_X_Handle</label>
                    <input 
                      type="text" 
                      placeholder="e.g. janedev"
                      value={profile.twitter} 
                      onChange={e => setProfile({...profile, twitter: e.target.value})}
                      className="w-full bg-blog-bg border border-blog-border px-4 py-2 text-white font-mono text-xs outline-none focus:border-blog-blue rounded"
                    />
                 </div>
                 <div>
                    <label className="flex items-center gap-2 font-mono text-[0.6rem] text-blog-textDim uppercase mb-1.5"><Globe size={12}/> personal_website_URI</label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://jane.dev"
                      value={profile.website} 
                      onChange={e => setProfile({...profile, website: e.target.value})}
                      className="w-full bg-blog-bg border border-blog-border px-4 py-2 text-white font-mono text-xs outline-none focus:border-blog-blue rounded"
                    />
                 </div>
              </div>

              <button onClick={saveProfile} className="mt-4 w-full py-3.5 bg-blog-accent text-blog-bg font-mono font-bold text-xs rounded uppercase tracking-widest hover:shadow-[0_0_24px_rgba(57,211,83,0.18)] transition-all shrink-0">
                EXEC_WRITE_CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

