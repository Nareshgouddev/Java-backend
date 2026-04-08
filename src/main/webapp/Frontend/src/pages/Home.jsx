import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bookmark, X } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Mimic the Index.html mockup data injection
    let storedPosts = JSON.parse(localStorage.getItem('bytelog_posts')) || [];
    
    if (storedPosts.length === 0) {
      storedPosts = [
        {
          id: 'mock1',
          title: 'Architecting High-Throughput Event Sourcing Systems',
          excerpt: 'Why traditional CRUD architectures fail under extreme load and how migrating to a pure event-sourced Kafka backbone reduces latency while preserving immutable historical state.',
          content: 'Full content...',
          tags: ['ARCHITECTURE', 'KAFKA'],
          readTime: 8,
          timestamp: new Date().getTime(),
          featured: true
        },
        {
          id: 'mock2',
          title: 'Memory Safety in Rust vs C++',
          excerpt: 'An empirical analysis of memory leaks in highly concurrent systems and how Rusts borrow checker forces a paradigm shift in system design.',
          content: 'Full content...',
          tags: ['RUST', 'SYSTEMS'],
          readTime: 12,
          timestamp: new Date().getTime() - 86400000,
          featured: false
        },
        {
          id: 'mock3',
          title: 'Bypassing the V8 Garbage Collector',
          excerpt: 'Strategies for zero-allocation performance in Node.js critical paths by leveraging typed arrays and pre-allocated memory pools.',
          content: 'Full content...',
          tags: ['NODEJS', 'V8'],
          readTime: 5,
          timestamp: new Date().getTime() - 172800000,
          featured: false
        }
      ];
      localStorage.setItem('bytelog_posts', JSON.stringify(storedPosts));
    }
    
    // Sort by newest
    storedPosts.sort((a, b) => b.timestamp - a.timestamp);
    setPosts(storedPosts);

    // Load bookmarks
    const storedBookmarks = JSON.parse(localStorage.getItem('bytelog_bookmarks')) || [];
    setBookmarks(storedBookmarks);

    // Check auth status
    const profileStr = localStorage.getItem('bytelog_profile');
    if (profileStr) {
      setIsAdmin(true); // Renaming logic: anyone logged in can create
    }
  }, []);

  // Filtering Logic
  useEffect(() => {
    let filtered = [...posts];
    const search = searchParams.get('search')?.toLowerCase();
    const tag = searchParams.get('tag')?.toLowerCase();

    if (search) {
      filtered = filtered.filter(p => 
        (p.title || '').toLowerCase().includes(search) || 
        (p.excerpt || '').toLowerCase().includes(search) ||
        p.tags?.some(t => t.toLowerCase().includes(search))
      );
    }

    if (tag) {
      filtered = filtered.filter(p => 
        p.tags?.some(t => t.toLowerCase() === tag)
      );
    }

    setDisplayPosts(filtered);
  }, [posts, searchParams]);

  const toggleBookmark = (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const profile = localStorage.getItem('bytelog_profile');
    if (!profile) {
      alert('AUTHENTICATION_REQUIRED. PLEASE SIGN IN TO BOOKMARK.');
      return;
    }

    let updatedBookmarks;
    if (bookmarks.includes(postId)) {
      updatedBookmarks = bookmarks.filter(id => id !== postId);
    } else {
      updatedBookmarks = [...bookmarks, postId];
    }
    
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bytelog_bookmarks', JSON.stringify(updatedBookmarks));
  };

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchParams({ tag: tag });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const formatDate = (ms) => {
    const d = new Date(ms);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="w-full">
      {/* ── HERO ── */}
      <section className="relative border-b border-blog-border overflow-hidden">
        {/* Glow overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(57,211,83,0.07)_0%,transparent_70%),radial-gradient(ellipse_40%_80%_at_10%_80%,rgba(56,189,248,0.04)_0%,transparent_60%)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 min-h-[520px]">
          {/* Hero Left */}
          <div className="py-16 md:pr-12 flex flex-col justify-center border-r-0 md:border-r border-blog-border">
            <div className="font-mono text-[0.72rem] text-blog-accent tracking-[0.14em] uppercase mb-5 flex items-center gap-2 before:content-[''] before:block before:w-[28px] before:h-[1px] before:bg-blog-accent">
              Manifesto
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white tracking-[-0.02em] mb-5">
              THE ART OF<br/>SOFTWARE<br/><em className="italic text-blog-accent">ENGINEERING</em>
            </h1>
            
            <p className="text-blog-textMuted font-light text-lg max-w-[38ch] leading-relaxed mb-8">
              Navigating extreme architectural complexity and scaling systems from bare-metal zero to infinity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 font-mono text-[0.72rem] text-blog-textDim">
              <span className="flex items-center gap-1.5">
                <span className="w-[3px] h-[3px] rounded-full bg-blog-border"></span>
                HIGH-SIGNAL
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-[3px] h-[3px] rounded-full bg-blog-border"></span>
                LOW-NOISE
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-[3px] h-[3px] rounded-full bg-blog-border"></span>
                "NOT FOR NOVICES."
              </span>
            </div>

            <div className="flex gap-4">
              <a href="#feed" className="inline-flex items-center gap-2 font-mono text-[0.8rem] font-bold tracking-wider px-6 py-3 rounded bg-blog-accent text-blog-bg border border-blog-accent transition-all hover:bg-transparent hover:text-blog-accent hover:shadow-[0_0_20px_rgba(57,211,83,0.18)]">
                READ LOGS //
              </a>
              <Link to="/about" className="inline-flex items-center gap-2 font-mono text-[0.8rem] font-bold tracking-wider px-6 py-3 rounded bg-transparent text-blog-textMuted border border-blog-border transition-all hover:border-blog-accent hover:text-blog-accent">
                DECRYPT ORIGIN
              </Link>
            </div>
          </div>

          {/* Hero Right - Code Block */}
          <div className="py-16 md:pl-12 flex flex-col justify-center">
            <div className="bg-[#0a0b0d] border border-blog-border rounded-lg overflow-hidden font-mono text-[0.8rem] shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_#1f2125]">
              <div className="bg-blog-card border-b border-blog-border px-4 py-2.5 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                <span className="ml-auto text-blog-textDim text-[0.7rem]">core_system.rs</span>
              </div>
              <div className="p-5 line-height-[2] text-blog-text">
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">1</span><span className="text-[#c792ea]">pub fn</span> <span className="text-blog-blue">initialize_runtime</span>() <span className="text-[#c792ea]">{'->'}</span> <span className="text-blog-yellow">Result</span>{'<(), RuntimeError>'} {'{'}</div>
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">2</span>  <span className="text-blog-textDim italic">// Bootstrapping the hypervisor layer</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">3</span>  <span className="text-[#c792ea]">let</span> memory_pool <span className="text-[#f97316]">=</span> Pool::<span className="text-blog-blue">allocate</span>(<span className="text-blog-accent">"8GB"</span>)<span className="text-[#f97316]">?</span>;</div>
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">4</span>  </div>
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">5</span>  <span className="text-[#c792ea]">if</span> !system::<span className="text-blog-blue">is_bare_metal</span>() {'{'}</div>
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">6</span>    <span className="text-[#c792ea]">return</span> <span className="text-blog-blue">Err</span>(RuntimeError::<span className="text-blog-yellow">VirtualizationDetected</span>);</div>
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">7</span>  {'}'}</div>
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">8</span>  </div>
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">9</span>  <span className="text-blog-blue">Ok</span>(())</div>
                <div><span className="text-blog-textDim inline-block w-[1.8em] text-right mr-3 text-[0.75rem]">10</span>{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="border-b border-blog-border bg-blog-card overflow-hidden whitespace-nowrap py-2">
        <div className="inline-flex gap-10 animate-ticker hover:[animation-play-state:paused]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="font-mono text-[0.72rem] text-blog-textDim inline-flex items-center gap-2">
              <span className="text-blog-accent opacity-80">{'<'}</span> ARCHITECTURE
              <span className="text-blog-accent opacity-80">{'/>'}</span> SYSTEM DESIGN
              <span className="text-blog-accent opacity-80">{'<'}</span> ALGORITHMS
              <span className="text-blog-accent opacity-80">{'/>'}</span> PERFORMANCE
              <span className="text-blog-accent opacity-80">{'<'}</span> DEVOPS
              <span className="text-blog-accent opacity-80">{'/>'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div id="feed" className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-0 py-14 items-start">
        {/* Posts Area */}
        <div className="lg:pr-12 lg:border-r border-blog-border">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 flex-1">
              <span className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-blog-textMuted">
                LATEST <strong className="text-blog-accent">LOGS</strong>
              </span>
              <div className="flex-1 h-[1px] bg-blog-border"></div>
            </div>
            {isAdmin && (
              <Link to="/create" className="ml-6 font-mono text-[0.7rem] font-bold text-blog-accent border border-blog-accent px-4 py-2 rounded hover:bg-blog-accent hover:text-blog-bg transition-all flex items-center gap-2">
                <span className="text-sm">+</span> CREATE_LOG
              </Link>
            )}
          </div>

          {/* Filter Status */}
          {(searchParams.get('search') || searchParams.get('tag')) && (
            <div className="flex flex-wrap items-center gap-3 mb-8 animate-[fadeUp_0.3s_ease_both]">
              <span className="font-mono text-[0.65rem] text-blog-textDim uppercase tracking-widest">Active Filters:</span>
              {searchParams.get('search') && (
                <div className="flex items-center gap-2 bg-blog-accentDim border border-blog-accent/30 px-2.5 py-1 rounded text-blog-accent font-mono text-[0.68rem]">
                  SEARCH="{searchParams.get('search')}"
                  <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('search'); setSearchParams(p); }} className="hover:text-white"><X size={12} /></button>
                </div>
              )}
              {searchParams.get('tag') && (
                <div className="flex items-center gap-2 bg-blog-blue/10 border border-blog-blue/30 px-2.5 py-1 rounded text-blog-blue font-mono text-[0.68rem]">
                  TAG="{searchParams.get('tag').toUpperCase()}"
                  <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('tag'); setSearchParams(p); }} className="hover:text-white"><X size={12} /></button>
                </div>
              )}
              <button onClick={clearFilters} className="font-mono text-[0.65rem] text-blog-textMuted hover:text-blog-red transition-colors uppercase border-b border-transparent hover:border-blog-red ml-2">
                CLEAR_ALL
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {displayPosts.length > 0 ? (
              displayPosts.map((post, idx) => (
                <div key={post.id} className={`bg-blog-card border border-blog-border rounded-md overflow-hidden flex flex-col transition-all relative group hover:border-blog-borderHover hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)] ${idx === 0 && !searchParams.get('search') && !searchParams.get('tag') ? 'md:col-span-2 md:flex-row' : 'min-h-[280px]'}`}>
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blog-accent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  
                  {/* Thumb only for featured/first post or if imageUrl exists */}
                  {( (idx === 0 && !searchParams.get('search') && !searchParams.get('tag')) || post.imageUrl ) && (
                    <div className={`${idx === 0 && !searchParams.get('search') && !searchParams.get('tag') ? 'hidden md:flex w-[280px]' : 'h-40'} shrink-0 bg-blog-bg items-center justify-center relative overflow-hidden`}>
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <>
                          <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(var(--accent)_1px,transparent_1px),linear-gradient(90deg,var(--accent)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                          <div className="font-mono text-6xl text-blog-accent drop-shadow-[0_0_20px_currentColor] relative z-10">{'{;}'}</div>
                        </>
                      )}
                    </div>
                  )}

                  <div className={`p-6 flex-1 flex flex-col ${idx === 0 && !searchParams.get('search') && !searchParams.get('tag') ? 'md:p-8' : ''}`}>
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {post.tags && post.tags.map((tag, i) => (
                        <button 
                          key={i} 
                          onClick={(e) => handleTagClick(e, tag)}
                          className={`font-mono text-[0.65rem] px-2 py-0.5 rounded-sm tracking-wider transition-all hover:scale-105 active:scale-95 ${i % 2 === 0 ? 'bg-[rgba(57,211,83,0.12)] text-blog-accent border border-[rgba(57,211,83,0.25)] hover:bg-[rgba(57,211,83,0.2)]' : 'bg-[rgba(56,189,248,0.1)] text-blog-blue border border-[rgba(56,189,248,0.22)] hover:bg-[rgba(56,189,248,0.2)]'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-start mb-2.5">
                      <Link to={`/post/${post.id}`} className="flex-1">
                        <h3 className={`font-display font-bold text-white leading-snug tracking-[-0.02em] transition-colors group-hover:text-blog-accent ${idx === 0 ? 'text-2xl' : 'text-lg'}`}>
                          {post.title}
                        </h3>
                      </Link>
                      <button 
                        onClick={(e) => toggleBookmark(e, post.id)}
                        className={`p-1.5 rounded transition-colors ml-4 ${bookmarks.includes(post.id) ? 'text-blog-accent' : 'text-blog-textMuted hover:text-blog-accent'}`}
                        title={bookmarks.includes(post.id) ? "REMOVE_BOOKMARK" : "SAVE_TO_LOGS"}
                      >
                        <Bookmark size={18} fill={bookmarks.includes(post.id) ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <p className={`text-[0.88rem] text-blog-textMuted font-light leading-relaxed flex-1 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] mb-4 ${idx === 0 ? '[-webkit-line-clamp:4]' : '[-webkit-line-clamp:3]'}`}>
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between border-t border-blog-border pt-3.5 mt-auto gap-2">
                      <div className="font-mono text-[0.68rem] text-blog-textDim flex flex-col gap-0.5">
                        <Link to={`/profile/${(post.author || 'SYS_ADMIN').toLowerCase().replace(/\s+/g, '_')}`} className="text-blog-textMuted hover:text-blog-accent transition-colors flex items-center gap-1.5 uppercase tracking-widest group/author">
                          <span className="w-1.5 h-1.5 rounded-full bg-blog-accent/20 group-hover/author:bg-blog-accent transition-colors"></span>
                          {post.author || 'SYS_ADMIN'}
                        </Link>
                        <span>{formatDate(post.timestamp)} • {post.readTime || 5} MIN READ</span>
                      </div>
                      <Link to={`/post/${post.id}`} className="font-mono text-[0.72rem] text-blog-accent flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap after:content-['→'] uppercase tracking-[0.15em]">
                        READ_LOG
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-20 text-center font-mono text-blog-textMuted">
                NO_RECORDS_FOUND
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col gap-8 pl-10">
          <div className="bg-blog-sidebar border border-blog-border rounded-md overflow-hidden">
            <div className="font-mono text-[0.72rem] text-white tracking-[0.1em] border-b border-blog-border px-5 py-3 uppercase flex items-center justify-between">
              System Status
              <span className="flex w-2 h-2 rounded-full bg-blog-accent animate-pulse shadow-[0_0_8px_rgba(57,211,83,0.8)]"></span>
            </div>
            <div className="px-5 py-4 font-mono text-xs flex flex-col gap-3">
              <div className="flex justify-between items-end border-b border-blog-border border-dashed pb-2">
                <span className="text-blog-textDim">UPTIME</span>
                <span className="text-blog-accent">99.99%</span>
              </div>
              <div className="flex justify-between items-end border-b border-blog-border border-dashed pb-2">
                <span className="text-blog-textDim">LATENCY</span>
                <span className="text-blog-blue">12ms</span>
              </div>
              <div className="flex justify-between items-end pb-1">
                <span className="text-blog-textDim">ERRORS</span>
                <span className="text-white">0</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blog-sidebar border border-blog-border rounded-md overflow-hidden">
             <div className="font-mono text-[0.72rem] text-white tracking-[0.1em] border-b border-blog-border px-5 py-3 uppercase">
              Join the Network
            </div>
            <div className="p-5 text-center">
              <p className="text-sm text-blog-textMuted mb-4 leading-relaxed">Receive high-density engineering transmissions straight to your terminal.</p>
              <div className="flex">
                <input type="email" placeholder="sys_admin@local..." className="flex-1 min-w-0 bg-blog-bg border border-blog-border rounded-l font-mono text-xs text-white px-3 py-2 outline-none focus:border-blog-accent" />
                <button className="bg-blog-border text-white font-mono text-xs font-bold px-3 border border-l-0 border-blog-border rounded-r transition-colors hover:bg-white hover:text-black">
                  INIT
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
