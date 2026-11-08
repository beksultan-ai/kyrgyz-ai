
const API_URL = "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/chat";
const SPEAK_URL = "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/speak";
const TRANSCRIBE_URL = "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/transcribe";

const translations = {
  ky: {
    navAbout:"Платформа",navServices:"Мүмкүнчүлүктөр",navAssistant:"AI жардамчы",
    headerCta:"Баштоо ↗",eyebrowText:"КЫРГЫЗСТАНДАН ДҮЙНӨГӨ",
    heroLineOne:"Келечек",heroLineTwo:"ушул жерден башталат.",
    intro:"Кыргызстандан дүйнөгө багытталган жаңы муундагы жасалма интеллект платформасы.",
    startButton:"AI менен сүйлөшүү",exploreButton:"Мүмкүнчүлүктөрдү көрүү",
    heroNote:"Your World. Your AI.",flagCaption:"Дүйнө үчүн жаралган",
    description:"Бизнестин жана адамдардын күнүмдүк иштерин жасалма интеллект менен жеңилдетебиз.",
    servicesKicker:"БИЗ ЭМНЕ КЫЛАБЫЗ",
    servicesTitle:"Бир платформа.<br>Чексиз мүмкүнчүлүк.",
    businessTitle:"Бизнес үчүн AI",
    businessText:"Иш процесстерин автоматташтыруу жана бизнеске акылдуу жардам.",
    peopleTitle:"Ар бир адам үчүн",
    peopleText:"Күнүмдүк суроолорго жооп, идеялар жана жеке жардамчы.",
    globalTitle:"Дүйнөгө ачык",
    globalText:"Кыргызча, орусча жана англисче баарлашуу мүмкүнчүлүгү.",
    chatKicker:"AI МЕНЕН ТААНЫШЫҢЫЗ",assistantTitle:"Сүйлөшүүнү башта.",
    welcome:"Саламатсызбы! Мен KYRGYZ AI жардамчысымын. Сизге кандай жардам бере алам?",
    onlineText:"Онлайн жардамчы",
    initialMessage:"Саламатсызбы! Мен KYRGYZ AI жардамчысымын. Сурооңузду жазыңыз.",
    placeholder:"Сурооңузду жазыңыз...",
    disclaimer:"KYRGYZ AI · Your World. Your AI.",
    closingTitle:"Келечекке бирге кадам таштайлы.",
    closingButton:"Азыр баштоо",sending:"Жөнөтүлүүдө...",
    error:"Ката кетти. Кайра аракет кылыңыз.",empty:"Сурооңузду жазыңыз.",
    imagePrompt:"Бул сүрөттө эмне бар?",
    removeImage:"Сүрөттү алып салуу"
  },
  ru: {
    navAbout:"Платформа",navServices:"Возможности",navAssistant:"AI помощник",
    headerCta:"Начать ↗",eyebrowText:"ИЗ КЫРГЫЗСТАНА В МИР",
    heroLineOne:"Будущее",heroLineTwo:"начинается здесь.",
    intro:"Платформа искусственного интеллекта нового поколения, созданная в Кыргызстане для всего мира.",
    startButton:"Общаться с AI",exploreButton:"Наши возможности",
    heroNote:"Your World. Your AI.",flagCaption:"Создано для мира",
    description:"Мы упрощаем повседневные задачи бизнеса и людей с помощью искусственного интеллекта.",
    servicesKicker:"ЧТО МЫ ДЕЛАЕМ",
    servicesTitle:"Одна платформа.<br>Безграничные возможности.",
    businessTitle:"AI для бизнеса",
    businessText:"Автоматизация рабочих процессов и интеллектуальная помощь бизнесу.",
    peopleTitle:"Для каждого",
    peopleText:"Ответы на повседневные вопросы, идеи и персональный помощник.",
    globalTitle:"Открыты миру",
    globalText:"Общение на кыргызском, русском и английском языках.",
    chatKicker:"ПОЗНАКОМЬТЕСЬ С AI",assistantTitle:"Начните разговор.",
    welcome:"Здравствуйте! Я помощник KYRGYZ AI. Чем могу вам помочь?",
    onlineText:"Онлайн-помощник",
    initialMessage:"Здравствуйте! Я помощник KYRGYZ AI. Напишите свой вопрос.",
    placeholder:"Напишите свой вопрос...",
    disclaimer:"KYRGYZ AI · Your World. Your AI.",
    closingTitle:"Давайте вместе двигаться в будущее.",
    closingButton:"Начать сейчас",sending:"Отправка...",
    error:"Произошла ошибка. Попробуйте ещё раз.",
    empty:"Напишите свой вопрос.",
    imagePrompt:"Что изображено на этой фотографии?",
    removeImage:"Удалить фото"
  },
  en: {
    navAbout:"Platform",navServices:"Features",navAssistant:"AI Assistant",
    headerCta:"Get started ↗",eyebrowText:"FROM KYRGYZSTAN TO THE WORLD",
    heroLineOne:"The future",heroLineTwo:"starts here.",
    intro:"A new-generation artificial intelligence platform built in Kyrgyzstan for the world.",
    startButton:"Talk to AI",exploreButton:"Explore features",
    heroNote:"Your World. Your AI.",flagCaption:"Made for the world",
    description:"We make everyday tasks easier for businesses and people with artificial intelligence.",
    servicesKicker:"WHAT WE DO",
    servicesTitle:"One platform.<br>Endless possibilities.",
    businessTitle:"AI for business",
    businessText:"Automate workflows and bring intelligent assistance to your business.",
    peopleTitle:"For everyone",
    peopleText:"Answers to everyday questions, ideas, and a personal assistant.",
    globalTitle:"Open to the world",
    globalText:"Communicate in Kyrgyz, Russian, and English.",
    chatKicker:"MEET YOUR AI",assistantTitle:"Start a conversation.",
    welcome:"Hello! I'm the KYRGYZ AI assistant. How can I help you?",
    onlineText:"Online assistant",
    initialMessage:"Hello! I'm the KYRGYZ AI assistant. Write your question.",
    placeholder:"Write your question...",
    disclaimer:"KYRGYZ AI · Your World. Your AI.",
    closingTitle:"Let's take a step into the future together.",
    closingButton:"Start now",sending:"Sending...",
    error:"Something went wrong. Please try again.",
    empty:"Please write your question.",
    imagePrompt:"What is in this picture?",
    removeImage:"Remove image"
  }
};

