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

  
  for (let i = 0; i < prompt.length; i += 6) {
    const chunk = prompt.slice(i, i + 6); 

    const body = {
      requests: [
        {
          insertText: {
            location: { index: 1 + i }, 
            text: chunk,
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
        console.log(`Inserted chunk: "${chunk}"`);
      }
    } catch (error) {
      console.error("Error while inserting text:", error);
      break;
    }

    
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log("Typewriter effect completed!");
}
