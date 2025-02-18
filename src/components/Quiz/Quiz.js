import { ExampleSection } from './ExampleSection';
import { QuizForm } from './QuizForm';
import { useState } from 'react';
import styles from './Quiz.module.css'

export default function Quiz({ question, onAnswer, current, total }) {
  const { verb, person, tense, translation, exampleData } = question;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleSubmit = (userAnswer) => {
    console.log('Checking answer:', {
      userAnswer,
      correctAnswer: question.correctAnswer,
      // areEqual: correct
    });
    // const correct = userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
   
    setIsCorrect(userAnswer);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setIsSubmitted(false);
    onAnswer(isCorrect);
  };
  
  return (
    <div className={styles.quizContainer}>
      <header className={styles.header}>
        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${(current / total) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            Question {current}/{total}
          </span>
        </div>
        <div className={styles.personaVerb}>{verb.toUpperCase()}</div>
        <p className={styles.translation}>{translation}</p>
      </header>

      <main className={styles.mainContent}>
        <ExampleSection 
          exampleData={exampleData} 
          question={{...question, isCorrect}}
          isSubmitted={isSubmitted}
        />
        <QuizForm 
          question={question}
          onSubmit={handleSubmit}
          onNext={handleNext}
          isSubmitted={isSubmitted}
        />
      </main>
    </div>
  );
}