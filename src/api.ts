export async function cardify(input: string) {
  const url = "https://flubstep-cardify.web.val.run";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      input,
    }),
  });
  const result = await response.json();
  if (result.cards) {
    return result.cards;
  }
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
  const url = "https://flubstep-sentencify.web.val.run";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      term,
      count,
      wordCount,
    }),
  });
  const result = await response.json();
  if (result.sentences) {
    return result.sentences;
  }
}
