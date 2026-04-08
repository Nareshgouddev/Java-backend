import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Counter = ({ target, suffix = '', duration = 1200 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(ease * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}<span className="text-[1.1rem] tracking-normal">{suffix}</span></span>;
};

export default function About() {
  return (
    <div className="w-full relative">
      {/* ─── HERO ─── */}
      <section className="py-28 relative border-b border-blog-border overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_55%_70%_at_80%_30%,rgba(57,211,83,0.07)_0%,transparent_65%),radial-gradient(ellipse_40%_50%_at_10%_90%,rgba(56,189,248,0.04)_0%,transparent_60%)] z-0"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 font-mono text-[clamp(7rem,14vw,13rem)] font-bold leading-none text-transparent tracking-[-0.04em] select-none pointer-events-none -z-10 opacity-30" style={{ WebkitTextStroke: '1px rgba(57,211,83,0.2)' }}>
            BYTE
          </div>
          
          <div className="max-w-[680px]">
            <p className="font-mono text-[0.72rem] text-blog-accent tracking-[0.16em] uppercase flex items-center gap-2.5 mb-6 before:content-[''] before:block before:w-[30px] before:h-[1px] before:bg-blog-accent animate-[fadeUp_0.55s_ease_both]">
              About ByteLog
            </p>
            <h1 className="font-display text-[clamp(2.6rem,5vw,4rem)] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-6 animate-[fadeUp_0.55s_ease_both_0.1s]">
              Built by engineers,<br />
              for engineers who <em className="italic text-blog-accent">care.</em>
            </h1>
            <p className="text-[1.1rem] font-light text-blog-textMuted leading-[1.8] max-w-[52ch] mb-10 animate-[fadeUp_0.55s_ease_both_0.2s]">
              ByteLog is an independent technical blog dedicated to depth over breadth. We write about systems programming, web engineering, and open-source tooling — the things that actually matter when you're shipping real software.
            </p>
            <div className="flex flex-wrap gap-2 animate-[fadeUp_0.55s_ease_both_0.3s]">
              <span className="font-mono text-[0.68rem] px-3 py-1 rounded-sm tracking-[0.04em] bg-[rgba(57,211,83,0.1)] text-blog-accent border border-[rgba(57,211,83,0.22)]">Java 17</span>
              <span className="font-mono text-[0.68rem] px-3 py-1 rounded-sm tracking-[0.04em] bg-[rgba(56,189,248,0.1)] text-blog-blue border border-[rgba(56,189,248,0.22)]">Servlets</span>
              <span className="font-mono text-[0.68rem] px-3 py-1 rounded-sm tracking-[0.04em] bg-[rgba(249,115,22,0.1)] text-blog-red border border-[rgba(249,115,22,0.22)]">MySQL 8</span>
              <span className="font-mono text-[0.68rem] px-3 py-1 rounded-sm tracking-[0.04em] bg-[rgba(250,204,21,0.1)] text-blog-yellow border border-[rgba(250,204,21,0.22)]">JDBC</span>
              <span className="font-mono text-[0.68rem] px-3 py-1 rounded-sm tracking-[0.04em] bg-[#c792ea1a] text-blog-purple border border-[#c792ea38]">bcrypt</span>
              <span className="font-mono text-[0.68rem] px-3 py-1 rounded-sm tracking-[0.04em] bg-[rgba(56,189,248,0.1)] text-blog-blue border border-[rgba(56,189,248,0.22)]">Tomcat 10</span>
              <span className="font-mono text-[0.68rem] px-3 py-1 rounded-sm tracking-[0.04em] bg-[rgba(57,211,83,0.1)] text-blog-accent border border-[rgba(57,211,83,0.22)]">Maven</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <div className="border-b border-blog-border bg-blog-card">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          <div className="p-8 border-r border-blog-border flex flex-col gap-1 md:border-b-0 border-b">
            <p className="font-mono text-4xl lg:text-[2.2rem] font-bold text-blog-accent leading-none tracking-[-0.03em]">
              <Counter target={200} suffix="+" duration={1200} />
            </p>
            <p className="font-mono text-[0.68rem] text-blog-textMuted tracking-[0.1em] uppercase">Articles published</p>
          </div>
          <div className="p-8 md:border-r border-blog-border flex flex-col gap-1 border-b md:border-b-0">
            <p className="font-mono text-4xl lg:text-[2.2rem] font-bold text-blog-accent leading-none tracking-[-0.03em]">
              <Counter target={12} suffix="k" duration={1000} />
            </p>
            <p className="font-mono text-[0.68rem] text-blog-textMuted tracking-[0.1em] uppercase">Monthly readers</p>
          </div>
          <div className="p-8 border-r border-blog-border flex flex-col gap-1">
            <p className="font-mono text-4xl lg:text-[2.2rem] font-bold text-blog-accent leading-none tracking-[-0.03em]">
              <Counter target={25} duration={900} />
            </p>
            <p className="font-mono text-[0.68rem] text-blog-textMuted tracking-[0.1em] uppercase">Java source files</p>
          </div>
          <div className="p-8 flex flex-col gap-1">
            <p className="font-mono text-4xl lg:text-[2.2rem] font-bold text-blog-accent leading-none tracking-[-0.03em]">
              <Counter target={87} suffix="%" duration={1100} />
            </p>
            <p className="font-mono text-[0.68rem] text-blog-textMuted tracking-[0.1em] uppercase">Test coverage</p>
          </div>
        </div>
      </div>

      {/* ─── MISSION ─── */}
      <section className="py-24 border-b border-blog-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3.5 mb-10 w-full">
            <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-blog-textMuted whitespace-nowrap">
              <strong className="text-blog-accent font-bold">01</strong> — Mission
            </span>
            <div className="flex-1 h-[1px] bg-blog-border"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="font-display text-[clamp(1.9rem,3vw,2.8rem)] font-bold text-white leading-[1.15] tracking-[-0.02em] mb-5">
                Why we write.<br/>
                Why it <em className="italic text-blog-accent">matters.</em>
              </h2>
              <div className="text-[0.975rem] text-blog-textMuted font-light leading-[1.85] flex flex-col gap-4">
                <p>The internet is full of shallow tutorials that get you to "hello world" and stop there. ByteLog exists to go further — into the internals, the edge cases, the production failures, and the hard-won lessons that only come from actually building things.</p>
                <p>Every article on ByteLog is written by a practising engineer who has run the code in production, hit the failure mode being described, and taken the time to write it down properly. No AI-generated filler. No sponsored content. No paywalls.</p>
                <p>The ByteLog Auth module — the Java Servlet + JDBC + MySQL authentication system this site is built on — is itself a working example of everything we preach: clean separation of concerns, secure password hashing with bcrypt, and zero external framework dependencies.</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {[
                { n: '01', t: 'Depth over clicks', b: "We would rather publish one 15-minute deep dive per week than seven thin summaries. Quality compounds; quantity doesn't." },
                { n: '02', t: 'Code that compiles', b: "Every snippet on this site has been compiled and run. If it's in a tutorial, it works — or we say exactly why it doesn't and what to do instead." },
                { n: '03', t: 'Security is not optional', b: "From bcrypt cost factors to PreparedStatement usage, we treat security as a first-class concern — not an afterthought bolted on at the end." },
                { n: '04', t: 'No ads, ever', b: "ByteLog has never and will never run display ads or accept sponsored posts. The only agenda is good engineering content." }
              ].map(principle => (
                <div key={principle.n} className="bg-blog-card border border-blog-border rounded-md px-6 py-5 relative overflow-hidden transition-all hover:border-blog-accentDim hover:translate-x-1 group">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,var(--accent),transparent)] opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <p className="font-mono text-[0.65rem] text-blog-accent tracking-[0.1em] mb-2">// principle_{principle.n}</p>
                  <p className="font-mono text-[0.88rem] font-bold text-white mb-1.5">{principle.t}</p>
                  <p className="text-[0.85rem] text-blog-textMuted font-light leading-[1.7]">{principle.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section className="py-24 border-b border-blog-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3.5 mb-10 w-full">
            <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-blog-textMuted whitespace-nowrap">
              <strong className="text-blog-accent font-bold">02</strong> — Tech Stack
            </span>
            <div className="flex-1 h-[1px] bg-blog-border"></div>
          </div>
          <h2 className="font-display text-[clamp(1.9rem,3vw,2.8rem)] font-bold text-white leading-[1.15] tracking-[-0.02em] mb-10">
            What ByteLog<br/>is <em className="italic text-blog-accent">built on.</em>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-blog-border border border-blog-border rounded-lg overflow-hidden">
            {[
              { i: '☕', n: 'Java 17', r: 'Core language. LTS release with records, sealed classes, and pattern matching. Compiled to a WAR and deployed on Tomcat.', v: '// JDK 17 LTS' },
              { i: '⚙', n: 'Jakarta Servlets 6', r: 'Request handling with @WebServlet annotations. SignUpServlet, SignInServlet, DashboardServlet, SignOutServlet.', v: '// jakarta.servlet 6.0' },
              { i: '🐬', n: 'MySQL 8', r: 'Relational persistence with a users table and login_audit table. UTF8MB4 charset throughout.', v: '// mysql-connector-j 8.3' },
              { i: '🔑', n: 'jBCrypt', r: 'Password hashing with a configurable work factor (default cost = 12 ≈ 300ms). Constant-time verification prevents timing attacks.', v: '// org.mindrot:jbcrypt:0.4' },
              { i: '📄', n: 'React 19', r: 'Rebuilt frontend. Replaces legacy JSP rendering with an ultra-fast Vite SPA driven by Tailwind CSS and Client-Side Routing.', v: '// react-router-dom' },
              { i: '📦', n: 'Tailwind CSS v3', r: 'Utility-first CSS framework mirroring our original Dark Luxury visual spec down to the exact pixel.', v: '// tailwindcss 3.4.17' },
              { i: '🪵', n: 'SLF4J + Logback', r: 'Structured logging facade with a rolling-file appender. Password hashes are never logged.', v: '// logback-classic 1.5.3' },
              { i: '🐈', n: 'Apache Tomcat 10.1', r: 'Jakarta EE 10 compliant servlet container. Session cookies set to HttpOnly + SameSite=Strict in web.xml.', v: '// servlet container' },
              { i: '🧪', n: 'JUnit 5', r: 'Parameterised unit tests for all validators and the password utility. Tests run without a database or container.', v: '// junit-jupiter 5.10.2' },
            ].map((stack, idx) => (
              <div key={idx} className="bg-blog-card p-8 transition-colors hover:bg-[#191b1e]">
                <div className="font-mono text-2xl mb-3.5 leading-none">{stack.i}</div>
                <p className="font-mono text-[0.82rem] font-bold text-white mb-1">{stack.n}</p>
                <p className="text-[0.82rem] text-blog-textMuted font-light leading-[1.6]">{stack.r}</p>
                <span className="font-mono text-[0.65rem] text-blog-accent mt-3 inline-block">{stack.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARCHITECTURE ─── */}
      <section className="py-24 border-b border-blog-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3.5 mb-10 w-full">
            <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-blog-textMuted whitespace-nowrap">
              <strong className="text-blog-accent font-bold">03</strong> — Architecture
            </span>
            <div className="flex-1 h-[1px] bg-blog-border"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-[clamp(1.7rem,2.5vw,2.4rem)] font-bold text-white leading-[1.15] tracking-[-0.02em]">
                Layered, <em className="italic text-blog-accent">deliberately</em><br/>
                simple.
              </h2>
              <p className="text-[0.95rem] text-blog-textMuted font-light leading-[1.85]">
                ByteLog Auth follows a classic three-tier architecture. Every class has a single job. Every SQL query uses a PreparedStatement. Every password is hashed before it touches the database.
              </p>
              <div className="flex flex-col gap-2.5 mt-2">
                {[
                  { c: 'bg-[#c792ea]', n: 'View (React SPA)', d: 'Vite · React Router · Tailwind CSS' },
                  { c: 'bg-blog-blue', n: 'Controller (Servlets)', d: 'Auth · Posts · Dashboard APIs' },
                  { c: 'bg-blog-accent', n: 'Utility Layer', d: 'PasswordUtil · ValidationUtil' },
                  { c: 'bg-blog-yellow', n: 'Data Access (DAO)', d: 'UserDAO + DBConnection' },
                  { c: 'bg-blog-red', n: 'Database (MySQL)', d: 'users · posts · audits' },
                ].map((layer, idx) => (
                  <div key={idx} className="flex items-center gap-3 font-mono text-[0.78rem]">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${layer.c}`}></span>
                    <span className="text-white">{layer.n}</span>
                    <span className="text-blog-textDim text-[0.72rem] truncate hidden sm:inline-block">{layer.d}</span>
                    <span className="text-blog-textDim ml-auto">{idx < 4 ? '↓' : ' '}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Window */}
            <div className="bg-[#0a0b0d] border border-blog-border rounded-lg overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
              <div className="bg-blog-card border-b border-blog-border px-4 py-2.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
                <span className="ml-auto text-blog-textDim text-[0.68rem] font-mono">UserDAO.java</span>
              </div>
              <div className="px-6 py-6 pb-8 font-mono text-[0.78rem] leading-[2] overflow-x-auto whitespace-pre">
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">1</span><span className="text-[#f97316]">@Repository</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">2</span><span className="text-blog-purple">public class</span> <span className="text-blog-yellow">UserDAO</span> {'{'}</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">3</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">4</span>  <span className="text-blog-purple">private static final</span> <span className="text-blog-yellow">String</span> SQL_INSERT <span className="text-blog-red">=</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">5</span>    <span className="text-blog-accent">"INSERT INTO users "</span> <span className="text-blog-red">+</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">6</span>    <span className="text-blog-accent">"(username, email, password_hash)"</span> <span className="text-blog-red">+</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">7</span>    <span className="text-blog-accent">"VALUES (?, ?, ?)"</span>;</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">8</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">9</span>  <span className="text-blog-purple">public long</span> <span className="text-blog-blue">createUser</span>(</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">10</span>    <span className="text-blog-yellow">String</span> username,</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">11</span>    <span className="text-blog-yellow">String</span> email,</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">12</span>    <span className="text-blog-yellow">String</span> passwordHash) {'{'}</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">13</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">14</span>    <span className="text-blog-textDim italic">// PreparedStatement prevents SQL injection</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">15</span>    <span className="text-blog-purple">try</span> (<span className="text-blog-yellow">Connection</span> conn <span className="text-blog-red">=</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">16</span>        <span className="text-blog-blue">DBConnection</span>.<span className="text-blog-blue">getConnection</span>();</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">17</span>       <span className="text-blog-yellow">PreparedStatement</span> ps <span className="text-blog-red">=</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">18</span>        conn.<span className="text-blog-blue">prepareStatement</span>(SQL_INSERT,</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">19</span>          <span className="text-blog-yellow">Statement</span>.RETURN_GENERATED_KEYS)) {'{'}</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">20</span></div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">21</span>      ps.<span className="text-blog-blue">setString</span>(<span className="text-blog-accent">1</span>, username);</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">22</span>      ps.<span className="text-blog-blue">setString</span>(<span className="text-blog-accent">2</span>, email);</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">23</span>      ps.<span className="text-blog-blue">setString</span>(<span className="text-blog-accent">3</span>, passwordHash);</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">24</span>      ps.<span className="text-blog-blue">executeUpdate</span>();</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">25</span>    {'}'}</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">26</span>  {'}'}</div>
                <div><span className="text-blog-textDim inline-block w-[1.7em] text-right mr-3.5 text-[0.7rem] select-none">27</span>{'}'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="py-24 border-b border-blog-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3.5 mb-10 w-full">
            <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-blog-textMuted whitespace-nowrap">
              <strong className="text-blog-accent font-bold">04</strong> — The Team
            </span>
            <div className="flex-1 h-[1px] bg-blog-border"></div>
          </div>
          <h2 className="font-display text-[clamp(1.9rem,3vw,2.8rem)] font-bold text-white leading-[1.15] tracking-[-0.02em] mb-10">
            The people<br/>behind the <em className="italic text-blog-accent">code.</em>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                a: '👩‍💻', bg: '#1a2e1a', u: '@ava_mercer', r: 'FOUNDER · AUTHOR', n: 'Ava Mercer',
                br: 'Founder & Lead Author', b: "Former systems engineer at a fintech startup. Spent five years building Java backends before deciding the best tutorials didn't exist yet, so she wrote them. Specialty: authentication systems, JDBC internals, and Rust.",
                tags: [{t: 'Java', c: 'green', x: 'accent'}, {t: 'Rust', c: 'orange', x: 'red'}, {t: 'Auth', c: 'purple', x: 'purple'}]
              },
              {
                a: '👨‍🔬', bg: '#1a1e2e', u: '@riku_t', r: 'AUTHOR · BENCHMARKS', n: 'Riku Tamba',
                br: 'Author — Performance & Systems', b: "Infrastructure engineer who benchmarks things for fun. If there's a numbers-heavy article on ByteLog, Riku probably ran it on three different machines to make sure the results weren't a fluke. Specialty: JVM tuning, Go, CI/CD pipelines.",
                tags: [{t: 'Go', c: 'blue', x: 'blue'}, {t: 'Performance', c: 'yellow', x: 'yellow'}, {t: 'DevOps', c: 'green', x: 'accent'}]
              },
              {
                a: '👩‍🏗️', bg: '#2e1a1a', u: '@priya_nair', r: 'AUTHOR · DESIGN', n: 'Priya Nair',
                br: 'Author — System Design', b: "Distributed systems engineer who has designed databases for 10M+ users. Writes ByteLog's most-shared articles on system design, PostgreSQL indexing, and the architecture decisions that actually move the needle.",
                tags: [{t: 'System Design', c: 'yellow', x: 'yellow'}, {t: 'PostgreSQL', c: 'blue', x: 'blue'}, {t: 'Scale', c: 'orange', x: 'red'}]
              }
            ].map((usr, i) => (
              <div key={i} className="bg-blog-card border border-blog-border rounded-md overflow-hidden transition-all hover:border-blog-accentDim hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                <div className="bg-[#0a0b0d] border-b border-blog-border px-5 py-4 font-mono text-[0.65rem] text-blog-textDim">
                  <div className="text-blog-accent">/**</div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0 border-[1.5px] border-blog-border text-[1.4rem]" style={{background: usr.bg}}>{usr.a}</div>
                    <div>
                      <div className="text-white text-[0.82rem] font-bold">{usr.u}</div>
                      <div className="text-blog-accent text-[0.65rem] mt-[0.1rem] tracking-widest">{usr.r}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-blog-textDim"> */</div>
                </div>
                <div className="p-5 pb-6">
                  <p className="font-display text-[1.15rem] font-bold text-white mb-0.5 tracking-[-0.01em]">{usr.n}</p>
                  <p className="font-mono text-[0.68rem] text-blog-accent tracking-[0.08em] uppercase mb-3.5">{usr.br}</p>
                  <p className="text-[0.85rem] text-blog-textMuted font-light leading-[1.7] mb-4">{usr.b}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {usr.tags.map(tag => (
                      <span key={tag.t} className={`font-mono text-[0.68rem] px-2.5 py-[0.15rem] rounded-sm tracking-[0.04em] ${tag.c === 'green' ? 'bg-[rgba(57,211,83,0.1)] border-[rgba(57,211,83,0.22)]' : tag.c === 'blue' ? 'bg-[rgba(56,189,248,0.1)] border-[rgba(56,189,248,0.22)]' : tag.c === 'orange' ? 'bg-[rgba(249,115,22,0.1)] border-[rgba(249,115,22,0.22)]' : tag.c === 'yellow' ? 'bg-[rgba(250,204,21,0.1)] border-[rgba(250,204,21,0.22)]' : 'bg-[#c792ea1a] border-[#c792ea38]'} border text-blog-${tag.x}`}>
                        {tag.t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="py-24 border-b border-blog-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3.5 mb-10 w-full">
            <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-blog-textMuted whitespace-nowrap">
              <strong className="text-blog-accent font-bold">05</strong> — History
            </span>
            <div className="flex-1 h-[1px] bg-blog-border"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-display text-[clamp(1.9rem,3vw,2.8rem)] font-bold text-white leading-[1.15] tracking-[-0.02em] mb-8">
                How we<br/>
                <em className="italic text-blog-accent">got here.</em>
              </h2>
              <p className="text-[0.95rem] text-blog-textMuted font-light leading-[1.85] max-w-[40ch]">
                ByteLog started as a personal blog and grew into a platform. Here are the milestones that shaped it.
              </p>
            </div>
            
            <div className="relative pl-10 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[1px] before:bg-blog-border">
              {[
                { d: '// Q1 2024', t: 'First article published', b: "Ava's deep-dive on Rust lifetimes went viral on Hacker News. The site went from 0 to 8,000 readers overnight." },
                { d: '// Q2 2024', t: 'Riku and Priya join', b: "Two contributors, two new verticals: systems benchmarking and large-scale system design. Output doubled." },
                { d: '// Q4 2024', t: 'ByteLog Auth module shipped', b: "The Java Servlet + JDBC + MySQL authentication system was built and open-sourced as a companion to our auth tutorial series." },
                { d: '// Q1 2025', t: 'Newsletter launched', b: "12,000 subscribers in the first 90 days. One email per week — a single deep-dive, no fluff." },
                { d: '// Now', t: 'Still writing, still shipping', b: "200+ articles, 3 authors, 0 ads. The mission hasn't changed: go deeper than everyone else." },
              ].map((item, idx) => (
                <div key={idx} className="relative pb-10 group last:pb-0">
                  <div className="absolute -left-10 top-1.5 w-2.5 h-2.5 rounded-full bg-blog-accentDim border-2 border-blog-accent -translate-x-[4.5px] transition-all group-hover:-translate-x-[4.5px] group-hover:scale-150 group-hover:bg-blog-accent"></div>
                  <p className="font-mono text-[0.68rem] text-blog-accent tracking-[0.1em] mb-1.5">{item.d}</p>
                  <p className="font-mono text-[0.9rem] font-bold text-white mb-1.5">{item.t}</p>
                  <p className="text-[0.875rem] text-blog-textMuted font-light leading-[1.75] max-w-[56ch]">{item.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 relative overflow-hidden bg-blog-bg">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(57,211,83,0.06)_0%,transparent_70%)] z-0"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center text-center gap-6">
          <p className="font-mono text-[0.7rem] text-blog-accent tracking-[0.14em] uppercase">
            // join_bytelog()
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-white leading-[1.15] tracking-[-0.02em]">
            Ready to read<br/>something <em className="italic text-blog-accent">worth your time?</em>
          </h2>
          <p className="text-base text-blog-textMuted font-light max-w-[44ch] leading-[1.8]">
            Create a free account, save articles, and get the weekly newsletter. No ads. No paywalls. No fluff.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Link to="/register" className="inline-flex items-center gap-2 font-mono text-[0.8rem] font-bold tracking-[0.06em] px-6 py-3 rounded bg-blog-accent text-blog-bg border border-blog-accent hover:bg-transparent hover:text-blog-accent hover:shadow-[0_0_22px_rgba(57,211,83,0.18)] transition-all">
              Create account →
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 font-mono text-[0.8rem] font-bold tracking-[0.06em] px-6 py-3 rounded bg-transparent text-blog-textMuted border border-blog-border hover:border-blog-accent hover:text-blog-accent transition-all">
              Browse articles
            </Link>
          </div>
        </div>
      </section>
      
      {/* ─── FOOTER ─── */}
      <footer className="border-t border-blog-border bg-blog-card">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Link to="/" className="font-mono text-[0.92rem] font-bold text-white tracking-tight">
            <span className="text-blog-accent">{'{'}</span>ByteLog<span className="text-blog-accent">{'}'}</span>
          </Link>
          <nav className="flex flex-wrap gap-5 font-mono text-[0.7rem] text-blog-textDim">
            <Link to="/" className="hover:text-blog-accent transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blog-accent transition-colors">About</Link>
            <Link to="/login" className="hover:text-blog-accent transition-colors">Sign In</Link>
            <span className="hover:text-blog-accent transition-colors cursor-pointer">Newsletter</span>
            <span className="hover:text-blog-accent transition-colors cursor-pointer">GitHub</span>
          </nav>
          <p className="font-mono text-[0.65rem] text-blog-textDim">
            © 2026 <span className="text-blog-accent">ByteLog</span> · Zero ads · Zero paywalls
          </p>
        </div>
      </footer>
    </div>
  );
}
