import { useState } from "react";
import { generateQuestionsForTense } from "../utils/generateQuestions";
import QuizSection from "../components/QuizSection";
import styles from "../components/Home.module.css";

const tenses = ["presente", "preterito", "imperfecto", "futuro"];

export default function Home() {
  const [selectedTense, setSelectedTense] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handlePickTense = (tense) => {
    setSelectedTense(tense);
    const qs = generateQuestionsForTense(tense);
    setQuestions(qs);
  };

  if (selectedTense) {
    return <QuizSection title={selectedTense} questions={questions} />;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Pick a Tense for the Lesson</h1>
      <div className={styles.grid}>
        {tenses.map((tense) => (
          <button
            key={tense}
            className={styles.tenseButton}
            onClick={() => handlePickTense(tense)}
          >
            {tense.toUpperCase()}
          </button>
        ))}
      </div>
    </main>
  );
}