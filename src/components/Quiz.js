"use client";
import { useState } from "react";
import styles from "./Quiz.module.css";

export default function Quiz({ question, onAnswer }) {
  if (!question) {
    return <div>No question provided.</div>;
  }

  const { questionText, translation, correctAnswer } = question;
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [explanation, setExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = (answer) =>
    answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  const handleSubmit = () => {
    setIsSubmitted(true);
    const correct = checkAnswer(userAnswer);
    setIsCorrect(correct);
    setResult(correct ? "Correct! 🎉" : `Wrong! ❌ (Correct: ${correctAnswer})`);
    setShowExplanation(false);
    setExplanation("");
  };

  const handleExplain = () => {
    if (isCorrect) {
      setExplanation(`Great job! The correct answer is "${correctAnswer}".`);
    } else {
      setExplanation(
        `The correct answer is: "${correctAnswer}". Check your spelling or accent marks.`
      );
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div
      className={`${styles.quizContainer} ${
        result ? (isCorrect ? styles.correctFeedback : styles.wrongFeedback) : ""
      }`}
    >
      <p className={styles.question}>{questionText}</p>
      <p className={styles.translation}>
        <strong>Hint:</strong> {translation}
      </p>
      <input
        type="text"
        className={styles.input}
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type your answer here"
        disabled={isSubmitted}
      />
      <div className={styles.buttonContainer}>
        {!isSubmitted && <button onClick={handleSubmit}>Submit</button>}
        {isSubmitted && <button onClick={handleExplain}>Explain</button>}
        {isSubmitted && <button onClick={handleNext}>Next</button>}
      </div>
      {result && <div className={styles.result}>{result}</div>}
      {showExplanation && <div className={styles.explanation}>{explanation}</div>}
    </div>
  );
}