export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const feedback = body.feedback;

  const response = await $fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      //@ts-ignore
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: {
      // model: "gpt-4.1-mini",
      model: "gpt-5.4",
      input: `Analyze this student feedback:

"${feedback}"

Return JSON:
{
  "sentiment": "Positive | Negative | Neutral",
  "suggestion": "Improved actionable suggestion"
}`,
    },
  });

  return response;
});
