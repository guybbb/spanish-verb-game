import styles from './StatsView.module.css';

export default function StatsView({ stats, onRestart, onChangeTense }) {
  const { mistakes, totalQuestions, tense } = stats;

  // Group mistakes by verb and person
  const verbMistakes = mistakes.reduce((acc, m) => {
    acc[m.verb] = (acc[m.verb] || 0) + 1;
    return acc;
  }, {});

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