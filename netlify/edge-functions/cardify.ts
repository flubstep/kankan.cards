import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: Request) {
  if (!req.body) {
    return [];
  }
  const params = JSON.parse(req.body.toString());
  const prompt = `
Separate these lines into the Chinese vocabulary and the English translation.
Calculate the pinyin for the Chinese characters.
Output this JSON object for each line:
{
  english: <string>,
  chinese: <string>,
  pinyin: <string>
}

Combine all results into one large JSON array.
Do not include any other text except for the JSON object.
Return your result as a raw string without Markdown formatting.

The input is as follows:

${params.input}
`;
  return openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a language learning assistant API. You output in raw JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}

export const config = { path: "/api/cardify" };
