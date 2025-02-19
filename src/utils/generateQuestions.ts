import { verbos } from "verbos";

const personLabels = {
  yo: "yo",
  tu: "tú",
  ud: "usted",
  nosotros: "nosotros",
  vosotros: "vosotros",
  uds: "ustedes",
};

type Person = keyof typeof personLabels;

type PersonCounts = Record<Person, number>;

interface TenseProgress {
  attempts: PersonCounts;
  successes: PersonCounts;
}

interface VerbProgress {
  [tense: string]: TenseProgress;
}

type Progress = Record<string, VerbProgress>;

/**
 * Load progress from local storage.
 */
export function loadProgress() {
  return JSON.parse(localStorage.getItem("verbProgress")) || {};
}

/**
 * Save progress to local storage.
 */
function saveProgress(progress) {
  localStorage.setItem("verbProgress", JSON.stringify(progress));
}

/**
 * Checks if a verb is mastered for the given tense.
 */
function isVerbMastered(progress: Progress, verb, tense) {
  if (!progress[verb] || !progress[verb][tense]) return false;

  const attempts = progress[verb][tense].attempts;
  const successes = progress[verb][tense].successes;

  // Sum only the values that exist in the attempts object
  const totalAttempts =
    Object.values(attempts).reduce(
      (sum: number, count: number) => sum + count,
      0
    ) || 0;
  const totalSuccesses =
    Object.values(successes).reduce(
      (sum: number, count: number) => sum + count,
      0
    ) || 0;

  return totalAttempts >= 10 && totalSuccesses / totalAttempts >= 0.8;
}

export function getAvailableVerbs(selectedTense) {
  const progress = loadProgress();
  return verbos()
    .slice(0, 10) // Take the first 10 verbs from the ordered list
    .map(verbData => ({
      infinitive: verbData.infinitivo,
      isMastered: isVerbMastered(progress, verbData.infinitivo, selectedTense)
    }));
}

/**
 * Returns exactly 2 verbs that are NOT mastered in the selected tense.
 */
function getTopVerbs(selectedTense) {
  const progress = loadProgress();

  // Get verbs in order of importance and filter out mastered ones
  const remainingVerbs = verbos()
    .filter(
      (verbData) =>
        !isVerbMastered(progress, verbData.infinitivo, selectedTense)
    ) // ⬅️ Ignore mastered verbs
    .slice(0, 2); // ⬅️ Pick exactly 2 verbs

  return remainingVerbs;
}

/**
 * Generate quiz questions, excluding mastered verbs.
 */
export function generateQuestionsForTense(selectedTense, selectedVerbs = null) {
  // If no verbs provided, use getTopVerbs for automatic selection
  const verbs = selectedVerbs 
    ? verbos()
        .filter(verbData => selectedVerbs.includes(verbData.infinitivo))
        .slice(0, 2)
    : getTopVerbs(selectedTense);

  if (verbs.length === 0) {
    return [
      {
        questionText:
          "¡Felicidades! Has dominado todos los verbos en este tiempo.",
      },
    ];
  }

  const questions = verbs
    .map((verbData) => {
      if (!verbData.indicativo || !verbData.indicativo[selectedTense]) {
        return null;
      }

      const tenseData = verbData.indicativo[selectedTense];
      const persons = Object.keys(tenseData);

      return persons.map((person) => {
        const correctAnswer = tenseData[person];
        const questionText = `¿Cuál es la forma de "${
          personLabels[person] || person
        }" del verbo "${verbData.infinitivo}" en el tiempo "${selectedTense}"?`;
        const translation = `Conjugate "${verbData.infinitivo}" for "${
          personLabels[person] || person
        }" in the "${selectedTense}" tense.`;

        return {
          verb: verbData.infinitivo,
          tense: selectedTense,
          person: personLabels[person],
          questionText,
          translation,
          correctAnswer,
        };
      });
    })
    .flat()
    .filter((q) => q !== null);

  return questions;
}

/**
 * Updates progress tracking when a user answers a question.
 */
export function updateProgress(verb, tense, person, correct) {
  const progress = loadProgress();
  if (!progress[verb]) {
    progress[verb] = {};
  }
  if (!progress[verb][tense]) {
    progress[verb][tense] = { attempts: {}, successes: {} };
  }

  if (!progress[verb][tense].attempts[person]) {
    progress[verb][tense].attempts[person] = 0;
    progress[verb][tense].successes[person] = 0;
  }

  progress[verb][tense].attempts[person] += 1;
  if (correct) {
    progress[verb][tense].successes[person] += 1;
  }

  saveProgress(progress);
}
