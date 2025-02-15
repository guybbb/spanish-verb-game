// src/components/Quiz.js
"use client";
import { useState, useEffect } from "react";
import styles from "./Quiz.module.css";

export default function Quiz({ question, onAnswer }) {
  // Suppose `question` has `verb`, `correctAnswer`, and optionally `tense`.
  const { verb, correctAnswer, tense, person } = question;

  // Manage user input and quiz flow
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [explanation, setExplanation] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Example sentence data
  const [exampleData, setExampleData] = useState(null);
  const [loadingExample, setLoadingExample] = useState(false);

  /**
   * Insert the correct verb after submission.
   * If user was wrong, show the verb in red.
   */
  const getFullSentence = (sentence) => {
    if (!isSubmitted) return sentence; // Show blank until user submits

    const [beforeBlank, afterBlank] = sentence.split("____");
    const verbElement = isCorrect ? (
      correctAnswer
    ) : (
      <span style={{ color: "red" }}>{correctAnswer}</span>
    );

    return (
      <>
        {beforeBlank}
        {verbElement}
        {afterBlank}
      </>
    );
  };

  // Check if user’s answer matches the correct form
  const checkAnswer = (answer) =>
    answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  // On Submit
  const handleSubmit = () => {
    setIsSubmitted(true);
    const correct = checkAnswer(userAnswer);
    setIsCorrect(correct);
    setResult(correct ? "Correct! 🎉" : `Wrong! ❌ (Correct: ${correctAnswer})`);
    setShowExplanation(false);
    setExplanation("");
  };

  // On Explain
  const handleExplain = () => {
    if (isCorrect) {
      setExplanation(`Great job! The correct answer is "${correctAnswer}".`);
    } else {
      setExplanation(
        `The correct answer is "${correctAnswer}". Check your spelling or accent marks.`
      );
    }
    setShowExplanation(true);
  };

  // On Next
  const handleNext = () => {
    onAnswer(isCorrect);
  };

  // Auto-generate an example sentence on mount
  useEffect(() => {
    const generateExample = async () => {
      setLoadingExample(true);
      setExampleData(null);
      try {
        // Minimal prompt referencing the verb
        const prompt = `
You are helping a student practice Spanish conjugation.
Use the Spanish verb "${verb}" with ${person} but replavce the verb with a blank (____).
Return strictly JSON with:
{
  "sentence": "...",
  "wordTranslations": { ... }
}
Where:
- "sentence" is a Spanish sentence containing the subject (implied by the quiz) and a blank in place of the verb.
- "wordTranslations" is a dictionary mapping each non-blank word to its English translation.
        `;
        const response = await fetch("/api/generateExample", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await response.json();
        setExampleData(data);
      } catch (error) {
        console.error("Error generating example sentence:", error);
      } finally {
        setLoadingExample(false);
      }
    };

    generateExample();
  }, [verb]);

  return (
    <div
      className={`${styles.quizContainer} ${
        result ? (isCorrect ? styles.correctFeedback : styles.wrongFeedback) : ""
      }`}
    >
      {/* 1. Title / Tense */}
      <header className={styles.headerSection}>
        {tense && (
          <h2 className={styles.tenseTitle}>
            Tense: {tense.toUpperCase()} Quiz
          </h2>
        )}
        <p className={styles.personaVerb}>
          <strong>Persona / Verb:</strong> {verb.toUpperCase()}
        </p>
      </header>

      {/* 2. Example Sentence (Context) */}
      {exampleData && (
        <section className={styles.exampleCard}>
          <h4 className={styles.cardTitle}>Example Sentence</h4>
          <p className={styles.cardSentence}>
            {loadingExample
              ? "Loading..."
              : getFullSentence(exampleData.sentence)}
          </p>
          <div className={styles.wordTranslations}>
            {Object.entries(exampleData.wordTranslations).map(
              ([word, trans]) => (
                <p key={word}>
                  <strong>{word}</strong>: {trans}
                </p>
              )
            )}
          </div>
        </section>
      )}

      {/* 3. Answer Input & Buttons */}
      <section className={styles.answerSection}>
        <label htmlFor="answerInput" className={styles.answerLabel}>
          Enter the correct form:
        </label>
        <input
          id="answerInput"
          type="text"
          className={styles.input}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here"
          disabled={isSubmitted}
        />
        <div className={styles.buttonContainer}>
          {!isSubmitted && (
            <button onClick={handleSubmit} disabled={!userAnswer.trim()}>
              Submit
            </button>
          )}
          {isSubmitted && <button onClick={handleExplain}>Explain</button>}
          {isSubmitted && <button onClick={handleNext}>Next</button>}
        </div>
      </section>

      {/* 4. Feedback (Correct/Wrong + Explanation) */}
      {result && <div className={styles.result}>{result}</div>}
      {showExplanation && (
        <div className={styles.explanation}>{explanation}</div>
      )}
    </div>
  );
}