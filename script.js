const API_URL = "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/chat";
const SPEAK_URL = "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/speak";
const TRANSCRIBE_URL = "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/transcribe";

const translations = {
  ky: {
    navAbout: "Платформа",
    navServices: "Мүмкүнчүлүктөр",
    navAssistant: "AI жардамчы",
    headerCta: "Баштоо ↗",
    eyebrowText: "КЫРГЫЗСТАНДАН ДҮЙНӨГӨ",
    heroLineOne: "Келечек",
    heroLineTwo: "ушул жерден башталат.",
    intro: "Кыргызстандан дүйнөгө багытталган жаңы муундагы жасалма интеллект платформасы.",
    startButton: "AI менен сүйлөшүү",
    exploreButton: "Мүмкүнчүлүктөрдү көрүү",
    heroNote: "Your World. Your AI.",
    flagCaption: "Дүйнө үчүн жаралган",
    description: "Бизнестин жана адамдардын күнүмдүк иштерин жасалма интеллект менен жеңилдетебиз.",
    servicesKicker: "БИЗ ЭМНЕ КЫЛАБЫЗ",
    servicesTitle: "Бир платформа.<br>Чексиз мүмкүнчүлүк.",
    businessTitle: "Бизнес үчүн AI",
    businessText: "Иш процесстерин автоматташтыруу жана бизнеске акылдуу жардам.",
    peopleTitle: "Ар бир адам үчүн",
    peopleText: "Күнүмдүк суроолорго жооп, идеялар жана жеке жардамчы.",
    globalTitle: "Дүйнөгө ачык",
    globalText: "Кыргызча, орусча жана англисче баарлашуу мүмкүнчүлүгү.",
    chatKicker: "AI МЕНЕН ТААНЫШЫҢЫЗ",
    assistantTitle: "Сүйлөшүүнү башта.",
    welcome: "Саламатсызбы! Мен KYRGYZ AI жардамчысымын. Сизге кандай жардам бере алам?",
    onlineText: "Онлайн жардамчы",
    initialMessage: "Саламатсызбы! Мен KYRGYZ AI жардамчысымын. Сурооңузду жазыңыз.",
    placeholder: "Сурооңузду жазыңыз...",
    disclaimer: "KYRGYZ AI · Your World. Your AI.",
    closingTitle: "Келечекке бирге кадам таштайлы.",
    closingButton: "Азыр баштоо",
    sending: "Жөнөтүлүүдө...",
    error: "Ката кетти. Кайра аракет кылыңыз.",
    empty: "Сурооңузду жазыңыз."
  },
  ru: {
    navAbout: "Платформа",
    navServices: "Возможности",
    navAssistant: "AI помощник",
    headerCta: "Начать ↗",
    eyebrowText: "ИЗ КЫРГЫЗСТАНА В МИР",
    heroLineOne: "Будущее",
    heroLineTwo: "начинается здесь.",
    intro: "Платформа искусственного интеллекта нового поколения, созданная в Кыргызстане для всего мира.",
    startButton: "Общаться с AI",
    exploreButton: "Наши возможности",
    heroNote: "Your World. Your AI.",
    flagCaption: "Создано для мира",
    description: "Мы упрощаем повседневные задачи бизнеса и людей с помощью искусственного интеллекта.",
    servicesKicker: "ЧТО МЫ ДЕЛАЕМ",
    servicesTitle: "Одна платформа.<br>Безграничные возможности.",
    businessTitle: "AI для бизнеса",
    businessText: "Автоматизация рабочих процессов и интеллектуальная помощь бизнесу.",
    peopleTitle: "Для каждого",
    peopleText: "Ответы на повседневные вопросы, идеи и персональный помощник.",
    globalTitle: "Открыты миру",
    globalText: "Общение на кыргызском, русском и английском языках.",
    chatKicker: "ПОЗНАКОМЬТЕСЬ С AI",
    assistantTitle: "Начните разговор.",
    welcome: "Здравствуйте! Я помощник KYRGYZ AI. Чем могу вам помочь?",
    onlineText: "Онлайн-помощник",
    initialMessage: "Здравствуйте! Я помощник KYRGYZ AI. Напишите свой вопрос.",
    placeholder: "Напишите свой вопрос...",
    disclaimer: "KYRGYZ AI · Your World. Your AI.",
    closingTitle: "Давайте вместе двигаться в будущее.",
    closingButton: "Начать сейчас",
    sending: "Отправка...",
    error: "Произошла ошибка. Попробуйте ещё раз.",
    empty: "Напишите свой вопрос."
  },
  en: {
    navAbout: "Platform",
    navServices: "Features",
    navAssistant: "AI Assistant",
    headerCta: "Get started ↗",
    eyebrowText: "FROM KYRGYZSTAN TO THE WORLD",
    heroLineOne: "The future",
    heroLineTwo: "starts here.",
    intro: "A new-generation artificial intelligence platform built in Kyrgyzstan for the world.",
    startButton: "Talk to AI",
    exploreButton: "Explore features",
    heroNote: "Your World. Your AI.",
    flagCaption: "Made for the world",
    description: "We make everyday tasks easier for businesses and people with artificial intelligence.",
    servicesKicker: "WHAT WE DO",
    servicesTitle: "One platform.<br>Endless possibilities.",
    businessTitle: "AI for business",
    businessText: "Automate workflows and bring intelligent assistance to your business.",
    peopleTitle: "For everyone",
    peopleText: "Answers to everyday questions, ideas, and a personal assistant.",
    globalTitle: "Open to the world",
    globalText: "Communicate in Kyrgyz, Russian, and English.",
    chatKicker: "MEET YOUR AI",
    assistantTitle: "Start a conversation.",
    welcome: "Hello! I'm the KYRGYZ AI assistant. How can I help you?",
    onlineText: "Online assistant",
    initialMessage: "Hello! I'm the KYRGYZ AI assistant. Write your question.",
    placeholder: "Write your question...",
    disclaimer: "KYRGYZ AI · Your World. Your AI.",
    closingTitle: "Let's take a step into the future together.",
    closingButton: "Start now",
    sending: "Sending...",
    error: "Something went wrong. Please try again.",
    empty: "Please write your question."
  }
};

