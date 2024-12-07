console.log("Background script running!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_AUTH_TOKEN") {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError || !token) {
          console.error("Failed to get token:", chrome.runtime.lastError);
          sendResponse({ token: null });
          return;
        }
  
        sendResponse({ token: token });
      });
      return true;
    }
  });
  
