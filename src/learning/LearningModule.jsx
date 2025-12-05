// cybershield-learning-section.jsx
// Single-file React "Learning Module" you can drop into your CyberShield app.
// - Uses Tailwind CSS classes
// - Uses react-router-dom (expects your app to already provide a <BrowserRouter>)
// - Exports default `LearningModule` component which contains nested routes under `/learning/*`
// - Includes lessons (short), quizzes, two simulations (phishing + password strength), and localStorage-backed progress

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
      return raw ? JSON.parse(raw) : { lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [] };
    } catch (e) {
      return { lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  }, [state]);

  const markLessonComplete = (id, xp = 10) => {
    setState(prev => {
      if (prev.lessonsCompleted[id]) return prev; // already done
      const next = { ...prev, lessonsCompleted: { ...prev.lessonsCompleted, [id]: true }, xp: prev.xp + xp };
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
    setState({ lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [] });
  };

  return (
    <ProgressContext.Provider value={{ state, markLessonComplete, recordQuizScore, awardBadge, resetProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

/* ------------------------
   Sample lesson & quiz data
   In a real project move these to src/data/learning/*.js or fetch from an API
   ------------------------ */
const LESSONS = [
  {
    id: 'phishing-101',
    title: 'What is Phishing?',
    short: 'Phishing is a social engineering attack where attackers try to trick you into revealing sensitive information.',
    bullets: [
      'Emails or messages pretending to be trusted sources',
      'Urgent language, bad grammar, mismatched links',
      'Never enter credentials after following a link — always go to the real site directly'
    ],
    interactive: 'phishing-sim'
  },
  {
    id: 'passwords',
    title: 'Passwords & Best Practices',
    short: 'Use strong, unique passwords and a password manager. Avoid reusing passwords.',
    bullets: [
      'Aim for long passphrases (12+ chars)',
      'Use a reputable password manager',
      'Enable MFA on critical accounts'
    ],
    interactive: 'password-sim'
  }
];

const QUIZZES = [
  {
    id: 'quiz-phishing',
    title: 'Phishing Detection Quiz',
    questions: [
      {
        id: 'q1',
        text: 'Which of these is a common sign of a phishing email?',
        options: ['Sender address mismatch', 'Perfect grammar', 'Personalized greeting with your username', 'Secure lock icon in the email'],
        answer: 0
      },
      {
        id: 'q2',
        text: 'A link leads to https://login.example.verify-user.com. Is that likely safe?',
        options: ['Yes — it looks like example.com', 'No — domain has extra tokens', 'Only if there is HTTPS', 'Yes if the email said so'],
        answer: 1
      }
    ]
  },
  {
    id: 'quiz-passwords',
    title: 'Password Hygiene Quiz',
    questions: [
      { id: 'p1', text: 'What is the best way to store many unique passwords?', options: ['Browser only', 'Password manager', 'Write on paper', 'Reuse one strong password'], answer: 1 }
    ]
  }
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

function SectionTitle({ children }) {
  return <h2 className="text-2xl font-semibold mb-2 text-cyan-300">{children}</h2>;
}

/* ------------------------
   Learning Pages
   ------------------------ */
function LearningHome() {
  const navigate = useNavigate();
  const { state, resetProgress } = useProgress();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-cyan-200">CyberShield — Learning</h1>
          <p className="text-sm text-gray-400">Short lessons, quizzes and hands-on simulations to level up your Cyber IQ.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-300">XP: <span className="font-mono">{state.xp}</span></div>
          <div className="text-xs text-gray-400">Badges: {state.badges.join(', ') || '—'}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <SectionTitle>Lessons</SectionTitle>
          <p className="text-gray-300 text-sm mb-4">Short lessons with an interactive example and a mini-quiz.</p>
          <ul className="space-y-2">
            {LESSONS.map(l => (
              <li key={l.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-100">{l.title}</div>
                  <div className="text-xs text-gray-400">{l.short}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/learning/lesson/${l.id}`)} className="px-3 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 text-sm">Open</button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Quizzes</SectionTitle>
          <p className="text-gray-300 text-sm mb-4">Test your knowledge — we score & give XP.</p>
          <ul className="space-y-2">
            {QUIZZES.map(q => (
              <li key={q.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-100">{q.title}</div>
                  <div className="text-xs text-gray-400">{q.questions.length} questions</div>
                </div>
                <div>
                  <Link to={`/learning/quiz/${q.id}`} className="px-3 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600 text-sm">Start</Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionTitle>Simulations</SectionTitle>
          <p className="text-gray-300 text-sm mb-4">Interactive, safe hands-on tasks.</p>
          <div className="flex flex-col gap-2">
            <Link to="/learning/simulations" className="px-3 py-2 rounded bg-violet-600/30 hover:bg-violet-600 text-sm">Open Simulations</Link>
            <button onClick={() => resetProgress()} className="px-3 py-2 rounded border border-gray-600 text-sm">Reset Progress</button>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <SectionTitle>Quick tips</SectionTitle>
          <ul className="list-disc pl-5 text-gray-300">
            <li>Complete lessons to earn XP.</li>
            <li>Badges unlock when you finish categories.</li>
            <li>All data is saved locally (no account required).</li>
          </ul>
        </Card>
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
          <p className="text-sm text-gray-400">{lesson.short}</p>
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
          </div>

          <div className="pt-3 flex gap-2">
            <button onClick={() => { markLessonComplete(lesson.id); }} className="px-3 py-2 rounded bg-cyan-600/40">Mark complete</button>
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

/* ------------------------
   Simulations
   ------------------------ */
function SimulationHome() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-200 mb-4">Simulations</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold">Phishing Simulator</h3>
          <p className="text-sm text-gray-400">Spot the phishing attempt in an inbox-style view.</p>
          <div className="mt-3">
            <Link to="/learning/simulations/phishing" className="px-3 py-2 rounded bg-violet-600/40">Open</Link>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Password Strength</h3>
          <p className="text-sm text-gray-400">Enter a password and see its strength with tips.</p>
          <div className="mt-3">
            <Link to="/learning/simulations/password" className="px-3 py-2 rounded bg-violet-600/40">Open</Link>
          </div>
        </Card>
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
          <Route path="lesson/:id" element={<LessonPage />} />
          <Route path="quiz/:id" element={<QuizPage />} />
          <Route path="simulations" element={<SimulationHome />} />
          <Route path="simulations/phishing" element={<div className="p-6 max-w-3xl mx-auto"><Card><PhishingSim /></Card></div>} />
          <Route path="simulations/password" element={<div className="p-6 max-w-3xl mx-auto"><Card><PasswordStrengthSim /></Card></div>} />
        </Routes>
      </div>
    </ProgressProvider>
  );
}

// ---------- Integration notes (keep in your project README)
// 1) Save this file as `src/learning/LearningModule.jsx`.
// 2) Ensure `react-router-dom` is installed and your App uses <BrowserRouter> around routes.
// 3) Add a route in your main router, for example in App.jsx:
//    <Route path="/learning/*" element={<LearningModule />} />
// 4) Tailwind should already be configured by your project. This component uses Tailwind utility classes.
// 5) Move LESSONS and QUIZZES into separate JSON/JS files or fetch from an API when you're ready to scale.
// 6) If you want a global XP saved to a backend, replace localStorage logic in ProgressProvider with API calls.
// 7) You can expand the simulations folder with sandboxed examples and embed iframes for safe interactive code.

// Enjoy — tell me if you want this split into multiple files and a ready-to-apply patch/PR.