let currentLang = "ky";
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let selectedImage = null;

function setVoiceStatus(message) {
  const status = document.getElementById("voiceStatus");
  if (status) status.textContent = message;
}

function setLang(lang, button) {
  if (!translations[lang]) return;

  currentLang = lang;
  const words = translations[lang];

  Object.keys(words).forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;

    if (id === "servicesTitle") {
      element.innerHTML = words[id];
    } else {
      element.textContent = words[id];
    }
  });

  const input = document.getElementById("userInput");
  if (input) input.placeholder = words.placeholder;

  const prompt = document.getElementById("imagePrompt");
  if (prompt && !prompt.value) {
    prompt.placeholder = words.imagePrompt;
  }

  const removeButton = document.getElementById("removeImageBtn");
  if (removeButton) {
    removeButton.textContent = words.removeImage;
  }

  // Өзүнчө сүрөт талдоо баскычын жашыруу
  const analyzeButton = document.getElementById("analyzeImageBtn");
  if (analyzeButton) analyzeButton.style.display = "none";

  document.documentElement.lang = lang;

  document.querySelectorAll(".languages button").forEach(btn => {
    btn.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  } else {
    const active = document.querySelector(
      `.languages button[onclick*="'${lang}'"]`
    );
    if (active) active.classList.add("active");
  }
}

