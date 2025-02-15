// src/utils/generateQuestions.js
import { verbos } from "verbos";

// A simple mapping for person labels (you can customize if needed)
const personLabels = {
  yo: "yo",
  tu: "tú",
  ud: "usted",
  nosotros: "nosotros",
  vosotros: "vosotros",
  uds: "ustedes",
};

/**
 * Return the top 'count' verbs sorted by importance.
 */
export function getTopVerbs(count = 10) {
  return verbos().slice(0, count);
}

/**
 * Generate quiz questions for a given tense using the top 10 verbs.
 * For each verb, pick a random person from the selected tense (in indicativo).
 */
export function generateQuestionsForTense(selectedTense) {
  const topVerbs = getTopVerbs(10);

  const questions = topVerbs
    .map((verbData) => {
      // Ensure that the verb has data for the selected tense in "indicativo"
      if (!verbData.indicativo || !verbData.indicativo[selectedTense]) {
        return null;
      }
      const tenseData = verbData.indicativo[selectedTense];
      // Pick a random person among the available ones (yo, tu, ud, etc.)
      const persons = Object.keys(tenseData);
      const person = persons[Math.floor(Math.random() * persons.length)];
      const correctAnswer = tenseData[person];

      const questionText = `¿Cuál es la forma de "${personLabels[person] || person}" del verbo "${verbData.infinitivo}" en el tiempo "${selectedTense}"?`;
      const translation = `Conjugate "${verbData.infinitivo}" for "${personLabels[person] || person}" in the "${selectedTense}" tense.`;

      return {
        questionText,
        translation,
        correctAnswer,
      };
    })
    .filter((q) => q !== null); // Skip any verbs that don't have data for the tense

  return questions;
}