import styles from './Quiz.module.css'

export function ExampleSection({ exampleData, question, isSubmitted }) {
  if (!exampleData) {
    return null;
  }

  const { sentence, wordTranslations } = exampleData;
  const { correctAnswer, isCorrect } = question;

  const displaySentence = isSubmitted 
    ? sentence.replace('____', `<span class="${isCorrect ? styles.correctVerb : styles.wrongVerb}">${correctAnswer}</span>`)
    : sentence;

  return (
    <div className={styles.exampleCard}>
      <p 
        className={styles.cardSentence}
        dangerouslySetInnerHTML={{ __html: displaySentence }}
      />
      <div className={styles.wordTranslations}>
        {Object.entries(wordTranslations).map(([word, translation]) => (
          <p key={word}>
            {word} = {translation}
          </p>
        ))}
      </div>
    </div>
  );
}