import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

/* ------------------------
   Progress Provider (Minimal Safe Version)
------------------------ */
const ProgressContext = createContext(null);

function useProgress() {
  return useContext(ProgressContext);
}

function ProgressProvider({ children }) {
  const [state, setState] = useState({
    lessonsCompleted: {},
    xp: 0
  });

  return (
    <ProgressContext.Provider value={{ state }}>
      {children}
    </ProgressContext.Provider>
  );
}

/* ------------------------
   Minimal Data
------------------------ */
const LESSONS = [
  {
    id: "phishing-101",
    title: "What is Phishing?",
    short: "Attackers try to steal data by pretending to be trusted sources."
  }
];

/* ------------------------
   Pages
------------------------ */
function LearningHome() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Learning Center</h1>

      {LESSONS.map((l) => (
        <div key={l.id} className="mb-4">
          <div className="text-xl font-semibold">{l.title}</div>
          <div className="text-gray-400 text-sm">{l.short}</div>
          <Link
            to={`/learning/lesson/${l.id}`}
            className="mt-2 inline-block bg-cyan-600 px-3 py-1 rounded"
          >
            Open
          </Link>
        </div>
      ))}
    </div>
  );
}

function LessonPage() {
  const { id } = useParams();
  const lesson = LESSONS.find((l) => l.id === id);

  if (!lesson) return <div className="p-6 text-red-400">Lesson not found</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold">{lesson.title}</h1>
      <p className="text-gray-400 mt-2">{lesson.short}</p>
      <Link
        to="/learning"
        className="mt-4 inline-block border px-3 py-1 rounded"
      >
        Back
      </Link>
    </div>
  );
}

/* ------------------------
   Exported Module
------------------------ */
export default function LearningModule() {
  return (
    <ProgressProvider>
      <Routes>
        <Route path="/" element={<LearningHome />} />
        <Route path="lesson/:id" element={<LessonPage />} />
      </Routes>
    </ProgressProvider>
  );
}
