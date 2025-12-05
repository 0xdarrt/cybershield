// LearningModule.jsx
// Expanded single-file Learning Module for CyberShield
// - Single-file implementation (lessons, quizzes, simulations, resources, tracks)
// - Uses Tailwind CSS and react-router-dom
// - Drop into src/learning/LearningModule.jsx and wire route: <Route path="/learning/*" element={<LearningModule/>} />

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

/* ------------------------
   Simple localStorage-backed progress context
   ------------------------ */
const PROGRESS_KEY = 'cybershield_learning_progress_v1';
const ProgressContext = createContext(null);

function useProgress() {
  return useContext(ProgressContext);
}

function ProgressProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : { lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [], tracks: {} };
    } catch (e) {
      return { lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [], tracks: {} };
    }
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  }, [state]);

  const markLessonComplete = (id, xp = 10, track) => {
    setState(prev => {
      if (prev.lessonsCompleted[id]) return prev; // already done
      const next = { ...prev, lessonsCompleted: { ...prev.lessonsCompleted, [id]: true }, xp: prev.xp + xp };
      if (track) next.tracks = { ...next.tracks, [track]: (next.tracks[track] || 0) + 1 };
      return next;
    });
  };

  const recordQuizScore = (quizId, score) => {
    setState(prev => {
      const nextScores = { ...prev.quizScores, [quizId]: score };
      const bonus = Math.max(0, Math.round(score * 0.1));
      return { ...prev, quizScores: nextScores, xp: prev.xp + bonus };
    });
  };

  const awardBadge = (badge) => {
    setState(prev => {
      if (prev.badges.includes(badge)) return prev;
      return { ...prev, badges: [...prev.badges, badge], xp: prev.xp + 20 };
    });
  };

  const resetProgress = () => {
    setState({ lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [], tracks: {} });
  };

  return (
    <ProgressContext.Provider value={{ state, markLessonComplete, recordQuizScore, awardBadge, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

/* ------------------------
   Large content arrays (Lessons, Quizzes, Resources, Tracks)
   All content lives in this single file so you don't need extra files.
   You can later move these to JSON files or a backend.
   ------------------------ */
const TRACKS = [
  { id: 'basics', title: 'Cybersecurity Basics' },
  { id: 'web', title: 'Web Security' },
  { id: 'network', title: 'Network & Infra' },
  { id: 'red', title: 'Red Team / Hacking' }
];

const LESSONS = [
  { id: 'phishing-101', title: 'What is Phishing?', short: 'Phishing is a social engineering attack used to steal sensitive information.', difficulty: 'Beginner', category: 'Social Engineering', track: 'basics', bullets: ['Attackers impersonate trusted services', 'Fake login portals harvest passwords', 'Always inspect sender and domain'], interactive: 'phishing-sim' },
  { id: 'passwords-101', title: 'Password Security', short: 'Why long unique passwords and password managers matter.', difficulty: 'Beginner', category: 'Authentication', track: 'basics', bullets: ['Use long passphrases', 'Never reuse passwords', 'Enable MFA'], interactive: 'password-sim' },
  { id: 'malware-101', title: 'Malware Overview', short: 'Types of malware and common delivery techniques.', difficulty: 'Beginner', category: 'Malware', track: 'basics', bullets: ['Viruses, worms, trojans, ransomware', 'Phishing and malicious downloads', 'Keep software patched'], interactive: 'none' },
  { id: 'xss-101', title: 'Cross-Site Scripting (XSS)', short: 'How XSS lets attackers run scripts in victim browsers.', difficulty: 'Intermediate', category: 'Web Security', track: 'web', bullets: ['Reflected vs stored XSS', 'Sanitize output and use CSP', 'Use secure templating frameworks'], interactive: 'xss-sim' },
  { id: 'sqli-101', title: 'SQL Injection (SQLi)', short: 'Manipulating database queries via unsanitized input.', difficulty: 'Intermediate', category: 'Web Security', track: 'web', bullets: ['Use prepared statements', "Classic payloads like ' OR '1'='1'", 'Principle of least privilege for DB users'], interactive: 'sqli-sim' },
  { id: 'network-basics', title: 'Network Security Basics', short: 'Firewalls, segmentation, VPNs and IDS/IPS.', difficulty: 'Intermediate', category: 'Networking', track: 'network', bullets: ['Firewalls filter traffic', 'Segment critical assets', 'Monitor with IDS/IPS'], interactive: 'firewall-sim' },
  { id: 'recon-101', title: 'Reconnaissance & OSINT', short: 'How attackers gather information before an attack.', difficulty: 'Intermediate', category: 'Red Team', track: 'red', bullets: ['Use public sources to map targets', 'Passive vs active recon', 'Respect legality and ethics'], interactive: 'none' },
  { id: 'cloud-iam', title: 'Cloud IAM Basics', short: 'Secure identity & access management for cloud resources.', difficulty: 'Advanced', category: 'Cloud', track: 'network', bullets: ['Principle of least privilege', 'Avoid long-lived keys', 'Use roles and MFA'], interactive: 'none' },
  { id: 'ransomware-101', title: 'Ransomware Explained', short: 'How ransomware operates and defense strategies.', difficulty: 'Advanced', category: 'Malware', track: 'basics', bullets: ['Backup strategies', 'Network segmentation', 'Incident response planning'], interactive: 'none' },
  { id: 'bugbounty-101', title: 'Bug Bounty Intro', short: 'Getting started with vulnerability research and responsible disclosure.', difficulty: 'Beginner', category: 'Hacking', track: 'red', bullets: ['Read program policies', 'Start with recon', 'Write concise reports'], interactive: 'none' }
];

const QUIZZES = [
  { id: 'quiz-phishing', title: 'Phishing Quiz', questions: [ { id: 'q1', text: 'Which is a sign of phishing?', options: ['Sender mismatch', 'Perfect grammar', 'Long emails', 'AES encryption'], answer: 0 }, { id: 'q2', text: 'A link like https://accounts.verify-login.com is:', options: ['Safe', 'Suspicious', 'Safe if HTTPS', 'From Google'], answer: 1 } ] },
  { id: 'quiz-passwords', title: 'Password Quiz', questions: [ { id: 'p1', text: 'Best way to store many passwords?', options: ['Browser', 'Password manager', 'Paper', 'Reuse one'], answer: 1 }, { id: 'p2', text: 'MFA stands for?', options: ['Multi-Factor Auth', 'Many Forms Auth', 'My Fancy Auth', 'Multi File Auth'], answer: 0 } ] },
  { id: 'quiz-malware', title: 'Malware Quiz', questions: [ { id: 'm1', text: 'Which malware encrypts files?', options: ['Worm', 'Trojan', 'Ransomware', 'Adware'], answer: 2 } ] },
  { id: 'quiz-web', title: 'Web Security Quiz', questions: [ { id: 'w1', text: 'XSS is caused by?', options: ['Unsanitized input', 'Strong passwords', 'Open ports', 'Slow server'], answer: 0 }, { id: 'w2', text: 'SQLi prevention uses?', options: ['Prepared statements', 'MFA', 'Firewall only', 'Cache'], answer: 0 } ] }
];

const RESOURCES = [
  { id: 'r1', title: "OWASP Top 10", type: 'Guide', url: 'https://owasp.org/www-project-top-ten/' },
  { id: 'r2', title: "Web Application Hacker's Handbook", type: 'Book', url: 'https://example.com/whh' },
  { id: 'r3', title: 'Intro to OSINT', type: 'Article', url: 'https://example.com/osint' }
];

/* ------------------------
   Small reusable UI components
   ------------------------ */
function Card({ children, className = '' }) {
  return (
    <div className={`bg-gray-900/60 border border-gray-700 rounded-2xl p-4 shadow-lg backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

function Badge({ children, color = 'cyan' }) {
  const map = { cyan: 'bg-cyan-600/30 text-cyan-200', yellow: 'bg-yellow-600/30 text-yellow-200', red: 'bg-red-600/30 text-red-200' };
  return <span className={`px-2 py-1 rounded ${map[color] || map.cyan} text-xs font-medium`}>{children}</span>;
}

function SectionTitle({ children }) {
  return <h2 className="text-2xl font-semibold mb-2 text-cyan-300">{children}</h2>;
}

/* ------------------------
   Learning Pages + Catalog + Filters
   ------------------------ */
function LearningHome() {
  const navigate = useNavigate();
  const { state, resetProgress } = useProgress();
  const totalLessons = LESSONS.length;
  const completed = Object.keys(state.lessonsCompleted).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-cyan-200">CyberShield — Learning</h1>
          <p className="text-sm text-gray-400">Structured tracks, hundreds of lessons — start from basics to advanced.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-300">XP: <span className="font-mono">{state.xp}</span></div>
          <div className="text-xs text-gray-400">Badges: {state.badges.join(', ') || '—'}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <SectionTitle>Progress</SectionTitle>
          <div className="text-gray-300">Completed {completed} / {totalLessons} lessons</div>
          <div className="mt-3">
            <button onClick={() => navigate('/learning/catalog')} className="px-3 py-2 rounded bg-cyan-600/40">Open Catalog</button>
            <button onClick={() => resetProgress()} className="ml-2 px-3 py-2 rounded border">Reset</button>
          </div>
        </Card>

        <Card>
          <SectionTitle>Popular Tracks</SectionTitle>
          <div className="flex flex-col gap-2">
            {TRACKS.map(t => (
              <Link key={t.id} to={`/learning/track/${t.id}`} className="text-sm text-gray-200 hover:text-cyan-300">{t.title}</Link>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Quick Actions</SectionTitle>
          <div className="flex flex-col gap-2">
            <Link to="/learning/simulations" className="px-3 py-2 rounded bg-violet-600/30">Open Simulations</Link>
            <Link to="/learning/resources" className="px-3 py-2 rounded bg-emerald-600/30">Resources Library</Link>
          </div>
        </Card>

        <Card>
          <SectionTitle>Highlights</SectionTitle>
          <div className="text-sm text-gray-300">Start with: <strong>Phishing</strong> → <strong>Password Security</strong></div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <SectionTitle>Lessons (Quick)</SectionTitle>
          <ul className="space-y-2 max-h-64 overflow-auto">
            {LESSONS.slice(0,8).map(l => (
              <li key={l.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-100">{l.title}</div>
                  <div className="text-xs text-gray-400">{l.difficulty} • {l.category}</div>
                </div>
                <div>
                  <Link to={`/learning/lesson/${l.id}`} className="px-2 py-1 rounded bg-cyan-600/30">Open</Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Quizzes (Quick)</SectionTitle>
          <ul className="space-y-2">
            {QUIZZES.slice(0,6).map(q => (
              <li key={q.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-100">{q.title}</div>
                  <div className="text-xs text-gray-400">{q.questions.length} questions</div>
                </div>
                <div>
                  <Link to={`/learning/quiz/${q.id}`} className="px-2 py-1 rounded bg-emerald-600/30">Start</Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Resources</SectionTitle>
          <ul className="space-y-2 text-sm text-gray-300">
            {RESOURCES.slice(0,6).map(r => (
              <li key={r.id}><a className="hover:text-cyan-300" href={r.url} target="_blank" rel="noreferrer">{r.title} <span className="text-xs text-gray-400">({r.type})</span></a></li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function CatalogPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(LESSONS.map(l=>l.category)))];
  const difficulties = ['All', ...Array.from(new Set(LESSONS.map(l=>l.difficulty)))];

  const filtered = LESSONS.filter(l => {
    if (category !== 'All' && l.category !== category) return false;
    if (difficulty !== 'All' && l.difficulty !== difficulty) return false;
    if (query && !(`${l.title} ${l.short} ${l.bullets.join(' ')}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-cyan-200">Lessons Catalog</h1>
        <div className="flex gap-2">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search lessons..." className="p-2 bg-gray-900 border rounded" />
          <select value={category} onChange={e=>setCategory(e.target.value)} className="p-2 bg-gray-900 border rounded">
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="p-2 bg-gray-900 border rounded">
            {difficulties.map(d=> <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {filtered.map(l=> (
          <Card key={l.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-100">{l.title}</h3>
                <div className="text-xs text-gray-400">{l.difficulty} • {l.category} • Track: {TRACKS.find(t=>t.id===l.track)?.title || '—'}</div>
                <p className="text-sm text-gray-300 mt-2">{l.short}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link to={`/learning/lesson/${l.id}`} className="px-3 py-2 rounded bg-cyan-600/30">Open</Link>
                <Link to={`/learning/quiz/quiz-${l.id}`} className="px-3 py-2 rounded bg-emerald-600/30">Quiz</Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TrackPage() {
  const { id } = useParams();
  const lessons = LESSONS.filter(l=>l.track===id);
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-200 mb-4">{TRACKS.find(t=>t.id===id)?.title || 'Track'}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {lessons.map(l=> (
          <Card key={l.id}>
            <h3 className="font-semibold">{l.title} <span className="text-xs text-gray-400">{l.difficulty}</span></h3>
            <p className="text-sm text-gray-300 mt-2">{l.short}</p>
            <div className="mt-3 flex gap-2">
              <Link to={`/learning/lesson/${l.id}`} className="px-3 py-2 rounded bg-cyan-600/30">Open</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = LESSONS.find(l => l.id === id);
  const { markLessonComplete, state } = useProgress();

  if (!lesson) return <div className="p-6">Lesson not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-cyan-200">{lesson.title}</h1>
          <div className="text-xs text-gray-400">{lesson.difficulty} • {lesson.category}</div>
          <p className="text-sm text-gray-300 mt-2">{lesson.short}</p>
        </div>
        <div className="text-sm text-gray-300">Status: {state.lessonsCompleted[lesson.id] ? 'Completed' : 'Not completed'}</div>
      </div>

      <Card>
        <div className="space-y-3">
          <div className="text-gray-300">
            {lesson.bullets.map((b, i) => (
              <p key={i} className="mb-1">• {b}</p>
            ))}
          </div>

          <div className="pt-3">
            <SectionTitle>Interactive</SectionTitle>
            {lesson.interactive === 'phishing-sim' && <PhishingSim />}
            {lesson.interactive === 'password-sim' && <PasswordStrengthSim />}
            {lesson.interactive === 'firewall-sim' && <FirewallSim />}
            {lesson.interactive === 'xss-sim' && <XSSSim />}
            {lesson.interactive === 'sqli-sim' && <SQLiSim />}
          </div>

          <div className="pt-3 flex gap-2">
            <button onClick={() => { markLessonComplete(lesson.id, 10, lesson.track); }} className="px-3 py-2 rounded bg-cyan-600/40">Mark complete</button>
            <button onClick={() => navigate('/learning')} className="px-3 py-2 rounded border">Back</button>
          </div>
        </div>
      </Card>

      <div className="mt-4">
        <Card>
          <SectionTitle>Mini-quiz</SectionTitle>
          <p className="text-gray-300 text-sm">Try a quick quiz on this topic.</p>
          <div className="mt-3">
            <Link to={`/learning/quiz/quiz-${lesson.id}`} className="px-3 py-2 rounded bg-emerald-600/40">Take mini-quiz</Link>
            <span className="text-xs text-gray-400 ml-3">(If available)</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------
   Quiz system
   ------------------------ */
function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZZES.find(q => q.id === id);
  const { recordQuizScore } = useProgress();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) return <div className="p-6">Quiz not found</div>;

  const handleChoose = (qid, idx) => setAnswers(prev => ({ ...prev, [qid]: idx }));

  const handleSubmit = () => {
    let s = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.answer) s += 1;
    });
    const percent = Math.round((s / quiz.questions.length) * 100);
    setScore(percent);
    setSubmitted(true);
    recordQuizScore(quiz.id, percent);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-cyan-200">{quiz.title}</h1>
        <div className="text-sm text-gray-300">Questions: {quiz.questions.length}</div>
      </div>

      <Card>
        <div className="space-y-4">
          {quiz.questions.map((q, i) => (
            <div key={q.id} className="p-3 border border-gray-800 rounded">
              <div className="font-medium text-gray-100">{i + 1}. {q.text}</div>
              <div className="mt-2 flex flex-col gap-2">
                {q.options.map((opt, idx) => {
                  const chosen = answers[q.id] === idx;
                  const isCorrect = submitted && q.answer === idx;
                  const isWrongChosen = submitted && chosen && q.answer !== idx;
                  return (
                    <button key={idx} onClick={() => handleChoose(q.id, idx)} className={`text-left p-2 rounded ${chosen ? 'ring-2 ring-cyan-500' : 'border border-gray-700'} ${isCorrect ? 'bg-emerald-800/40' : ''} ${isWrongChosen ? 'bg-red-800/40' : ''}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="px-4 py-2 rounded bg-emerald-600">Submit</button>
              <button onClick={() => navigate('/learning')} className="px-4 py-2 rounded border">Back</button>
            </div>
          ) : (
            <div className="mt-2">
              <div className="text-lg font-semibold">Score: {score}%</div>
              <div className="text-sm text-gray-300 mt-1">We recorded your score.</div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => navigate('/learning')} className="px-3 py-2 rounded border">Done</button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function SimulationHome() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-200 mb-4">Simulations</h1>

      <div className="grid md:grid-cols-2 gap-4">

        <Card>
          <h3 className="font-semibold">Phishing Simulator</h3>
          <p className="text-sm text-gray-400">
            Spot phishing attempts in an inbox-style interactive challenge.
          </p>
          <div className="mt-3">
            <Link
              to="/learning/simulations/phishing"
              className="px-3 py-2 rounded bg-violet-600/40 hover:bg-violet-600"
            >
              Open
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Password Strength</h3>
          <p className="text-sm text-gray-400">
            Test password strength and learn how attackers crack weak passwords.
          </p>
          <div className="mt-3">
            <Link
              to="/learning/simulations/password"
              className="px-3 py-2 rounded bg-violet-600/40 hover:bg-violet-600"
            >
              Open
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Firewall Simulator</h3>
          <p className="text-sm text-gray-400">
            Learn how rules affect allowed/blocked network traffic.
          </p>
          <div className="mt-3">
            <Link
              to="/learning/simulations/firewall"
              className="px-3 py-2 rounded bg-violet-600/40 hover:bg-violet-600"
            >
              Open
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">XSS Sandbox</h3>
          <p className="text-sm text-gray-400">
            Experiment with XSS payloads safely and see sanitization.
          </p>
          <div className="mt-3">
            <Link
              to="/learning/simulations/xss"
              className="px-3 py-2 rounded bg-violet-600/40 hover:bg-violet-600"
            >
              Open
            </Link>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">SQL Injection Lab</h3>
          <p className="text-sm text-gray-400">
            Enter SQL payloads and see how vulnerable queries break.
          </p>
          <div className="mt-3">
            <Link
              to="/learning/simulations/sqli"
              className="px-3 py-2 rounded bg-violet-600/40 hover:bg-violet-600"
            >
              Open
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}

/* ------------------------
   Simulations (Expanded)
   ------------------------ */

function FirewallSim() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-cyan-300">Firewall Simulation</h3>
      <p className="text-sm text-gray-300 mb-2">Experiment with allowing or blocking network traffic.</p>
      <div className="p-3 bg-gray-800 border rounded">(Interactive firewall tool coming soon)</div>
    </div>
  );
}

function XSSSim() {
  const [input, setInput] = useState('');
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-cyan-300">XSS Simulation</h3>
      <p className="text-sm text-gray-300 mb-2">Type untrusted input and see sanitized output.</p>
      <input className="w-full p-2 bg-gray-900 border rounded" value={input} onChange={e=>setInput(e.target.value)} placeholder="<script>alert(1)</script>" />
      <div className="mt-3 p-3 bg-gray-800 border rounded">
        <div className="text-xs text-gray-400">Sanitized:</div>
        {input.replace(/</g,'&lt;')}
      </div>
    </div>
  );
}

function SQLiSim() {
  const [val, setVal] = useState('');
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-cyan-300">SQL Injection Simulation</h3>
      <p className="text-sm text-gray-300 mb-2">See how unsafe input affects SQL queries.</p>
      <input className="w-full p-2 bg-gray-900 border rounded" value={val} onChange={e=>setVal(e.target.value)} placeholder="' OR '1'='1" />
      <div className="mt-3 p-3 bg-gray-800 border rounded text-xs">
        SELECT * FROM users WHERE username = '{val}'
      </div>
    </div>
  );
}

function PhishingSim() {
  const emails = [
    { id: 1, from: 'it-support@yourcompany.com', subj: 'Password reset required', snippet: 'Please reset your password immediately: https://yourcompany.reset-now.com' },
    { id: 2, from: 'news@trustedsite.com', subj: 'Weekly digest', snippet: 'Top stories for today' },
    { id: 3, from: 'security@bank.com', subj: 'Unusual login attempt', snippet: 'Verify here: https://bank-secure-login.com' }
  ];
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const { awardBadge } = useProgress();

  const check = (email) => {
    // naive: treat items containing domains with extra tokens as phishing
    const phishing = email.subj.toLowerCase().includes('reset') || email.snippet.includes('https://yourcompany.reset-now.com') || email.snippet.includes('bank-secure-login');
    setSelected(email.id);
    setResult(phishing);
    if (phishing) awardBadge('Phishing Hunter');
  };

  return (
    <div className="p-4">
      <div className="mb-3 text-sm text-gray-400">Click the email you suspect is phishing.</div>
      <div className="space-y-2">
        {emails.map(e => (
          <button key={e.id} onClick={() => check(e)} className={`w-full text-left p-3 rounded border ${selected === e.id ? 'ring-2 ring-cyan-500' : ''}`}>
            <div className="flex justify-between">
              <div>
                <div className="font-medium text-gray-100">{e.subj}</div>
                <div className="text-xs text-gray-400">{e.from} — {e.snippet}</div>
              </div>
              <div className="text-xs text-gray-500">{selected === e.id ? 'Selected' : 'Open'}</div>
            </div>
          </button>
        ))}
      </div>

      {result !== null && (
        <div className={`mt-4 p-3 rounded ${result ? 'bg-emerald-800/30' : 'bg-red-800/30'}`}>
          {result ? (
            <div>
              <div className="font-semibold">Correct — phishing detected.</div>
              <div className="text-sm text-gray-300">Explanation: suspicious domain or urgent reset language.</div>
            </div>
          ) : (
            <div>
              <div className="font-semibold">Not phishing — safe.</div>
              <div className="text-sm text-gray-300">Explanation: newsletter style or trusted sender.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PasswordStrengthSim() {
  const [pwd, setPwd] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyse = (value) => {
    setPwd(value);
    const lengthScore = Math.min(40, value.length * 2);
    const variety = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].reduce((acc, rx) => acc + (rx.test(value) ? 15 : 0), 0);
    const score = Math.min(100, lengthScore + variety - (/(password|12345|qwerty)/i.test(value) ? 30 : 0));
    let strength = 'Weak';
    if (score > 80) strength = 'Strong'; else if (score > 50) strength = 'Okay';
    setAnalysis({ score, strength });
  };

  return (
    <div className="p-4">
      <div className="mb-2 text-sm text-gray-300">Type a password to see a quick strength check and tips.</div>
      <input value={pwd} onChange={(e) => analyse(e.target.value)} className="w-full p-2 rounded bg-gray-900 border border-gray-700" placeholder="Try: correct-horse-battery-staple" />
      {analysis && (
        <div className="mt-3">
          <div className="text-sm">Score: <span className="font-mono">{analysis.score}</span> — {analysis.strength}</div>
          <ul className="text-xs text-gray-400 mt-2 list-disc pl-5">
            <li>Use a long phrase instead of single words.</li>
            <li>Include at least three character classes (upper/lower/number/symbol).</li>
            <li>Avoid common patterns or words.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------
   Main exported module with routing
   ------------------------ */
export default function LearningModule() {
  return (
    <ProgressProvider>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-gray-100">
        <Routes>
          <Route path="/" element={<LearningHome />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="track/:id" element={<TrackPage />} />
          <Route path="lesson/:id" element={<LessonPage />} />
          <Route path="quiz/:id" element={<QuizPage />} />
          <Route path="simulations" element={<SimulationHome />} />
          <Route path="simulations/phishing" element={<div className="p-6 max-w-3xl mx-auto"><Card><PhishingSim /></Card></div>} />
          <Route path="simulations/password" element={<div className="p-6 max-w-3xl mx-auto"><Card><PasswordStrengthSim /></Card></div>} />
          <Route path="simulations/firewall" element={<div className="p-6 max-w-3xl mx-auto"><Card><FirewallSim /></Card></div>} />
          <Route path="simulations/xss" element={<div className="p-6 max-w-3xl mx-auto"><Card><XSSSim /></Card></div>} />
          <Route path="simulations/sqli" element={<div className="p-6 max-w-3xl mx-auto"><Card><SQLiSim /></Card></div>} />
          <Route path="resources" element={<ResourcesPage />} />
        </Routes>
      </div>
    </ProgressProvider>
  );
}

/* ------------------------
   Resources Page
   ------------------------ */
function ResourcesPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-200 mb-4">Resources Library</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {RESOURCES.map(r => (
          <Card key={r.id}>
            <h3 className="font-semibold">{r.title}</h3>
            <div className="text-xs text-gray-400">{r.type}</div>
            <div className="mt-3">
              <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-cyan-300">Open Resource</a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------
   Integration notes
   ------------------------ */
// 1) Save this file as src/learning/LearningModule.jsx
// 2) Add route in App.jsx: <Route path="/learning/*" element={<LearningModule/>} />
// 3) This file intentionally keeps all learning content in one place for simplicity.
// 4) When the file grows too large, split LESSONS/QUIZZES/RESOURCES into JSON files and move simulations to their own components.

// Enjoy — ask me to split this into multiple files or produce a PR/patch next.
