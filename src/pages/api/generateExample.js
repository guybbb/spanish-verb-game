import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ExampleOutputSchema = z
  .object({
    sentence: z.string(),
    wordTranslations: z.object({}).catchall(z.string()).strict(),
  })
  .strict();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { prompt } = req.body;

  // Extract the verb, person, and tense from the prompt.
  // This regex assumes the prompt is in the format:
  // Use the Spanish verb "VERB" with person:PERSON in tense:TENSE but replavce the verb with a blank (____).
  const match = prompt.match(/Use the Spanish verb\s+"([^"]+)"\s+with\s+person:\s*(.+?)\s+in\s+tense:\s*(.+?)\s+but/i);
  if (!match) {
    console.error("Could not extract verb, person, and tense from prompt.");
  }
  const verb = match ? match[1] : "unknownVerb";
  const person = match ? match[2] : "unknownPerson";
  const tense = match ? match[3] : "unknownTense";

  console.log(verb, person, tense)

  // Create a cache directory and file path for this verb/person/tense combination.
  const cacheDir = path.join(process.cwd(), "cache");
  await fs.mkdir(cacheDir, { recursive: true });
  const cacheFile = path.join(cacheDir, `${verb}_${person}_${tense}.json`);

  let cachedExamples = [];
  try {
    const data = await fs.readFile(cacheFile, "utf-8");
    cachedExamples = JSON.parse(data);
  } catch (e) {
    // If the file doesn't exist, start with an empty cache.
    cachedExamples = [];
  }

  // If we already have 10 or more cached examples, return a random one.
  if (cachedExamples.length >= 10) {
    const randomExample = cachedExamples[Math.floor(Math.random() * cachedExamples.length)];
    res.status(200).json(randomExample);
    return;
  }

  // Otherwise, generate a new example using OpenAI.
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that outputs strictly structured JSON according to the provided schema.",
        },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(ExampleOutputSchema, "example_output"),
      temperature: 0.7,
      max_tokens: 200,
    });
    const message = completion.choices[0]?.message;
    if (message?.parsed) {
      // Add the new example to the cache.
      cachedExamples.push(message.parsed);
      await fs.writeFile(cacheFile, JSON.stringify(cachedExamples, null, 2), "utf-8");
      res.status(200).json(message.parsed);
    } else {
      res.status(500).json({ error: "Could not parse model response" });
    }
  } catch (error) {
    console.error("Error generating example sentence:", error);
    res.status(500).json({ error: "Error generating example sentence" });
  }
}