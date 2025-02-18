import { useState } from "react";
import { generateQuestionsForTense } from "@/utils/generateQuestions";
import { generateExample } from "@/utils/generateExample";
import QuizSection from "../QuizSection";
import styles from "./Home.module.css";

const tenses = ["presente", "preterito", "imperfecto", "futuro"];

export default function Home() {
  const [selectedTense, setSelectedTense] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePickTense = async (tense) => {
    setIsLoading(true);
    try {
      const qs = generateQuestionsForTense(tense);
      
      // Pre-generate examples for all questions
      const questionsWithExamples = await Promise.all(
        qs.map(async (question) => {
          const exampleData = await generateExample({
            verb: question.verb,
            person: question.person,
            tense: question.tense
          });
          
          return {
            ...question,
            exampleData
          };
        })
      );
      
      setSelectedTense(tense);
      setQuestions(questionsWithExamples);
    } catch (error) {
      console.error('Failed to generate lesson:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className={styles.container}>
        <h2>Preparing your lesson...</h2>
      </main>
    );
  }

  if (selectedTense && questions.length > 0) {
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