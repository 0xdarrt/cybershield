// LearningModule.jsx — Enhanced Learning System (Option D)
// Lessons • Quizzes • Phishing Sim • Password Sim • XP & Badges

import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

/* ------------------------
   Progress System (XP + Badges + Completed)
------------------------ */
const PROGRESS_KEY = "cybershield_learning_progress_v1";
const ProgressContext = createContext(null);

export function useProgress() {
  return useContext(ProgressContext);
}

function ProgressProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {
        lessonsCompleted: {},
        quizScores: {},
        xp: 0,
        badges: []
      };
    } catch {
      return { lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  }, [state]);

  const markLessonComplete = (id, xp = 10) => {
    setState(prev => {
      if (prev.lessonsCompleted[id]) return prev;
      return {
        ...prev,
        lessonsCompleted: { ...prev.lessonsCompleted, [id]: true },
        xp: prev.xp + xp
      };
    });
  };

  const recordQuizScore = (quizId, percent) => {
    setState(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [quizId]: percent },
      xp: prev.xp + Math.round(percent * 0.1)
    }));
  };

  const awardBadge = badge => {
    setState(prev => {
      if (prev.badges.includes(badge)) return prev;
      return { ...prev, badges: [...prev.badges, badge], xp: prev.xp + 20 };
    });
  };

  const resetProgress = () => {
    setState({ lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [] });
  };

  return (
    <ProgressContext.Provider
      value={{ state, markLessonComplete, recordQuizScore, awardBadge, resetProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

/* ------------------------
   Lessons & Quizzes Data
------------------------ */
const LESSONS = [
  {
    id: "phishing-101",
    title: "What is Phishing?",
    short:
      "Phishing is a social engineering attack designed to steal sensitive data using deception.",
    bullets: [
      "Attackers impersonate trusted brands",
      "Look for mismatched URLs, urgency, poor grammar",
      "Never enter credentials from links in emails"
    ],
    interactive: "phishing-sim"
  },
  {
    id: "passwords",
    title: "Passwords & Best Practices",
    short: "Strong, unique passwords protect accounts from brute-force attacks.",
    bullets: [
      "Use long passphrases (12–16+ chars)",
      "Use a password manager",
      "Enable MFA on every important account"
    ],
    interactive: "password-sim"
  }
];

const QUIZZES = [
  {
    id: "quiz-phishing",
    title: "Phishing Detection Quiz",
    questions: [
      {
        id: "q1",
        text: "Which is a common sign of a phishing email?",
        options: [
          "Sender address mismatch",
          "Perfect grammar",
          "Uses your full name",
          "Email contains a lock icon"
        ],
        answer: 0
      },
      {
        id: "q2",
        text: "A link points to login.verify-user.microsoft.com. Safe?",
        options: ["Yes", "No — suspicious domain", "Safe if HTTPS", "Safe if sender claims so"],
        answer: 1
      }
    ]
  },
  {
    id: "quiz-passwords",
    title: "Password Hygiene Quiz",
    questions: [
      {
        id: "p1",
        text: "Best way to store unique passwords?",
        options: ["Write on paper", "Browser only", "Password manager", "Reuse strong password"],
        answer: 2
      }
    ]
  }
];

/* ------------------------
   UI Components
------------------------ */
function Card({ children }) {
  return (
    <div className="bg-gray-900/60 border border-gray-700 p-5 rounded-xl shadow-lg">
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-xl font-bold text-cyan-300 mb-2">{children}</h2>;
}

/* ------------------------
   Learning Home
------------------------ */
function LearningHome() {
  const navigate = useNavigate();
  const { state, resetProgress } = useProgress();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-cyan-200 mb-1">Learning Center</h1>
      <p className="text-gray-400 mb-6">Short lessons, quizzes & simulations.</p>

      <div className="text-sm mb-6">
        <span className="text-gray-300">XP:</span>{" "}
        <span className="font-mono text-cyan-400">{state.xp}</span>
        <br />
        <span className="text-gray-300">Badges:</span>{" "}
        {state.badges.length ? state.badges.join(", ") : "—"}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <SectionTitle>Lessons</SectionTitle>
          {LESSONS.map(l => (
            <div key={l.id} className="mb-3">
              <div className="font-semibold text-gray-100">{l.title}</div>
              <div className="text-xs text-gray-400">{l.short}</div>
              <button
                onClick={() => navigate(`/learning/lesson/${l.id}`)}
                className="mt-2 px-3 py-1 bg-cyan-600/40 rounded text-sm"
              >
                Open
              </button>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle>Quizzes</SectionTitle>
          {QUIZZES.map(q => (
            <div key={q.id} className="mb-3">
              <div className="font-semibold text-gray-100">{q.title}</div>
              <div className="text-xs text-gray-400">{q.questions.length} questions</div>
              <Link
                to={`/learning/quiz/${q.id}`}
                className="mt-2 inline-block px-3 py-1 bg-emerald-600/40 rounded text-sm"
              >
                Start
              </Link>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle>Simulations</SectionTitle>
          <Link
            to="/learning/simulations"
            className="px-3 py-2 bg-violet-600/40 rounded text-sm inline-block mb-3"
          >
            Open Simulations
          </Link>

          <button
            onClick={resetProgress}
            className="px-3 py-2 border border-gray-600 rounded text-sm"
          >
            Reset Progress
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------
   Lesson Page
------------------------ */
function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { markLessonComplete, state } = useProgress();

  const lesson = LESSONS.find(l => l.id === id);

  if (!lesson) return <div className="p-6 text-red-400">Lesson not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-200">{lesson.title}</h1>
      <p className="text-gray-400 mb-4">{lesson.short}</p>

      <Card>
        <SectionTitle>Key Points</SectionTitle>
        <ul className="text-gray-300 list-disc pl-5">
          {lesson.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        <SectionTitle className="mt-4">Interactive</SectionTitle>
        {lesson.interactive === "phishing-sim" && <PhishingSim />}
        {lesson.interactive === "password-sim" && <PasswordStrengthSim />}

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => markLessonComplete(lesson.id)}
            className="px-4 py-2 bg-cyan-600/40 rounded"
          >
            Mark Complete
          </button>
          <button onClick={() => navigate("/learning")} className="px-4 py-2 border rounded">
            Back
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------
   Quiz Page
------------------------ */
function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZZES.find(q => q.id === id);
  const { recordQuizScore } = useProgress();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) return <div className="p-6 text-red-400">Quiz not found</div>;

  const submit = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    const percent = Math.round((correct / quiz.questions.length) * 100);
    setScore(percent);
    setSubmitted(true);
    recordQuizScore(quiz.id, percent);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-200 mb-3">{quiz.title}</h1>

      <Card>
        {quiz.questions.map((q, i) => (
          <div key={q.id} className="mb-4">
            <div className="font-semibold text-gray-100">
              {i + 1}. {q.text}
            </div>
            <div className="mt-2">
              {q.options.map((opt, idx) => {
                const chosen = answers[q.id] === idx;
                const correct = submitted && q.answer === idx;
                const wrong = submitted && chosen && q.answer !== idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setAnswers({ ...answers, [q.id]: idx })}
                    className={`block w-full text-left p-2 rounded border my-1 ${
                      chosen ? "border-cyan-500" : "border-gray-700"
                    } ${correct ? "bg-emerald-600/30" : ""} ${
                      wrong ? "bg-red-600/30" : ""
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {!submitted ? (
          <button onClick={submit} className="px-4 py-2 bg-emerald-600 rounded">
            Submit
          </button>
        ) : (
          <div>
            <div className="text-lg font-bold mt-3">Score: {score}%</div>
            <button
              onClick={() => navigate("/learning")}
              className="mt-3 px-3 py-2 border rounded"
            >
              Done
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ------------------------
   Simulations
------------------------ */
function SimulationHome() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-200 mb-4">Simulations</h1>
      <div className="grid gap-4">

        <Card>
          <h3 className="font-semibold">Phishing Simulator</h3>
          <p className="text-sm text-gray-400">Identify phishing emails.</p>
          <Link
            to="/learning/simulations/phishing"
            className="mt-2 inline-block px-3 py-2 bg-violet-600/40 rounded text-sm"
          >
            Open
          </Link>
        </Card>

        <Card>
          <h3 className="font-semibold">Password Strength Simulator</h3>
          <p className="text-sm text-gray-400">Test password strength.</p>
          <Link
            to="/learning/simulations/password"
            className="mt-2 inline-block px-3 py-2 bg-violet-600/40 rounded text-sm"
          >
            Open
          </Link>
        </Card>

      </div>
    </div>
  );
}

/* ------------------------
   Phishing Simulation
------------------------ */
function PhishingSim() {
  const { awardBadge } = useProgress();
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const emails = [
    {
      id: 1,
      from: "it-support@company.com",
      subj: "Password Reset Required",
      snippet: "Your password expires today. Click here to reset."
    },
    {
      id: 2,
      from: "newsletter@trusted.com",
      subj: "Your Weekly Digest",
      snippet: "Here is your curated news."
    },
    {
      id: 3,
      from: "security@bank.com",
      subj: "Unusual Login Attempt",
      snippet: "Verify your identity: bank-secure-login.com"
    }
  ];

  const check = email => {
    const phishing =
      email.snippet.includes("reset") ||
      email.snippet.includes("secure-login") ||
      email.subj.toLowerCase().includes("reset");

    setSelected(email.id);
    setResult(phishing);

    if (phishing) awardBadge("Phishing Hunter");
  };

  return (
    <div>
      {emails.map(e => (
        <button
          key={e.id}
          onClick={() => check(e)}
          className={`w-full p-3 rounded border mb-2 text-left ${
            selected === e.id ? "border-cyan-500" : "border-gray-700"
          }`}
        >
          <div className="font-semibold text-gray-200">{e.subj}</div>
          <div className="text-xs text-gray-400">{e.from}</div>
          <div className="text-xs text-gray-500">{e.snippet}</div>
        </button>
      ))}

      {result !== null && (
        <div
          className={`mt-3 p-3 rounded ${
            result ? "bg-emerald-600/30" : "bg-red-600/30"
          }`}
        >
          {result ? "Correct — This is phishing." : "Incorrect — This one was safe."}
        </div>
      )}
    </div>
  );
}

/* ------------------------
   Password Strength Simulation
------------------------ */
function PasswordStrengthSim() {
  const [pwd, setPwd] = useState("");
  const [score, setScore] = useState(null);

  const analyse = val => {
    setPwd(val);
    let s = 0;

    if (val.length > 8) s += 30;
    if (val.length > 12) s += 20;
    if (/[A-Z]/.test(val)) s += 15;
    if (/[0-9]/.test(val)) s += 15;
    if (/[^A-Za-z0-9]/.test(val)) s += 20;

    if (/password|12345|qwerty/i.test(val)) s -= 30;

    setScore(Math.max(0, Math.min(100, s)));
  };

  return (
    <div className="mt-2">
      <input
        className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
        placeholder="Type a password..."
        value={pwd}
        onChange={e => analyse(e.target.value)}
      />
      {score !== null && (
        <div className="mt-3 text-gray-300">
          Strength Score: <span className="font-bold">{score}</span>/100
        </div>
      )}
    </div>
  );
}

/* ------------------------
   Main Exported Module
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
          <Route
            path="simulations/phishing"
            element={
              <div className="p-6 max-w-3xl mx-auto">
                <Card>
                  <PhishingSim />
                </Card>
              </div>
            }
          />
          <Route
            path="simulations/password"
            element={
              <div className="p-6 max-w-3xl mx-auto">
                <Card>
                  <PasswordStrengthSim />
                </Card>
              </div>
            }
          />
        </Routes>
      </div>
    </ProgressProvider>
  );
}
