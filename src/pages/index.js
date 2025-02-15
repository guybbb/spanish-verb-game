"use client";
import { useState } from "react";
import { generateQuestionsForTense } from "../utils/generateQuestions";
import QuizSection from "../components/QuizSection";

// Define which tenses you want to support
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
    return (
      <QuizSection
        title={`Tense: ${selectedTense.toUpperCase()}`}
        questions={questions}
      />
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Pick a Tense for the Lesson</h1>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {tenses.map((tense) => (
          <li key={tense} style={{ margin: "1rem 0" }}>
            <button onClick={() => handlePickTense(tense)}>
              {tense.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}