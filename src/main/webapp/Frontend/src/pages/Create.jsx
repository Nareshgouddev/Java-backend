import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Hash, Plus, Layers } from 'lucide-react';

export default function Create() {
  const location = useLocation();
  const editingPost = location.state?.post || null;
  const isEditing = !!editingPost;

  const [formData, setFormData] = useState({
    title: editingPost?.title || '',
    category: editingPost?.category || 'System Design',
    content: editingPost?.content || '',
    imageUrl: editingPost?.imageUrl || '',
    tags: editingPost?.tags || []
  });
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const addCustomTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const existingPosts = JSON.parse(localStorage.getItem('bytelog_posts')) || [];

    const postData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.content.substring(0, 150) + '...',
      category: formData.category,
      imageUrl: formData.imageUrl,
      tags: formData.tags,
      readTime: Math.max(1, Math.ceil(formData.content.trim().split(/\s+/).length / 200))
    };

    if (isEditing) {
      const updatedPosts = existingPosts.map(p =>
        p.id === editingPost.id ? { ...p, ...postData } : p
      );
      localStorage.setItem('bytelog_posts', JSON.stringify(updatedPosts));
    } else {
      const newPost = {
        ...postData,
        id: 'post_' + new Date().getTime(),
        author: 'SYS_ADMIN',
        timestamp: new Date().getTime()
      };
      existingPosts.push(newPost);
      localStorage.setItem('bytelog_posts', JSON.stringify(existingPosts));
    }

    navigate(isEditing ? '/admin' : '/');
  };

  const wordCount = formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-[820px] mx-auto px-6 py-12 pb-20">
      <div className="font-mono text-[0.72rem] text-blog-textDim mb-8 flex items-center gap-2 animate-[fadeUp_0.4s_0.05s_both]">
        <button onClick={() => navigate(-1)} className="text-blog-textMuted hover:text-blog-accent transition-colors">BACK</button>
        <span className="text-blog-border">/</span>
        <span className="text-blog-accent">{isEditing ? 'Edit' : 'Create'}</span>
      </div>

      <div className="mb-10 animate-[fadeUp_0.5s_0.1s_both]">
        <p className="font-mono text-[0.72rem] text-blog-accent tracking-[0.14em] uppercase mb-3 flex items-center gap-2 before:content-[''] before:block before:w-[28px] before:h-[1px] before:bg-blog-accent">
          Editor Console
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-white tracking-[-0.02em] mb-2.5">
          {isEditing ? <>Edit <em className="italic text-blog-accent">Transmission</em></> : <>Draft <em className="italic text-blog-accent">Transmission</em></>}
        </h1>
        <p className="text-[0.95rem] text-blog-textMuted font-light max-w-[50ch]">
          Markdown is supported. Enrich your log with headers, code blocks, and clear formatting.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-blog-card border border-blog-border rounded-lg overflow-hidden relative animate-[fadeUp_0.5s_0.2s_both]">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,var(--accent),var(--blue),var(--accent))] bg-[length:200%_100%] animate-[gradientSlide_3s_ease_infinite]"></div>
        
        <div className="bg-blog-bg border-b border-blog-border px-5 py-3 flex items-center gap-2 font-mono text-[0.72rem] text-blog-textDim">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
          <span className="ml-auto">system_shell.md</span>
        </div>

        <form onSubmit={handlePublish} className="p-8 pb-10">
          <div className="mb-6">
            <label className="block font-mono text-[0.75rem] text-blog-textMuted tracking-[0.08em] uppercase mb-2">Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Memory Safety in Rust" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-blog-bg border border-blog-border rounded p-3 text-white font-body text-[0.92rem] outline-none focus:border-blog-accent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-mono text-[0.75rem] text-blog-textMuted tracking-[0.08em] uppercase mb-2 flex items-center gap-2">
                <Layers size={12} className="text-blog-accent" /> Category_Class
              </label>
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. System Design" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-blog-bg border border-blog-border rounded p-3 text-white font-body text-[0.92rem] outline-none focus:border-blog-accent transition-all"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['System Design', 'Tutorial', 'Deep Dive', 'Performance'].map(cat => (
                    <button 
                      type="button" 
                      key={cat} 
                      onClick={() => setFormData({...formData, category: cat})}
                      className={`font-mono text-[0.6rem] px-2 py-0.5 rounded border transition-all ${formData.category === cat ? 'border-blog-accent text-blog-accent bg-blog-accent/10' : 'border-blog-border text-blog-textDim hover:text-white hover:border-blog-textMuted'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block font-mono text-[0.75rem] text-blog-textMuted tracking-[0.08em] uppercase mb-2">Header Image URL</label>
              <input 
                type="text" 
                placeholder="https://images.unsplash.com/..." 
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full bg-blog-bg border border-blog-border rounded p-3 text-white font-mono text-[0.8rem] outline-none focus:border-blog-accent transition-all"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-mono text-[0.75rem] text-blog-textMuted tracking-[0.08em] uppercase mb-2">Content (Markdown)</label>
            <textarea 
              required
              placeholder="## Introduction..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full bg-blog-bg border border-blog-border rounded p-4 text-white font-mono text-[0.85rem] outline-none focus:border-blog-accent resize-y min-h-[300px] leading-relaxed"
            ></textarea>
            <div className={`font-mono text-[0.68rem] text-right mt-1.5 ${wordCount < 10 ? 'text-blog-red' : 'text-blog-textDim'}`}>
              WORDS: {wordCount}
            </div>
          </div>

          <div className="mb-8">
            <label className="block font-mono text-[0.75rem] text-blog-textMuted tracking-[0.08em] uppercase mb-3 flex items-center gap-2">
              <Hash size={12} className="text-blog-accent" /> Tags & Taxonomy
            </label>
            
            {/* Custom Tag Input */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Add custom tag (press Enter)..." 
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-blog-bg border border-blog-border rounded px-4 py-2.5 text-white font-mono text-xs outline-none focus:border-blog-accent transition-all"
                />
              </div>
              <button 
                type="button" 
                onClick={addCustomTag}
                className="bg-blog-border hover:bg-blog-accent hover:text-blog-bg text-white px-4 py-2 rounded transition-all flex items-center gap-2 font-mono text-[0.65rem] font-bold"
              >
                <Plus size={14} /> ADD
              </button>
            </div>

            {/* Tag Selection / Display */}
            <div className="flex flex-wrap gap-2">
              {/* Preset Shortcuts */}
              {['Rust', 'TypeScript', 'Go', 'Architecture'].map(tag => {
                const checked = formData.tags.includes(tag);
                if (checked) return null; // Don't show in presets if already selected
                return (
                  <button 
                    type="button" 
                    key={tag} 
                    onClick={() => handleTagToggle(tag)} 
                    className="font-mono text-[0.65rem] px-2.5 py-1 rounded border border-blog-border text-blog-textMuted hover:border-blog-accent hover:text-blog-accent transition-all"
                  >
                    + {tag}
                  </button>
                );
              })}

              {/* Active Tags */}
              {formData.tags.map(tag => (
                <button 
                  type="button" 
                  key={tag} 
                  onClick={() => handleTagToggle(tag)} 
                  className="font-mono text-[0.65rem] px-3 py-1.5 rounded transition-all border border-blog-accent text-blog-accent bg-blog-accent/10 flex items-center gap-2 hover:bg-blog-red/10 hover:border-blog-red hover:text-blog-red group"
                >
                  {tag}
                  <X size={10} className="opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </div>
            {formData.tags.length === 0 && (
              <p className="font-mono text-[0.65rem] text-blog-textDim italic mt-2">No tags specified. Recommended for discoverability.</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-blog-border">
             <button type="button" onClick={() => navigate(-1)} className="font-mono text-[0.8rem] px-6 py-3 text-blog-textMuted hover:text-white transition-colors">CANCEL</button>
             <button type="submit" className="font-mono text-[0.8rem] px-8 py-3 bg-blog-accent text-blog-bg rounded font-bold hover:shadow-[0_0_24px_rgba(57,211,83,0.18)] transition-all">
               {isEditing ? 'UPDATE_SOURCE' : 'PUBLISH_LOG'}
             </button>
          </div>
        </form>
      </div>

      {/* Live Preview */}
      <div className="mt-16 animate-[fadeUp_0.5s_0.3s_both]">
        <div className="font-mono text-[0.72rem] text-blog-textDim tracking-[0.12em] uppercase mb-6 flex items-center gap-3 before:content-['▸'] before:text-blog-accent">
          Real-time Preview
          {formData.imageUrl && <span className="text-[0.6rem] bg-blog-blue/10 text-blog-blue px-2 py-0.5 rounded ml-2">IMAGE_LOADED</span>}
        </div>

        <div className="bg-blog-card border border-blog-border rounded-lg overflow-hidden relative">
          {formData.imageUrl && (
            <div className="h-48 w-full overflow-hidden border-b border-blog-border">
              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-8">
            <h2 className="font-display text-3xl font-bold text-white mb-6 leading-tight">{formData.title || 'Untitled Transmission'}</h2>
            <div className="prose prose-invert max-w-none text-blog-textMuted leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {formData.content || '_Content will appear here..._'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
