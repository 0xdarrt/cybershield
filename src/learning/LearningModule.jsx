// src/learning/LearningModule.jsx
// Full Learning Module: Lessons + Quizzes + Simulations + XP

import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

/* ------------------------
   Progress System (XP + Badges)
------------------------ */
const PROGRESS_KEY = "cybershield_learning_progress_v1";
const ProgressContext = createContext(null);

function useProgress() {
  return useContext(ProgressContext);
}

function ProgressProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw
        ? JSON.parse(raw)
        : { lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [] };
    } catch {
      return { lessonsCompleted: {}, quizScores: {}, xp: 0, badges: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  }, [state]);

  const markLessonComplete = (id, xp = 10) => {
    setState((prev) => {
      if (prev.lessonsCompleted[id]) return prev;
      return {
        ...prev,
        lessonsCompleted: { ...prev.lessonsCompleted, [id]: true },
        xp: prev.xp + xp,
      };
    });
  };

  const recordQuizScore = (quizId, percent) => {
    setState((prev) => ({
      ...prev,
      quizScores: { ...prev.quizScores, [quizId]: percent },
      xp: prev.xp + Math.round(percent * 0.1),
    }));
  };

  const awardBadge = (badge) => {
    setState((prev) => {
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
      "Phishing is when attackers pretend to be trusted sources to trick you into revealing sensitive information.",
    bullets: [
      "Often comes as emails, SMS, DMs or fake login pages.",
      "Red flags: urgency, threats (“your account will be closed”), bad grammar, weird links.",
      "Always check the real domain in the address bar before entering credentials.",
      "When in doubt, manually type the site URL instead of clicking links.",
    ],
    interactive: "phishing-sim",
    quizId: "quiz-phishing",
  },
  {
    id: "passwords",
    title: "Passwords & Best Practices",
    short:
      "Strong, unique passwords help prevent account takeover and credential stuffing attacks.",
    bullets: [
      "Use passphrases (3–4 random words) instead of short complex strings.",
      "Never reuse passwords across important accounts (email, banking, social).",
      "Use a password manager to store and generate strong passwords.",
      "Turn on multi-factor authentication (MFA) wherever possible.",
    ],
    interactive: "password-sim",
    quizId: "quiz-passwords",
  },
];

const QUIZZES = [
  {
    id: "quiz-phishing",
    title: "Phishing Detection Quiz",
    questions: [
      {
        id: "q1",
        text: "Which of these is a common sign of a phishing email?",
        options: [
          "Sender address looks slightly misspelled",
          "Email has perfect design and grammar",
          "It greets you with your full legal name",
          "It has a padlock icon in the email body",
        ],
        answer: 0,
      },
      {
        id: "q2",
        text: "The link shown is login.microsoft.com.verify-user.net. Is this safe?",
        options: [
          "Yes, it contains microsoft.com",
          "No, the real domain is verify-user.net",
          "Safe if the email came from 'support@microsoft.com'",
          "Safe if it uses HTTPS",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "quiz-passwords",
    title: "Password Hygiene Quiz",
    questions: [
      {
        id: "p1",
        text: "Best way to manage many unique passwords?",
        options: [
          "Write them in a notebook",
          "Use the same strong password everywhere",
          "Use a password manager",
          "Only rely on browser autofill",
        ],
        answer: 2,
      },
    ],
  },
];

/* ------------------------
   Small UI helpers
------------------------ */
function Card({ children, className = "" }) {
  return (
    <div
      className={
        "bg-gray-900/70 border border-gray-700 rounded-xl p-5 shadow-lg " +
        className
      }
    >
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-200">Learning Center</h1>
          <p className="text-gray-400">
            Short lessons, quizzes & simulations to build real-world security skills.
          </p>
        </div>
        <div className="text-right text-sm">
          <div>
            XP: <span className="font-mono text-cyan-400">{state.xp}</span>
          </div>
          <div className="text-gray-400">
            Badges: {state.badges.length ? state.badges.join(", ") : "—"}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Lessons */}
        <Card>
          <SectionTitle>Lessons</SectionTitle>
          <p className="text-sm text-gray-300 mb-3">
            Each lesson gives you explained concepts + an interactive demo.
          </p>
          <div className="space-y-3">
            {LESSONS.map((l) => (
              <div key={l.id} className="border border-gray-700 rounded-lg p-3">
                <div className="font-semibold text-gray-100">{l.title}</div>
                <div className="text-xs text-gray-400 mb-2">{l.short}</div>
                <button
                  onClick={() => navigate(`/learning/lesson/${l.id}`)}
                  className="text-xs px-3 py-1 rounded bg-cyan-600/60 hover:bg-cyan-500"
                >
                  Open Lesson
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Quizzes */}
        <Card>
          <SectionTitle>Quizzes</SectionTitle>
          <p className="text-sm text-gray-300 mb-3">
            Test your understanding and earn XP.
          </p>
          <div className="space-y-3">
            {QUIZZES.map((q) => (
              <div key={q.id} className="border border-gray-700 rounded-lg p-3">
                <div className="font-semibold text-gray-100">{q.title}</div>
                <div className="text-xs text-gray-400 mb-1">
                  {q.questions.length} questions
                </div>
                <Link
                  to={`/learning/quiz/${q.id}`}
                  className="text-xs inline-block px-3 py-1 rounded bg-emerald-600/60 hover:bg-emerald-500"
                >
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Simulations */}
        <Card>
          <SectionTitle>Simulations</SectionTitle>
          <p className="text-sm text-gray-300 mb-3">
            Practice spotting phishing or testing password strength safely.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/learning/simulations"
              className="px-3 py-2 rounded bg-violet-600/60 hover:bg-violet-500 text-sm text-center"
            >
              Open Simulations
            </Link>
            <button
              onClick={resetProgress}
              className="px-3 py-2 rounded border border-gray-600 text-xs text-gray-300 hover:border-gray-400"
            >
              Reset Progress
            </button>
          </div>
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

  const lesson = LESSONS.find((l) => l.id === id);

  if (!lesson) {
    return <div className="p-6 text-red-400">Lesson not found.</div>;
  }

  const completed = !!state.lessonsCompleted[lesson.id];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-200 mb-2">{lesson.title}</h1>
      <p className="text-gray-400 mb-4">{lesson.short}</p>

      <Card>
        <SectionTitle>Key Concepts</SectionTitle>
        <ul className="list-disc pl-5 text-gray-200 text-sm space-y-1">
          {lesson.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        <SectionTitle>Interactive Demo</SectionTitle>
        {lesson.interactive === "phishing-sim" && <PhishingSim />}
        {lesson.interactive === "password-sim" && <PasswordStrengthSim />}

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => markLessonComplete(lesson.id)}
            className="px-4 py-2 rounded bg-cyan-600/70 hover:bg-cyan-500 text-sm"
          >
            {completed ? "Completed ✔" : "Mark as Completed"}
          </button>
          {lesson.quizId && (
            <Link
              to={`/learning/quiz/${lesson.quizId}`}
              className="px-4 py-2 rounded bg-emerald-600/70 hover:bg-emerald-500 text-sm"
            >
              Take Quiz
            </Link>
          )}
          <button
            onClick={() => navigate("/learning")}
            className="px-4 py-2 rounded border border-gray-600 text-sm"
          >
            Back to Learning Home
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
  const quiz = QUIZZES.find((q) => q.id === id);
  const navigate = useNavigate();
  const { recordQuizScore } = useProgress();

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return <div className="p-6 text-red-400">Quiz not found.</div>;
  }

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q) => {
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
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="mb-4">
            <div className="font-semibold text-gray-100 mb-1">
              {idx + 1}. {q.text}
            </div>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const chosen = answers[q.id] === i;
                const correct = submitted && q.answer === i;
                const wrong = submitted && chosen && q.answer !== i;

                return (
                  <button
                    key={i}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: i }))
                    }
                    className={`w-full text-left text-sm px-3 py-2 rounded border ${
                      chosen ? "border-cyan-400" : "border-gray-700"
                    } ${correct ? "bg-emerald-700/40" : ""} ${
                      wrong ? "bg-red-700/40" : ""
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
          <button
            onClick={handleSubmit}
            className="mt-2 px-4 py-2 rounded bg-emerald-600/80 hover:bg-emerald-500 text-sm"
          >
            Submit
          </button>
        ) : (
          <div className="mt-3">
            <div className="text-lg font-semibold text-gray-100">
              Score: {score}%
            </div>
            <button
              onClick={() => navigate("/learning")}
              className="mt-2 px-4 py-2 rounded border border-gray-600 text-sm"
            >
              Back to Learning Home
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ------------------------
   Simulations Home
------------------------ */
function SimulationHome() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-200 mb-4">Simulations</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-semibold text-gray-100 mb-1">Phishing Simulator</h3>
          <p className="text-sm text-gray-400 mb-2">
            Practice spotting phishing emails in a safe environment.
          </p>
          <Link
            to="/learning/simulations/phishing"
            className="inline-block text-xs px-3 py-1 rounded bg-violet-600/70 hover:bg-violet-500"
          >
            Open Simulator
          </Link>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-100 mb-1">
            Password Strength Checker
          </h3>
          <p className="text-sm text-gray-400 mb-2">
            Type a password and see how strong it is.
          </p>
          <Link
            to="/learning/simulations/password"
            className="inline-block text-xs px-3 py-1 rounded bg-violet-600/70 hover:bg-violet-500"
          >
            Open Checker
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
      from: "it-support@corp-security.com",
      subj: "URGENT: Password Reset Required",
      snippet: "Your account will be locked. Reset here: secure-login-reset.com",
    },
    {
      id: 2,
      from: "newsletter@trustednews.com",
      subj: "Your Weekly Security Digest",
      snippet: "Here are the top stories this week...",
    },
    {
      id: 3,
      from: "alerts@mybank.com",
      subj: "Unusual Login Attempt Detected",
      snippet: "Confirm your identity at mybank-verify-login.com",
    },
  ];

  const check = (email) => {
    const phishing =
      email.subj.toLowerCase().includes("reset") ||
      email.snippet.includes("reset") ||
      email.snippet.includes("verify-login");

    setSelected(email.id);
    setResult(phishing);
    if (phishing) awardBadge("Phishing Hunter");
  };

  return (
    <div>
      <p className="text-sm text-gray-300 mb-3">
        Click the email you think is a phishing attempt.
      </p>
      {emails.map((e) => (
        <button
          key={e.id}
          onClick={() => check(e)}
          className={`w-full text-left p-3 rounded border mb-2 ${
            selected === e.id ? "border-cyan-400" : "border-gray-700"
          }`}
        >
          <div className="font-semibold text-gray-100">{e.subj}</div>
          <div className="text-xs text-gray-400">{e.from}</div>
          <div className="text-xs text-gray-500">{e.snippet}</div>
        </button>
      ))}

      {result !== null && (
        <div
          className={`mt-3 p-3 rounded text-sm ${
            result ? "bg-emerald-700/40 text-emerald-100" : "bg-red-700/40 text-red-100"
          }`}
        >
          {result
            ? "Correct – that was a phishing-style email."
            : "This one is more like a normal, safe email."}
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

  const analyse = (val) => {
    setPwd(val);
    let s = 0;
    if (val.length >= 8) s += 30;
    if (val.length >= 12) s += 20;
    if (/[A-Z]/.test(val)) s += 15;
    if (/[0-9]/.test(val)) s += 15;
    if (/[^A-Za-z0-9]/.test(val)) s += 20;
    if (/password|12345|qwerty|admin/i.test(val)) s -= 40;

    s = Math.max(0, Math.min(100, s));
    setScore(s);
  };

  let label = "";
  if (score === null) label = "";
  else if (score < 40) label = "Weak";
  else if (score < 70) label = "Okay";
  else label = "Strong";

  return (
    <div>
      <p className="text-sm text-gray-300 mb-2">
        Type a password (no real passwords please, just examples).
      </p>
      <input
        value={pwd}
        onChange={(e) => analyse(e.target.value)}
        className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 text-sm"
        placeholder="Example: correct-horse-battery-staple"
      />
      {score !== null && (
        <div className="mt-3 text-sm text-gray-200">
          Score: <span className="font-mono">{score}</span>/100 — {label}
        </div>
      )}
    </div>
  );
}

/* ------------------------
   Main Export
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
