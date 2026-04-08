import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, words: 0, avgTime: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem('bytelog_posts')) || [];
    setPosts(data);

    let totalWords = 0;
    let totalTime = 0;

    data.forEach(p => {
      totalWords += p.content ? p.content.split(/\s+/).filter(Boolean).length : 0;
      totalTime += p.readTime || 0;
    });

    setStats({
      total: data.length,
      words: totalWords,
      avgTime: data.length > 0 ? Math.round(totalTime / data.length) : 0
    });
  };

  const deletePost = (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    const newPosts = posts.filter(p => p.id !== id);
    localStorage.setItem('bytelog_posts', JSON.stringify(newPosts));
    loadData();
  };

  const getTagColor = (cat) => {
    const map = {
      'Rust': 'bg-[rgba(57,211,83,0.12)] text-blog-accent border-blog-accent/25',
      'TypeScript': 'bg-[rgba(56,189,248,0.1)] text-blog-blue border-blog-blue/25',
      'Go': 'bg-[rgba(249,115,22,0.1)] text-blog-red border-blog-red/25',
      'React': 'bg-[rgba(56,189,248,0.1)] text-blog-blue border-blog-blue/25',
      'System Design': 'bg-[rgba(250,204,21,0.1)] text-blog-yellow border-blog-yellow/25',
      'Deep Dive': 'bg-[rgba(56,189,248,0.1)] text-blog-blue border-blog-blue/25',
    };
    return map[cat] || 'bg-[rgba(57,211,83,0.12)] text-blog-accent border-blog-accent/25';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-20 animate-[fadeUp_0.5s_0.1s_both]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="font-mono text-[0.72rem] text-blog-accent tracking-[0.14em] uppercase mb-3 flex items-center gap-2 before:content-[''] before:block before:w-[28px] before:h-[1px] before:bg-blog-accent">
            Dashboard
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white tracking-[-0.02em]">
            Manage <em className="italic text-blog-accent">Posts</em>
          </h1>
        </div>
        <button onClick={() => navigate('/create')} className="inline-flex items-center gap-2 font-mono text-[0.8rem] font-bold tracking-wider px-6 py-3 rounded bg-blog-accent text-blog-bg border border-blog-accent hover:bg-transparent hover:text-blog-accent hover:shadow-[0_0_24px_rgba(57,211,83,0.18)] transition-all">
          + Create Post
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 animate-[fadeUp_0.5s_0.2s_both]">
        <div className="bg-blog-card border border-blog-border rounded-lg p-6 flex flex-col gap-2">
          <span className="font-mono text-[0.72rem] text-blog-textDim tracking-[0.1em] uppercase">Total Posts</span>
          <span className="font-mono text-3xl font-bold text-blog-accent leading-none">{stats.total}</span>
        </div>
        <div className="bg-blog-card border border-blog-border rounded-lg p-6 flex flex-col gap-2">
          <span className="font-mono text-[0.72rem] text-blog-textDim tracking-[0.1em] uppercase">Total Words</span>
          <span className="font-mono text-3xl font-bold text-white leading-none">{stats.words.toLocaleString()}</span>
        </div>
        <div className="bg-blog-card border border-blog-border rounded-lg p-6 flex flex-col gap-2">
          <span className="font-mono text-[0.72rem] text-blog-textDim tracking-[0.1em] uppercase">Avg Read Time</span>
          <span className="font-mono text-3xl font-bold text-white leading-none">{stats.avgTime}m</span>
        </div>
      </div>

      <div className="bg-blog-card border border-blog-border rounded-lg overflow-x-auto animate-[fadeUp_0.5s_0.3s_both]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="font-mono text-[0.7rem] text-blog-textDim tracking-[0.1em] uppercase bg-black/20 p-4 border-b border-blog-border">Date</th>
              <th className="font-mono text-[0.7rem] text-blog-textDim tracking-[0.1em] uppercase bg-black/20 p-4 border-b border-blog-border">Title</th>
              <th className="font-mono text-[0.7rem] text-blog-textDim tracking-[0.1em] uppercase bg-black/20 p-4 border-b border-blog-border">Category</th>
              <th className="font-mono text-[0.7rem] text-blog-textDim tracking-[0.1em] uppercase bg-black/20 p-4 border-b border-blog-border">Author</th>
              <th className="font-mono text-[0.7rem] text-blog-textDim tracking-[0.1em] uppercase bg-black/20 p-4 border-b border-blog-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map(post => (
                <tr key={post.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="p-4 border-b border-blog-border font-mono text-[0.75rem] text-blog-textMuted">{new Date(post.timestamp).toLocaleDateString()}</td>
                  <td className="p-4 border-b border-blog-border font-bold text-white text-[0.88rem]">{post.title}</td>
                  <td className="p-4 border-b border-blog-border">
                    <span className={`font-mono text-[0.65rem] px-2 py-0.5 rounded-sm tracking-wider border ${getTagColor(post.category)}`}>
                      {post.category || 'TUTORIAL'}
                    </span>
                  </td>
                  <td className="p-4 border-b border-blog-border text-[0.88rem] text-blog-textMuted">{post.author || 'SYS_ADMIN'}</td>
                  <td className="p-4 border-b border-blog-border">
                    <div className="flex gap-2">
                      <button onClick={() => navigate('/create', { state: { post } })} className="font-mono text-[0.7rem] px-3 py-1.5 text-blog-blue border border-blog-blue rounded hover:bg-[rgba(56,189,248,0.1)] hover:shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all">
                        EDIT
                      </button>
                      <button onClick={() => deletePost(post.id)} className="font-mono text-[0.7rem] px-3 py-1.5 text-blog-red border border-blog-red rounded hover:bg-[rgba(249,115,22,0.1)] hover:shadow-[0_0_12px_rgba(249,115,22,0.2)] transition-all">
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="py-16 text-center text-blog-textDim">
                    <div className="text-4xl mb-4 opacity-50">📝</div>
                    <h3 className="font-display text-2xl text-white mb-2">No posts yet</h3>
                    <p>Nothing has been published. Why not create one?</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
