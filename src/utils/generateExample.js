const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function generateExample({ verb, person, tense }) {
  const prompt = `Use the Spanish verb "${verb}" with person:${person} in tense:${tense} but replace the verb with a blank (____). Make it about daily life.`;

  try {
    const response = await fetch(`${API_BASE_URL}/api/generateExample`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to generate example:', error);
    // Return a fallback example if the API fails
    return {
      sentence: `${person} ____ al parque.`,
      wordTranslations: {
        "al": "to the",
        "parque": "park"
      }
    };
  }
}