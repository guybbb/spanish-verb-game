// src/utils/generateQuestions.js
import { verbos } from "verbos";

// Map Spanish pronoun keys to user-friendly labels
const personLabels = {
  yo: "yo",
  tu: "tú",
//   ud: "usted",
  nosotros: "nosotros",
  vosotros: "vosotros",
//   uds: "ustedes",
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
 * The returned object now includes a "verb" field.
 */
export function generateQuestionsForTense(selectedTense) {
  const topVerbs = getTopVerbs(10);

  const questions = topVerbs
    .map((verbData) => {
      if (!verbData.indicativo || !verbData.indicativo[selectedTense]) {
        return null;
      }
      const tenseData = verbData.indicativo[selectedTense];
      const persons = Object.keys(tenseData);
      const person = persons[Math.floor(Math.random() * persons.length)];
      const correctAnswer = tenseData[person];

      const questionText = `¿Cuál es la forma de "${personLabels[person] ||
        person}" del verbo "${verbData.infinitivo}" en el tiempo "${selectedTense}"?`;
      const translation = `Conjugate "${verbData.infinitivo}" for "${personLabels[person] ||
        person}" in the "${selectedTense}" tense.`;

      return {
        verb: verbData.infinitivo,
        person,
        questionText,
        translation,
        correctAnswer,
      };
    })
    .filter((q) => q !== null);

  return questions;
}