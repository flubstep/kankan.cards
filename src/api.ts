import OpenAI from 'openai';

const openai = new OpenAI({
  // TODO: rotate this key
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});
async function cardify_(lines: string) {
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

${lines}
`;
  const response = await openai.chat.completions.create({
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
  return response.choices[0].message.content;
}

export async function cardify(lines: string) {
  let retries = 0;
  while (retries < 3) {
    const maybeObject = await cardify_(lines);
    try {
      return JSON.parse(maybeObject || "");
    } catch (e) {
      retries++;
    }
  }
}

async function makeSentences_({
  term,
  count,
  wordCount,
}: {
  term: string;
  count: number;
  wordCount: number;
}) {
  const system = `
You are a helpful, native speaker of Chinese with a Taiwanese accent.
You are trying to teach me more about Chinese.
You will respond in JSON format.`;

  const prompt = `
Provide ${count} sentences that uses the word ${term}.
Each sentence must be at least ${wordCount} words long.
Respond with a JSON list of objects with this format:

{
  "textChinese": string, // The sentence in Chinese
  "textEnglish": string, // The translation in English
  "pinyinChinese": string // The pinyin pronunciation of the sentence in Chinese
}
`;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
  });
  return response.choices[0].message.content;
}

export async function makeSentences({
  term,
  count,
  wordCount,
}: {
  term: string;
  count: number;
  wordCount: number;
}) {
  let retries = 0;
  while (retries < 3) {
    const maybeObject = await makeSentences_({ term, count, wordCount });
    try {
      const value = JSON.parse(maybeObject || "");
      if (
        Array.isArray(value) &&
        value.length === count &&
        value.every((v) => typeof v === "object") &&
        value.every((v) => "textChinese" in v)
      ) {
        return value;
      }
    } catch (e) {
      // Ignore;
    }
    retries++;
  }
}
