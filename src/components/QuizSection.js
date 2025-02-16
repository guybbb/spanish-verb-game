"use client";
import { useState, useEffect } from "react";
import Quiz from "./Quiz";
import styles from "./QuizSection.module.css";

export default function QuizSection({ title, questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const percentage = score.total > 0 ? (score.correct / score.total) * 100 : 0;
    if (percentage >= 90 && score.total >= 5) {
      setCompleted(true);
    }
  }, [score]);

  const handleAnswer = (isCorrect) => {
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  if (currentIndex >= questions.length || completed) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>{title} Quiz</h2>
        <p>
          Finished! You got {score.correct}/{score.total} correct (
          {score.total > 0
            ? ((score.correct / score.total) * 100).toFixed(0)
            : 0}
          %)
        </p>
        {completed && (
          <p style={{ color: "green" }}>
            Congratulations! You reached at least 90%!
          </p>
        )}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div>
      <Quiz
        key={currentIndex}
        question={currentQuestion}
        onAnswer={handleAnswer}
        total={questions.length}
        current={currentIndex + 1}
      />
      <div className={styles.score}>
        Score: {score.correct}/{score.total} ({score.total > 0
          ? ((score.correct / score.total) * 100).toFixed(0)
          : 0}%)
      </div>
    </div>
  );
}