import { loadProgress } from "@/utils/generateQuestions"; // Import progress tracking
import styles from "./StatsView.module.css";

export default function StatsView({ stats, onRestart, onChangeTense }) {
  const { mistakes, totalQuestions, tense } = stats;

  // Load mastery data
  const progress = loadProgress();

  // Get mastery levels for verbs in this tense
  const masteryLevels = Object.keys(progress)
    .filter((verb) => progress[verb][tense]) // Only include verbs in this tense
    .map((verb) => {
      const attempts = Object.values(progress[verb][tense].attempts || {}).reduce((a, b) => a + b, 0);
      const successes = Object.values(progress[verb][tense].successes || {}).reduce((a, b) => a + b, 0);
      const accuracy = attempts > 0 ? Math.round((successes / attempts) * 100) : 0;
      return { verb, attempts, successes, accuracy };
    })
    .sort((a, b) => b.accuracy - a.accuracy); // Sort by highest mastery

  // Group mistakes by verb
  const verbMistakes = mistakes.reduce((acc, m) => {
    acc[m.verb] = (acc[m.verb] || 0) + 1;
    return acc;
  }, {});

  // Group mistakes by person
  const personMistakes = mistakes.reduce((acc, m) => {
    acc[m.person] = (acc[m.person] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quiz Summary</h2>
      
      <div className={styles.stats}>
        <p className={styles.score}>
          Score: {totalQuestions - mistakes.length}/{totalQuestions} 
          ({Math.round(((totalQuestions - mistakes.length) / totalQuestions) * 100)}%)
        </p>

        {mistakes.length > 0 && (
          <>
            <div className={styles.section}>
              <h3>Practice these verbs more:</h3>
              <ul className={styles.list}>
                {Object.entries(verbMistakes)
                  .sort(([,a], [,b]) => b - a)
                  .map(([verb, count]) => (
                    <li key={verb}>
                      {verb.toUpperCase()}: {count} mistakes
                    </li>
                  ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h3>Focus on these persons:</h3>
              <ul className={styles.list}>
                {Object.entries(personMistakes)
                  .sort(([,a], [,b]) => b - a)
                  .map(([person, count]) => (
                    <li key={person}>
                      {person}: {count} mistakes
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}

        <div className={styles.section}>
          <h3>Mastery Levels for {tense.toUpperCase()} Verbs:</h3>
          <ul className={styles.list}>
            {masteryLevels.map(({ verb, attempts, successes, accuracy }) => (
              <li key={verb}>
                {verb.toUpperCase()} - {accuracy}% accuracy ({successes}/{attempts} correct)
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.actions}>
        <button 
          onClick={onRestart} 
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          Practice {tense.toUpperCase()} Again
        </button>
        <button 
          onClick={onChangeTense}
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          Try Different Tense
        </button>
      </div>
    </div>
  );
}