function addMessage(message, type) {
  const messages = document.getElementById("messages");
  if (!messages) return;

  const bubble = document.createElement("div");
  bubble.className = `message ${type}`;
  bubble.textContent = message;

  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function addUserImageMessage(message, image) {
  const messages = document.getElementById("messages");
  if (!messages) return;

  const bubble = document.createElement("div");
  bubble.className = "message user";

  if (message) {
    const text = document.createElement("div");
    text.textContent = message;
    bubble.appendChild(text);
  }

  const img = document.createElement("img");
  img.src = image;
  img.alt = "Тиркелген сүрөт";
  img.style.maxWidth = "220px";
  img.style.maxHeight = "220px";
  img.style.objectFit = "contain";
  img.style.display = "block";
  img.style.marginTop = message ? "8px" : "0";
  img.style.borderRadius = "12px";

  bubble.appendChild(img);
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

async function speakText(text) {
  try {
    const response = await fetch(SPEAK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Voice server error: " + response.status);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => URL.revokeObjectURL(audioUrl);
    audio.onerror = () => URL.revokeObjectURL(audioUrl);

    await audio.play();
  } catch (error) {
    console.error("KYRGYZ AI Voice:", error);
  }
}

function clearSelectedImage() {
  selectedImage = null;

  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("imagePreview");
  const previewImage = document.getElementById("previewImage");

  if (imageInput) imageInput.value = "";
  if (previewImage) previewImage.src = "";
  if (preview) preview.style.display = "none";
}

async function sendMessage(event) {
  event.preventDefault();

  const input = document.getElementById("userInput");
  const button = document.getElementById("sendButton");
  const status = document.getElementById("status");
  const promptInput = document.getElementById("imagePrompt");

  if (!input || !button || !status) return;

  let message = input.value.trim();

  // Суроо негизги талаада жок болсо, сүрөттүн суроо талаасын колдонуу
  if (!message && selectedImage && promptInput) {
    message = promptInput.value.trim();
  }

  // Сүрөт гана тиркелсе, автоматтык суроо берүү
  if (!message && selectedImage) {
    message = translations[currentLang].imagePrompt;
  }

  if (!message && !selectedImage) {
    status.textContent = translations[currentLang].empty;
    return;
  }

  const imageToSend = selectedImage;

  if (imageToSend) {
    addUserImageMessage(message, imageToSend);
  } else {
    addMessage(message, "user");
  }

  input.value = "";
  button.disabled = true;
  status.textContent = translations[currentLang].sending;

  try {
    const payload = { message };

    if (imageToSend) {
      payload.image = imageToSend;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server error");
    }

    const reply = data.reply || data.response;

    if (!reply) {
      throw new Error("Empty response");
    }

    addMessage(reply, "bot");

    if (imageToSend) {
      clearSelectedImage();
      if (promptInput) promptInput.value = "";
    }

    status.textContent = "";

    speakText(reply);

  } catch (error) {
    console.error("KYRGYZ AI error:", error);
    status.textContent =
      translations[currentLang].error + " " + error.message;
  } finally {
    button.disabled = false;
    input.focus();
  }
}

async function startVoice() {
  const voiceBtn = document.getElementById("voiceBtn");

  if (isRecording) {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setVoiceStatus("Браузер микрофонду колдобойт. Chrome колдонуп көрүңүз.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    recordedChunks = [];

    let options = {};

    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
      options.mimeType = "audio/webm;codecs=opus";
    }

    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstart = () => {
      isRecording = true;

      if (voiceBtn) voiceBtn.classList.add("recording");

      setVoiceStatus(
        "🎙️ Сүйлөп баштаңыз. Бүткөндө микрофонду кайра басыңыз."
      );
    };

    mediaRecorder.onstop = async () => {
      isRecording = false;

      if (voiceBtn) voiceBtn.classList.remove("recording");

      stream.getTracks().forEach(track => track.stop());

      const mimeType = mediaRecorder.mimeType || "audio/webm";
      const audioBlob = new Blob(recordedChunks, {
        type: mimeType
      });

      if (!audioBlob.size) {
        setVoiceStatus("Үн жазылган жок. Кайра аракет кылыңыз.");
        return;
      }

      setVoiceStatus("Үн таанылып жатат...");

      try {
        const response = await fetch(TRANSCRIBE_URL, {
          method: "POST",
          headers: { "Content-Type": mimeType },
          body: audioBlob
        });

        const data = await response.json();

        if (!response.ok || !data.text) {
          throw new Error(data.error || "Үн таанылган жок.");
        }

        const input = document.getElementById("userInput");

        if (!input) return;

        input.value = data.text.trim();

        setVoiceStatus(
          "Текстти текшериңиз. Анан жөнөтүү баскычын басыңыз."
        );

      } catch (error) {
        console.error("Transcription:", error);
        setVoiceStatus("Үн таанууда ката: " + error.message);
      }
    };

    mediaRecorder.start();

  } catch (error) {
    console.error("Microphone error:", error);
    setVoiceStatus("Микрофонго уруксат бериңиз.");
  }
}

/* СҮРӨТ ТИРКӨӨ — КАДИМКИ ЧАТКА */

function setupImageUpload() {
  const imageBtn = document.getElementById("imageBtn");
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("imagePreview");
  const previewImage = document.getElementById("previewImage");
  const removeBtn = document.getElementById("removeImageBtn");
  const analyzeBtn = document.getElementById("analyzeImageBtn");

  if (!imageBtn || !imageInput || !preview || !previewImage) return;

  // Өзүнчө талдоо баскычы колдонулбайт
  if (analyzeBtn) analyzeBtn.style.display = "none";

  imageBtn.addEventListener("click", () => {
    imageInput.click();
  });

  imageInput.addEventListener("change", () => {
    const file = imageInput.files && imageInput.files[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("JPG, PNG же WEBP форматындагы сүрөт тандаңыз.");
      imageInput.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Сүрөт 5 MB ашпашы керек. Кичирээк сүрөт тандаңыз.");
      imageInput.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      selectedImage = reader.result;
      previewImage.src = selectedImage;
      preview.style.display = "block";
    };

    reader.onerror = () => {
      alert("Сүрөттү окуу мүмкүн болгон жок.");
    };

    reader.readAsDataURL(file);
  });

  if (removeBtn) {
    removeBtn.addEventListener("click", clearSelectedImage);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatForm");

  if (form) {
    form.addEventListener("submit", sendMessage);
  }

  const voiceBtn = document.getElementById("voiceBtn");

  if (voiceBtn) {
    voiceBtn.addEventListener("click", startVoice);
  }

  setupImageUpload();
  setLang("ky");
});
