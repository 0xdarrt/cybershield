import React, { useState } from 'react';
import { CheckCircle, XCircle, Award, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const QUESTIONS = [
    {
        id: 1,
        question: "What is the most common method used to deliver ransomware?",
        options: ["Phishing Emails", "USB Drives", "Bluetooth", "Public Wi-Fi"],
        answer: 0
    },
    {
        id: 2,
        question: "What does '2FA' stand for?",
        options: ["Two-Factor Authorization", "Two-Factor Authentication", "To-For Access", "Double Firewall Access"],
        answer: 1
    },
    {
        id: 3,
        question: "Which of these is a sign of a phishing website?",
        options: ["https:// protocol", "Padlock icon", "Misspelled domain name", "Professional design"],
        answer: 2
    },
    {
        id: 4,
        question: "What is a 'Zero-Day' vulnerability?",
        options: ["A virus that deletes data in 0 days", "A flaw known to vendors for 0 days", "A patch released on Sunday", "None of the above"],
        answer: 1
    },
    {
        id: 5,
        question: "What is the best password practice?",
        options: ["Using 'password123'", "Using the same password everywhere", "Using a password manager & unique phrases", "Writing it on a sticky note"],
        answer: 2
    }
];

const QuizComponent = () => {
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleAnswer = (index) => {
        setSelected(index);
        if (index === QUESTIONS[currentQ].answer) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQ < QUESTIONS.length - 1) {
                setCurrentQ(currentQ + 1);
                setSelected(null);
            } else {
                setShowResult(true);
            }
        }, 1000);
    };

    const resetQuiz = () => {
        setCurrentQ(0);
        setScore(0);
        setShowResult(false);
        setSelected(null);
    };

    if (showResult) {
        return (
            <div className="card-cyber p-8 text-center space-y-6">
                <Award className="w-20 h-20 text-accent mx-auto animate-bounce" />
                <h2 className="text-3xl font-display font-bold text-white">ASSESSMENT COMPLETE</h2>

                <div className="text-6xl font-black text-primary text-glow">
                    {score} / {QUESTIONS.length}
                </div>

                <p className="text-muted text-lg">
                    {score === QUESTIONS.length ? "EXCELLENT. YOU ARE CYBER-SECURE." :
                        score > 2 ? "GOOD. BUT VIGILANCE IS REQUIRED." :
                            "CRITICAL. IMMEDIATE TRAINING RECOMMENDED."}
                </p>

                <button onClick={resetQuiz} className="btn-cyber flex items-center gap-2 mx-auto">
                    <RefreshCw className="w-4 h-4" /> RETAKE_ASSESSMENT
                </button>
            </div>
        );
    }

    return (
        <div className="card-cyber p-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <span className="font-mono text-primary">QUESTION {currentQ + 1}/{QUESTIONS.length}</span>
                <span className="font-mono text-muted">SCORE: {score}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-8 min-h-[60px]">
                {QUESTIONS[currentQ].question}
            </h3>

            <div className="space-y-3">
                {QUESTIONS[currentQ].options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selected !== null}
                        className={`w-full p-4 text-left rounded border transition-all duration-300 flex justify-between items-center ${selected === index
                                ? index === QUESTIONS[currentQ].answer
                                    ? 'bg-green-500/20 border-green-500 text-green-500'
                                    : 'bg-red-500/20 border-red-500 text-red-500'
                                : 'bg-black/40 border-white/10 hover:border-primary hover:bg-primary/5 text-white'
                            }`}
                    >
                        <span className="font-mono">{option}</span>
                        {selected === index && (
                            index === QUESTIONS[currentQ].answer
                                ? <CheckCircle className="w-5 h-5" />
                                : <XCircle className="w-5 h-5" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuizComponent;
