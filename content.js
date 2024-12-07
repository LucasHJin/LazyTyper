const insertTextToGoogleDoc = async (documentId, text, token) => {
  const url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;

  const body = {
    requests: [
      {
        insertText: {
          location: { index: 1 }, // Insert at the start of the document
          text: text,
        },
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Failed to update Google Doc:", error);
      return;
    }

    console.log("Text successfully inserted into Google Doc!");
  } catch (error) {
    console.error("Error during API request:", error);
  }
};

const fetchGeneratedText = async (prompt) => {
  const OPENAI_API_KEY = "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"; // Replace with your OpenAI API key
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
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching text from OpenAI:", error);
    return "";
  }
};

const generateAndInsertText = async (prompt, documentId, token) => {
  const text = await fetchGeneratedText(prompt);
  if (text) {
    await insertTextToGoogleDoc(documentId, text, token);
  }
};
