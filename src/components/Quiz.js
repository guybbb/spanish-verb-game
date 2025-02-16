// src/components/Quiz.js
"use client";
import { useState, useEffect } from "react";
import styles from "./Quiz.module.css";

export default function Quiz({ question, onAnswer }) {
  // Suppose `question` has `verb`, `correctAnswer`, and optionally `tense`.
  const { verb, correctAnswer, tense, person } = question;
  console.log(tense);

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
    const verbStyle = {
      color: isCorrect ? "#22c55e" : "#ef4444",  // green-500 for correct, red-500 for wrong
      fontWeight: "600"
    };
  
    return (
      <>
        {beforeBlank}
        <span style={verbStyle}>{correctAnswer}</span>
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
    setResult(
      correct ? "Correct! 🎉" : `Wrong! ❌ (Correct: ${correctAnswer})`
    );
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
Use the Spanish verb "${verb}" with person:${person} in tense:${tense} but replavce the verb with a blank (____).
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
      <div className={styles.quizContainer}>
        <header className={styles.header}>
          <div className={styles.progressBar}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: '30%' }} />
            </div>
            <span className={styles.progressText}>Question 3/10</span>
          </div>
          <div className={styles.personaVerb}>{verb.toUpperCase()}</div>
        </header>
  
      <main className={styles.mainContent}>
        {exampleData && (
          <section className={styles.exampleCard}>
            <p className={styles.cardSentence}>
              {loadingExample ? "Loading..." : getFullSentence(exampleData.sentence)}
            </p>
            <div className={styles.wordTranslations}>
              {Object.entries(exampleData.wordTranslations).map(([word, trans]) => (
                <p key={word}>
                  <strong>{word}</strong>: {trans}
                </p>
              ))}
            </div>
          </section>
        )}
  
        <section className={styles.answerSection}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!isSubmitted && userAnswer.trim()) {
              handleSubmit();
            } else if (isSubmitted) {
              handleNext();
            }
          }}>
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
                  !isSubmitted ? styles.buttonNeutral 
                  : isCorrect ? styles.buttonCorrect 
                  : styles.buttonWrong
                }`}
                disabled={!isSubmitted && !userAnswer.trim()}
              >
                {!isSubmitted ? 'Submit' : 'Continue'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
