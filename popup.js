document.getElementById("generateText").addEventListener("click", () => {
    const prompt = document.getElementById("prompt").value;
    const documentId = "1UVflj7PCA2z6DHh9TsGcpkEj9wtPZYqrKlfmiqbF60A"; // Your Google Doc ID
  
    // Send a message to the background script to fetch the OAuth token
    chrome.runtime.sendMessage(
      { type: "GET_AUTH_TOKEN" },
      async (response) => {
        if (chrome.runtime.lastError || !response || !response.token) {
          console.error("Error getting token:", chrome.runtime.lastError);
          return;
        }
  
        const token = response.token;
        console.log("Token received:", token);
  
        // Call the Google Docs API to insert text
        await generateAndInsertText(prompt, documentId, token);
      }
    );
  });
  
  // Function to send the generated text to the Google Docs API
  async function generateAndInsertText(prompt, documentId, token) {
    const url = `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`;
    const body = {
      requests: [
        {
          insertText: {
            location: { index: 1 }, // Insert at the beginning of the document
            text: `AI Response: ${prompt}\n`,
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
      } else {
        console.log("Text successfully inserted into Google Docs!");
      }
    } catch (error) {
      console.error("Error while inserting text:", error);
    }
  }
  