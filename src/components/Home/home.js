import { useState } from "react";
import {
  generateQuestionsForTense,
  getAvailableVerbs,
} from "@/utils/generateQuestions";
import { generateExample } from "@/utils/generateExample";
import QuizSection from "../QuizSection";
import styles from "./Home.module.css";

const tenses = ["presente", "preterito", "imperfecto", "futuro"];

export default function Home() {
  const [selectedTense, setSelectedTense] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableVerbs, setAvailableVerbs] = useState([]);
  const [selectedVerbs, setSelectedVerbs] = useState([]);
  const [showVerbSelector, setShowVerbSelector] = useState(false);

  const handlePickTense = async (tense) => {
    setSelectedTense(tense);
    const verbs = getAvailableVerbs(tense);
    setAvailableVerbs(verbs);

    // Select first 2 unmastered verbs by default
    const firstTwoUnmastered = verbs
      .filter((v) => !v.isMastered)
      .slice(0, 2)
      .map((v) => v.infinitive);

    setSelectedVerbs(firstTwoUnmastered);
  };

  const handleStartLesson = async () => {
    if (selectedVerbs.length === 0) {
      alert("Please select at least one verb");
      return;
    }

    setIsLoading(true);
    try {
      const qs = generateQuestionsForTense(selectedTense, selectedVerbs);

      const questionsWithExamples = await Promise.all(
        qs.map(async (question) => {
          const exampleData = await generateExample({
            verb: question.verb,
            person: question.person,
            tense: question.tense,
          });
          return { ...question, exampleData };
        })
      );

      setQuestions(questionsWithExamples);
    } catch (error) {
      console.error("Failed to generate lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoSelect = async () => {
    setIsLoading(true);
    try {
      const qs = generateQuestionsForTense(selectedTense);
      const questionsWithExamples = await Promise.all(
        qs.map(async (question) => {
          const exampleData = await generateExample({
            verb: question.verb,
            person: question.person,
            tense: question.tense,
          });
          return { ...question, exampleData };
        })
      );
      setQuestions(questionsWithExamples);
    } catch (error) {
      console.error("Failed to generate lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVerbSelection = (verb, isMastered) => {
    if (isMastered) return; // Don't allow selecting mastered verbs

    setSelectedVerbs((prev) => {
      if (prev.includes(verb)) {
        return prev.filter((v) => v !== verb);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, verb];
    });
  };

  if (isLoading) {
    return (
      <main className={styles.container}>
        <h2>Preparing your lesson...</h2>
      </main>
    );
  }

  if (questions.length > 0) {
    return (
      <QuizSection
        title={selectedTense}
        questions={questions}
        onChangeTense={() => {
          setSelectedTense(null);
          setQuestions([]);
          setSelectedVerbs([]);
          setShowVerbSelector(false);
        }}
      />
    );
  }

  if (selectedTense && availableVerbs.length > 0) {
    return (
      <main className={styles.container}>
        <h2 className={styles.title}>Choose Your Practice Mode</h2>
        <div className={styles.modeSelection}>
          <button
            className={`${styles.modeButton} ${styles.autoButton}`}
            onClick={handleAutoSelect}
          >
            Start with 2 recommended verbs
          </button>
          <div className={styles.divider}>
            <span>or</span>
          </div>
          <button
            className={`${styles.modeButton} ${styles.customButton}`}
            onClick={() => setShowVerbSelector(true)}
          >
            Select specific verbs
          </button>
        </div>
        {showVerbSelector && (
          <>
            <div className={styles.verbGrid}>
              {availableVerbs.map(({ infinitive, isMastered }) => (
                <button
                  key={infinitive}
                  className={`${styles.verbButton} 
        ${selectedVerbs.includes(infinitive) ? styles.selected : ""} 
        ${isMastered ? styles.mastered : ""}`}
                  onClick={() => toggleVerbSelection(infinitive, isMastered)}
                  disabled={
                    isMastered ||
                    (!selectedVerbs.includes(infinitive) &&
                      selectedVerbs.length >= 2)
                  }
                >
                  {infinitive}
                  {isMastered && (
                    <span className={styles.masteredBadge}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className={styles.actions}>
              <button
                className={styles.startButton}
                onClick={handleStartLesson}
                disabled={selectedVerbs.length === 0}
              >
                Start Practice ({selectedVerbs.length}/2 verbs)
              </button>
            </div>
          </>
        )}
        <button
          className={styles.backButton}
          onClick={() => {
            setSelectedTense(null);
            setSelectedVerbs([]);
            setShowVerbSelector(false);
          }}
        >
          Back to Tense Selection
        </button>
      </main>
    );
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
