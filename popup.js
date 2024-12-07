document.getElementById("generateText").addEventListener("click", () => {
  const prompt = document.getElementById("prompt").value;
  const documentId = "1UVflj7PCA2z6DHh9TsGcpkEj9wtPZYqrKlfmiqbF60A"; 

  chrome.runtime.sendMessage(
    { type: "GET_AUTH_TOKEN" },
    async (response) => {
      if (chrome.runtime.lastError || !response || !response.token) {
        console.error("Error getting token:", chrome.runtime.lastError);
        return;
      }

      const token = response.token;
      console.log("Token received:", token);

      await generateAndInsertTextTypewriter(prompt, documentId, token);
    }
  );
});

async function generateAndInsertTextTypewriter(prompt, documentId, token) {
  const url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;

  for (let i = 0; i < prompt.length; i++) {
    const char = prompt[i];

    const body = {
      requests: [
        {
          insertText: {
            location: { index: 1 + i }, 
            text: char,
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
        console.error("Failed to insert text:", await response.text());
        break;
      } else {
        console.log(`Inserted character: "${char}"`);
      }
    } catch (error) {
      console.error("Error while inserting text:", error);
      break;
    }

    const delay = Math.random() * (25 - 5) + 5; // Random delays
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.log("Typewriter effect completed!");
}
