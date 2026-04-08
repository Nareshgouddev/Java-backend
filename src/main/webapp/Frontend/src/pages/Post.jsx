import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, Send, Reply, MessageSquare, ChevronRight, Zap, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- NESTED COMMENT COMPONENT ---
const Comment = ({ comment, allComments, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const replies = allComments.filter(c => c.parentId === comment.id);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setIsReplying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-l border-blog-border pl-4 mt-6 first:mt-0">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 font-mono text-[0.65rem]">
          <span className="text-blog-accent">@{(comment.name || 'ANONYMOUS').toLowerCase()}</span>
          <span className="text-blog-textDim">•</span>
          <span className="text-blog-textDim">{new Date(comment.timestamp).toLocaleString()}</span>
        </div>
        <p className="text-[0.9rem] text-blog-text leading-relaxed">
          {comment.text}
        </p>
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="w-fit flex items-center gap-1.5 font-mono text-[0.6rem] text-blog-textMuted hover:text-blog-blue transition-colors uppercase tracking-widest mt-1"
        >
          <Reply size={12} />
          {isReplying ? 'CANCEL_REPLY' : 'REPLY'}
        </button>
      </div>

      {isReplying && (
        <div className="flex flex-col gap-3 mt-2 animate-[fadeUp_0.2s_ease_both]">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="TYPE_RESPONSE..."
            className="w-full bg-blog-card border border-blog-border rounded p-3 text-sm text-white font-mono outline-none focus:border-blog-blue resize-none h-20"
          />
          <button
            onClick={handleReplySubmit}
            className="w-fit px-4 py-1.5 bg-blog-blue text-blog-bg font-mono text-[0.65rem] font-bold rounded uppercase hover:bg-transparent hover:text-blog-blue border border-blog-blue transition-all"
          >
            SEND_TRANSMISSION
          </button>
        </div>
      )}

      {replies.length > 0 && (
        <div className="flex flex-col gap-4">
          {replies.map(reply => (
            <Comment key={reply.id} comment={reply} allComments={allComments} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const [reactions, setReactions] = useState({ fire: 0, claps: 0 });
  const [toc, setToc] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const articleRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch Post
    const posts = JSON.parse(localStorage.getItem('bytelog_posts')) || [];
    const found = posts.find((p) => p.id === id || p.id.toString() === id);
    setPost(found || null);

    if (found) {
      // Extract TOC headings (simplified regex)
      const headingRegex = /^(#{2,3})\s+(.*)$/gm;
      const headings = [];
      let match;
      while ((match = headingRegex.exec(found.content)) !== null) {
        headings.push({
          level: match[1].length,
          text: match[2],
          id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
        });
      }
      setToc(headings);

      // Load Reactions
      const allReactions = JSON.parse(localStorage.getItem('bytelog_reactions')) || {};
      setReactions(allReactions[id] || { fire: 0, claps: 0 });
    }

    // Check Bookmark Status
    const bookmarks = JSON.parse(localStorage.getItem('bytelog_bookmarks')) || [];
    setIsBookmarked(bookmarks.includes(id));

    // Load Comments
    const allComments = JSON.parse(localStorage.getItem('bytelog_comments')) || {};
    setComments(allComments[id] || []);

    setLoading(false);

    // Scroll Progress Logic
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const handleReaction = (type) => {
    const allReactions = JSON.parse(localStorage.getItem('bytelog_reactions')) || {};
    const updated = { ...reactions, [type]: reactions[type] + 1 };
    allReactions[id] = updated;
    setReactions(updated);
    localStorage.setItem('bytelog_reactions', JSON.stringify(allReactions));
  };

  const toggleBookmark = () => {
    const profile = localStorage.getItem('bytelog_profile');
    if (!profile) {
      alert('AUTHENTICATION_REQUIRED. PLEASE SIGN IN TO BOOKMARK.');
      return;
    }

    const bookmarks = JSON.parse(localStorage.getItem('bytelog_bookmarks')) || [];
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(b => b !== id);
    } else {
      updated = [...bookmarks, id];
    }

    setIsBookmarked(!isBookmarked);
    localStorage.setItem('bytelog_bookmarks', JSON.stringify(updated));
  };

  const addComment = (parentId = null, text) => {
    const profileStr = localStorage.getItem('bytelog_profile');
    if (!profileStr) {
      alert('AUTHENTICATION_REQUIRED. PLEASE SIGN IN TO COMMENT.');
      return;
    }

    const profile = JSON.parse(profileStr);
    const comment = {
      id: Date.now(),
      parentId: parentId,
      name: profile.name,
      text: text,
      timestamp: new Date().toISOString()
    };

    const allComments = JSON.parse(localStorage.getItem('bytelog_comments')) || {};
    const postComments = allComments[id] || [];
    const updated = [...postComments, comment];
    
    allComments[id] = updated;
    localStorage.setItem('bytelog_comments', JSON.stringify(allComments));
    setComments(updated);
  };

  const formatAuthorName = (name) => name ? name.toLowerCase().replace(/\s+/g, '_') : 'sys_admin';

  if (loading) return <div className="bg-blog-bg min-h-screen flex items-center justify-center font-mono text-blog-accent tracking-widest animate-pulse">DECRYPTING_LOG_SEQUENCE...</div>;
  if (!post) return <div className="bg-blog-bg min-h-screen flex flex-col items-center justify-center font-mono text-blog-red gap-4">
    <div className="text-4xl">404</div>
    <div className="tracking-widest">LOG_NOT_FOUND_IN_ARCHIVES</div>
    <Link to="/" className="mt-8 border border-blog-red/30 px-6 py-2 text-[0.7rem] hover:bg-blog-red/10 transition-all uppercase tracking-widest">Return to Base</Link>
  </div>;

  return (
    <div className="w-full bg-blog-bg flex flex-col min-h-screen relative">
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-blog-accent via-blog-blue to-blog-accent z-[100] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* ── HEADER ── */}
      <header className="relative border-b border-blog-border overflow-hidden pt-24 pb-20 bg-[#0a0b0d]">
        {post.imageUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src={post.imageUrl} alt="" className="w-full h-full object-cover opacity-20 scale-105 blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-[#0a0b0d]/80"></div>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_100%,rgba(57,211,83,0.06)_0%,transparent_70%)] z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center animate-[fadeUp_0.5s_ease_both]">
          <Link to="/" className="font-mono text-[0.65rem] text-blog-accent tracking-[0.2em] uppercase mb-12 hover:text-white transition-colors flex items-center gap-2 border border-blog-accent/20 px-4 py-2 rounded bg-blog-accent/5 backdrop-blur-sm">
            <ChevronRight size={14} className="rotate-180" /> RET_LOG_FEED
          </Link>

          <div className="flex flex-wrap justify-center gap-2.5 mb-8">
            {post.tags && post.tags.map((tag, i) => (
              <span key={i} className={`font-mono text-[0.65rem] px-3 py-1 rounded-sm tracking-[0.1em] border ${i % 2 === 0 ? 'bg-blog-accent/10 text-blog-accent border-blog-accent/20' : 'bg-blog-blue/10 text-blog-blue border-blog-blue/20'}`}>
                {tag.toUpperCase()}
              </span>
            ))}
          </div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-white leading-[0.95] tracking-[-0.04em] mb-12 max-w-[12ch] lg:max-w-[15ch]">
            {post.title}
          </h1>

          <div className="flex flex-col items-center gap-6">
            <div className="font-mono text-[0.7rem] text-blog-textDim flex flex-wrap items-center justify-center gap-10">
              <Link to={`/profile/${formatAuthorName(post.author)}`} className="group flex flex-col items-center">
                <span className="text-blog-accent text-[0.55rem] uppercase tracking-widest mb-1 group-hover:text-white transition-colors">Author_ID</span>
                <span className="text-white font-bold tracking-tight border-b border-transparent group-hover:border-blog-accent transition-all">@{formatAuthorName(post.author)}</span>
              </Link>
              <span className="flex flex-col items-center">
                <span className="text-blog-accent text-[0.55rem] uppercase tracking-widest mb-1">Timestamp</span>
                <span className="text-white font-bold tracking-tight">{new Date(post.timestamp).toLocaleDateString()}</span>
              </span>
              <span className="flex flex-col items-center">
                <span className="text-blog-accent text-[0.55rem] uppercase tracking-widest mb-1">Index_Time</span>
                <span className="text-white font-bold tracking-tight">{post.readTime || 5}m</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-12 py-20 relative">

        {/* Left Sidebar: TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8 animate-[fadeUp_0.6s_ease_both_0.2s]">
            <div>
              <h4 className="font-mono text-[0.65rem] text-blog-textDim uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Target size={14} className="text-blog-accent" /> CONTENTS
              </h4>
              <nav className="flex flex-col gap-4 border-l border-blog-border pl-4">
                {toc.map((item, i) => (
                  <a
                    key={i}
                    href={`#${item.id}`}
                    className={`font-mono text-[0.7rem] transition-all hover:text-white block hover:translate-x-1 ${item.level === 3 ? 'pl-4 text-blog-textDim' : 'text-blog-textMuted font-bold uppercase tracking-wider'}`}
                  >
                    {item.text}
                  </a>
                ))}
                {toc.length === 0 && <span className="text-[0.65rem] text-blog-textDim italic font-mono uppercase">NO_HEADINGS_FOUND</span>}
              </nav>
            </div>
          </div>
        </aside>

        {/* Center: Article */}
        <article ref={articleRef} className="text-[1.1rem] text-[#d8d9db] font-light leading-[1.85] w-full animate-[fadeUp_0.4s_ease_both_0.1s] selection:bg-blog-accent/30">
          <p className="text-[1.35rem] text-white font-display italic mb-16 border-l-2 border-blog-accent pl-8 py-2 bg-blog-accent/5">
            {post.excerpt}
          </p>

          <div className="prose prose-invert max-w-none mb-24 overflow-hidden">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="my-10 rounded-lg overflow-hidden border border-blog-border shadow-2xl relative group">
                      <div className="bg-[#121417] border-b border-blog-border px-5 py-3 flex items-center justify-between">
                        <span className="font-mono text-[0.65rem] text-blog-textDim uppercase tracking-[0.2em]">{match[1]}</span>
                        <div className="flex gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10"></span>
                        </div>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '2rem', background: '#0e0f11', fontSize: '0.88rem' }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-blog-card text-blog-accent px-2 py-0.5 rounded font-mono text-[0.85em] border border-blog-border" {...props}>
                      {children}
                    </code>
                  );
                },
                h2: ({ children }) => {
                  const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
                  return <h2 id={id} className="font-display text-3xl text-white font-bold mt-20 mb-8 tracking-tight flex items-center gap-4 scroll-mt-28 group">
                    <span className="text-blog-accent opacity-0 group-hover:opacity-100 transition-opacity">#</span>
                    {children}
                  </h2>;
                },
                h3: ({ children }) => {
                  const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
                  return <h3 id={id} className="font-display text-2xl text-white font-bold mt-12 mb-6 tracking-tight scroll-mt-28">{children}</h3>;
                },
                blockquote: ({ children }) => <blockquote className="border-l-4 border-blog-blue pl-8 italic text-blog-textMuted my-12 font-display text-[1.35rem] leading-relaxed bg-blog-blue/5 py-6 rounded-r-lg">{children}</blockquote>,
                p: ({ children }) => <p className="mb-8 leading-[1.8]">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-outside ml-6 mb-10 flex flex-col gap-4 text-blog-text">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside ml-6 mb-10 flex flex-col gap-4 text-blog-text">{children}</ol>,
                li: ({ children }) => <li className="pl-4">{children}</li>,
                strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                hr: () => <hr className="my-16 border-blog-border" />,
                a: ({ href, children }) => <a href={href} className="text-blog-accent underline underline-offset-8 hover:text-white transition-all decoration-blog-accent/30 hover:decoration-white">{children}</a>
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* ── COMMENTS SECTION ── */}
          <section id="discussion" className="pt-20 border-t border-blog-border scroll-mt-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 bg-blog-accentDim flex items-center justify-center rounded-sm">
                <MessageSquare size={20} className="text-blog-accent" />
              </div>
              <div>
                <h3 className="font-mono text-xs text-white tracking-[0.3em] uppercase font-bold">DISCUSSION_RECORDS</h3>
                <p className="font-mono text-[0.6rem] text-blog-textDim uppercase tracking-widest mt-0.5">COUNT: {comments.length} ENTRIES</p>
              </div>
            </div>

            <div className="mb-16 bg-blog-card border border-blog-border p-6 rounded-lg">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="INITIATE_TRANSMISSION..."
                className="w-full bg-blog-bg border border-blog-border rounded p-4 text-sm text-white font-mono outline-none focus:border-blog-accent resize-none h-32 mb-5 transition-colors"
              />
              <button
                onClick={() => { if (newComment.trim()) { addComment(null, newComment); setNewComment(''); } }}
                className="px-8 py-3 bg-blog-accent text-blog-bg font-mono text-xs font-bold rounded uppercase hover:bg-transparent hover:text-blog-accent border border-blog-accent transition-all flex items-center gap-3 shadow-[0_0_15px_rgba(57,211,83,0.1)]"
              >
                <Send size={14} />
                EXEC_POST
              </button>
            </div>

            <div className="space-y-12">
              {comments.filter(c => !c.parentId).map(comment => (
                <Comment key={comment.id} comment={comment} allComments={comments} onReply={(pid, text) => addComment(pid, text)} />
              ))}
              {comments.length === 0 && (
                <div className="py-20 text-center font-mono text-xs text-blog-textDim border border-dashed border-blog-border rounded-lg bg-white/[0.01]">
                  NO_COMMUNITY_DATA_INDEXED.
                </div>
              )}
            </div>
          </section>
        </article>

        {/* Right Sidebar: Reactions & Actions */}
        <aside className="hidden lg:block relative">
          <div className="sticky top-28 space-y-10 animate-[fadeUp_0.6s_ease_both_0.3s]">
            <div>
              <h4 className="font-mono text-[0.65rem] text-blog-textDim uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Zap size={14} className="text-blog-accent" /> ENGAGEMENT
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleReaction('fire')}
                  className="flex flex-col items-center gap-2 p-4 bg-blog-card border border-blog-border rounded hover:border-blog-accent transition-all active:scale-95 group"
                >
                  <span className="text-lg grayscale group-hover:grayscale-0 transition-all">🔥</span>
                  <span className="font-mono text-[0.7rem] font-bold text-white">{reactions.fire}</span>
                  <span className="font-mono text-[0.5rem] text-blog-textDim uppercase tracking-widest">FIRE_UP</span>
                </button>
                <button
                  onClick={() => handleReaction('claps')}
                  className="flex flex-col items-center gap-2 p-4 bg-blog-card border border-blog-border rounded hover:border-blog-accent transition-all active:scale-95 group"
                >
                  <span className="text-lg grayscale group-hover:grayscale-0 transition-all">👏</span>
                  <span className="font-mono text-[0.7rem] font-bold text-white">{reactions.claps}</span>
                  <span className="font-mono text-[0.5rem] text-blog-textDim uppercase tracking-widest">APPLAUSE</span>
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-blog-border">
              <button
                onClick={toggleBookmark}
                className={`w-full font-mono text-[0.65rem] px-4 py-3 border transition-all uppercase tracking-[0.15em] rounded flex items-center justify-center gap-3 ${isBookmarked ? 'bg-blog-accentDim border-blog-accent text-blog-accent shadow-[0_0_15px_rgba(57,211,83,0.12)]' : 'border-blog-border text-blog-textMuted hover:border-blog-accent hover:text-blog-accent'}`}
              >
                <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
                {isBookmarked ? 'IN_VAULT' : 'SAVE_LOG'}
              </button>
            </div>

            <div className="p-5 bg-blog-accentDim border border-blog-accent/20 rounded-sm">
              <p className="font-mono text-[0.6rem] text-blog-accent leading-relaxed tracking-wider uppercase">
                System Recommendation: This log is trending in the top 2% of technical deep-dives.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ── REFINED FOOTER ── */}
      <div className="border-t border-blog-border bg-blog-card">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
          <span className="font-mono text-[0.65rem] text-blog-textDim tracking-widest uppercase flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blog-accent animate-pulse"></span>
            TERMINAL_SESSION_END
          </span>
          <Link to="/" className="font-mono text-[0.65rem] px-5 py-2.5 bg-white text-black border border-white hover:bg-transparent hover:text-white transition-all uppercase tracking-[0.2em] rounded-sm font-bold">
            REV_MASTER_FEED
          </Link>
        </div>
      </div>
    </div>
  );
}
