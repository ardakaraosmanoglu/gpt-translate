async function callOpenAI(inputText, targetLanguage, apiKey) {
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };
  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an excellent translator." },
      { role: "user", content: `Translate '${inputText}' into ${targetLanguage} with a human-like tone and a professional interpreter.` },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);

    return data;
  } catch (error) {
    console.error("Error:", error);
    return null; // or handle the error as needed
  }
}