let currentLang = "ky";
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;

function setVoiceStatus(message) {
  const status = document.getElementById("voiceStatus");
  if (status) status.textContent = message;
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

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstart = () => {
      isRecording = true;
      if (voiceBtn) voiceBtn.classList.add("recording");
      setVoiceStatus("🎙️ Сүйлөп баштаңыз. Бүткөндө микрофонду кайра басыңыз.");
    };

    mediaRecorder.onstop = async () => {
      isRecording = false;
      if (voiceBtn) voiceBtn.classList.remove("recording");

      stream.getTracks().forEach(track => track.stop());

      const mimeType = mediaRecorder.mimeType || "audio/webm";
      const audioBlob = new Blob(recordedChunks, { type: mimeType });

      if (!audioBlob.size) {
        setVoiceStatus("Үн жазылган жок. Кайра аракет кылыңыз.");
        return;
      }

      setVoiceStatus("Үн таанылып жатат...");

      try {
        const response = await fetch(TRANSCRIBE_URL, {
          method: "POST",
          headers: {
            "Content-Type": mimeType
          },
          body: audioBlob
        });

        const data = await response.json();

        if (!response.ok || !data.text) {
          throw new Error(data.error || "Үн таанылган жок.");
        }

        const input = document.getElementById("userInput");
        if (!input) return;

        input.value = data.text.trim();
        setVoiceStatus("Текстти текшериңиз. Анан Жөнөтүү баскычын басыңыз.");

      } catch (error) {
        console.error("KYRGYZ AI transcription:", error);
        setVoiceStatus("Үн таанууда ката: " + error.message);
      }
    };

    mediaRecorder.start();

  } catch (error) {
    console.error("Microphone error:", error);
    setVoiceStatus("Микрофонго уруксат бериңиз.");
  }
}

async function speakText(text) {
  try {
    const response = await fetch(SPEAK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Үн серверинде ката: " + response.status);
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

function setLang(lang, button) {
  if (!translations[lang]) return;

  currentLang = lang;
  const words = translations[lang];

  Object.keys(words).forEach((id) => {
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

  document.documentElement.lang = lang;

  document.querySelectorAll(".languages button").forEach((btn) => {
    btn.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  } else {
    const activeButton = document.querySelector(
      `.languages button[onclick*="'${lang}'"]`
    );
    if (activeButton) activeButton.classList.add("active");
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

async function sendMessage(event) {
  event.preventDefault();

  const input = document.getElementById("userInput");
  const button = document.getElementById("sendButton");
  const status = document.getElementById("status");

  if (!input || !button || !status) return;

  const message = input.value.trim();
  const words = translations[currentLang];

  if (!message) {
    status.textContent = words.empty;
    return;
  }

  addMessage(message, "user");
  input.value = "";
  button.disabled = true;
  status.textContent = words.sending;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const data = await response.json();
    const reply = data.reply || data.response;

    if (!reply) {
      throw new Error("Empty response");
    }

    addMessage(reply, "bot");
    speakText(reply);
    status.textContent = "";

  } catch (error) {
    console.error("KYRGYZ AI error:", error);
    status.textContent = words.error;
  } finally {
    button.disabled = false;
    input.focus();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatForm");

  if (form) {
    form.addEventListener("submit", sendMessage);
  }

  setLang("ky");

  const voiceBtn = document.getElementById("voiceBtn");

  if (voiceBtn) {
    voiceBtn.addEventListener("click", startVoice);
  }
});

