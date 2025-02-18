"use client";
import { useState } from "react";
import styles from "./Quiz.module.css";

export function QuizForm({ onSubmit, onNext, isSubmitted, isCorrect }) {
  const [userAnswer, setUserAnswer] = useState("");

  const handleSubmit = () => {    
    onSubmit(userAnswer);
  };

  return (
    <section className={styles.answerSection}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSubmitted && userAnswer.trim()) {
            handleSubmit();
          } else if (isSubmitted) {
            onNext();
          }
        }}
      >
        <input
          type="text"
          className={styles.input}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here"
          disabled={isSubmitted}
          autoFocus
        />
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${
              !isSubmitted
                ? styles.buttonNeutral
                : isCorrect
                ? styles.buttonCorrect
                : styles.buttonWrong
            }`}
            disabled={!isSubmitted && !userAnswer.trim()}
          >
            {!isSubmitted ? "Submit" : "Continue"}
          </button>
        </div>
      </form>
    </section>
  );
}
