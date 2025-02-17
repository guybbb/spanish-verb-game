"use client";
import { useState, useEffect } from "react";
import Quiz from "./Quiz";
import styles from "./QuizSection.module.css";
import StatsView from "./StatsView";

export default function QuizSection({ title, questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [mistakes, setMistakes] = useState([]);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (isCorrect, question) => {
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (!isCorrect) {
      setMistakes(prev => [...prev, {
        verb: question.verb,
        person: question.person,
        correctAnswer: question.correctAnswer
      }]);
    }

    setCurrentIndex(prev => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setMistakes([]);
    setCompleted(false);
  };

  if (currentIndex >= questions.length) {
    return (
      <StatsView
        stats={{
          mistakes,
          totalQuestions: questions.length,
          tense: title
        }}
        onRestart={handleRestart}
        onChangeTense={() => window.location.reload()}
      />
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div>
      <Quiz
        key={currentIndex}
        question={currentQuestion}
        onAnswer={(isCorrect) => handleAnswer(isCorrect, currentQuestion)}
        total={questions.length}
        current={currentIndex + 1}
      />
    </div>
  );
}