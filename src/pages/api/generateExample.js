import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

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
      res.status(200).json(message.parsed);
    } else {
      res.status(500).json({ error: "Could not parse model response" });
    }
  } catch (error) {
    console.error("Error generating example sentence:", error);
    res.status(500).json({ error: "Error generating example sentence" });
  }
}