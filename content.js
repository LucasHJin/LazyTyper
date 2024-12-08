const generateAndInsertText = async (prompt, documentId, token) => {
  const text = await fetchGeneratedText(prompt);
  if (text) {
    await insertTextToGoogleDoc(documentId, text, token);
  }
};

const fetchGeneratedText = async (prompt) => {
  const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";
  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching text from OpenAI:", error);
    return "";
  }
};


generateAndInsertText("Write a paragraph about AI technology.", "YOUR_DOCUMENT_ID", "YOUR_TOKEN");
