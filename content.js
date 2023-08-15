function getSelectedText() {
  try {
    const selection = window.getSelection();
    if (selection) {
      return selection.toString();
    }
    return ""; // Return an empty string if no text is selected
  } catch (error) {
    console.error("Error while getting selected text:", error);
    return ""; // Handle the error gracefully
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSelectedText") {
    const selectedText = getSelectedText();
    sendResponse({ text: selectedText });
  }
});
