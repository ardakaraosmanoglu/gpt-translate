let apiKey;


function updateInputWithSelectedText() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      },
      () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }
          document.getElementById("inputText").value = response.text;
        });
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", updateInputWithSelectedText);



const form = document.getElementById("translateForm");
const inputText = document.getElementById("inputText");
const targetLanguage = document.getElementById("targetLanguage");
const result = document.getElementById("result");
const translateButton = document.getElementById("translateButton");

const supported_languages = {
  "1": "Turkish",
  "2": "English",
  "3": "Arabic",
  "4": "Hindi",
  "5": "Bengali",
  "6": "Portuguese",
  "7": "Russian",
  "8": "Spanish",
  "9": "Japanese",
  "10": "French",
  "11": "Urdu",
  "12": "Indonesian",
  "13": "German",
  "14": "Javanese",
  "15": "Tamil",
  "16": "Wu Chinese",
  "17": "Korean",
  "18": "Italian",
  "19": "Marathi",
  "20": "Telugu",
  "21": "Vietnamese",
  "22": "Farsi",
  "23": "Turkmen",
  "24": "Ukrainian",
  "25": "Burmese",
  "26": "Dutch",
  "27": "Sundanese",
  "28": "Romanian",
  "29": "Albanian",
  "30": "Pashto",
  "31": "Japanese",
  "32": "Kannada",
  "33": "Polish",
  "34": "Yoruba",
  "35": "Oromo",
  "36": "Maithili",
  "37": "Malayalam",
  "38": "Bhojpuri",
  "39": "Uzbek",
  "40": "Sindhi",
  "41": "Amharic",
  "42": "Fula",
  "43": "Igbo",
  "44": "Azerbaijani",
  "45": "Yoruba",
  "46": "Odia",
  "47": "Burmese",
  "48": "Saraiki",
  "49": "Gan Chinese",
  "50": "Awadhi",
  "51": "Cebuano",
  "52": "Taiwanese",
  "53": "Czech",
  "54": "Javanese",
  "55": "Gujarati",
  "56": "Sundanese",
  "57": "Dutch",
  "58": "Haitian Creole",
  "59": "Swedish",
  "60": "Korean",
  "61": "Uzbek",
  "62": "Greek",
  "63": "Chhattisgarhi",
  "64": "Haryanvi",
  "65": "Hungarian",
  "66": "Chittagonian",
  "67": "Hejazi Arabic",
  "68": "Xiang Chinese",
  "69": "Romanian",
  "70": "Malay",
  "71": "Kurdish",
  "72": "Saraiki",
  "73": "Nepali",
  "74": "Eastern Punjabi",
  "75": "Sanaani Spoken Arabic",
  "76": "Zulu",
  "77": "Amharic",
  "78": "Mossi",
  "79": "Russian",
  "80": "Lao",
  "81": "Bhojpuri",
  "82": "Hiligaynon",
  "83": "Northern Pashto",
  "84": "Akan",
  "85": "Sinhalese",
  "86": "Southern Pashto",
  "87": "Chewa",
  "88": "Somali",
  "89": "Azerbaijani",
  "90": "Khmer",
  "91": "Waray",
  "92": "Chinese",
  "93": "Thai",
  "94": "Marwari",
  "95": "Greek",
  "96": "Burmese",
  "97": "Magahi",
  "98": "Ilokano",
  "99": "Serbo-Croatian",
  "100": "Hungarian",
  "101": "Nigerian Pidgin",
  "102": "Sylheti",
  "103": "Chittagonian",
  "104": "Kazakh",
  "105": "Sinhalese",
  "106": "Eastern Punjabi",
  "107": "Quechua",
  "108": "Min Bei Chinese",
  "109": "Deccan",
  "110": "Sundanese",
  "111": "Bulgarian",
  "112": "Hungarian"
};

const targetLanguageSelect = document.getElementById("targetLanguage");
  
for (const key in supported_languages) {
  const option = document.createElement("option");
  option.value = supported_languages[key];
  option.textContent = supported_languages[key];
  targetLanguageSelect.appendChild(option);
}  


function showApiKeyForm() {
  document.getElementById("api-key-container").style.display = "block";
  document.getElementById("translation-container").style.display = "none";
}

function showTranslationForm() {
  document.getElementById("api-key-container").style.display = "none";
  document.getElementById("translation-container").style.display = "block";
}

async function loadApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("apiKey", (data) => {
      resolve(data.apiKey);
    });
  });
}

async function saveApiKey(value) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ apiKey: value }, () => {
      resolve();
    });
  });
}

document.getElementById("apiKeyForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  apiKey = document.getElementById("apiKeyInput").value;
  await saveApiKey(apiKey);
  showTranslationForm();
});


async function translateText(inputText, targetLanguage, apiKey) {
  const data = await callOpenAI(inputText, targetLanguage, apiKey);

  if (data && data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  } else {
    throw new Error("Unexpected API response structure");
  }
}


function setLoading(loading) {
  if (loading) {
    translateButton.textContent = "Loading...";
    translateButton.disabled = true;
  } else {
    translateButton.textContent = "Translate";
    translateButton.disabled = false;
  }
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoading(true);
  const text = inputText.value;
  const language = targetLanguage.value;
  
  try {
    const translatedText = await translateText(text, language, apiKey);
    result.innerHTML = `<p class="translated-text">Translated text:</p>
                         <p class="translated-content">${translatedText}</p>`;
    document.getElementById("copyButton").style.display = "block"; // Show the "Copy" button
  } catch (error) {
    result.textContent = "Error: Unable to translate the text.";
    console.error(error);
  } finally {
    setLoading(false);
  }
});

document.getElementById("copyButton").addEventListener("click", () => {
  copyToClipboard(result.textContent);
});


// At the end of the popup.js file, add the following lines：
document.addEventListener("DOMContentLoaded", async () => {
  apiKey = await loadApiKey();
  if (apiKey) {
    showTranslationForm();
  } else {
    showApiKeyForm();
  }
});