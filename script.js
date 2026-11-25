/* ==========================================
   KYRGYZ AI — CHAT + SUPABASE AUTH + HISTORY
   ========================================== */

const API_URL = "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/chat";
const SPEAK_URL = "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/speak";
const TRANSCRIBE_URL = "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/transcribe";

/* SUPABASE МААЛЫМАТТАРЫ */
const SUPABASE_URL = "https://akxeexfeqsqvgpbkryrh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_WKsyjfWzaC6D6RgwuPUnEw_9qOhI12b";

let supabaseClient = null;
let currentUser = null;
let currentConversationId = null;
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let selectedImage = null;
let isLoadingHistory = false;
let currentLang = "ky";
/** Local chat buffer for context (last N turns) — helps the model stay consistent */
let chatHistory = [];
const MAX_HISTORY = 12;

const LANGUAGE_NAMES = {
  ky: "Kyrgyz (кыргызча)",
  ru: "Russian (русский)",
  en: "English"
};

/** Strong system instruction so answers stay professional and in the chosen language */
function buildSystemInstruction() {
  const lang = LANGUAGE_NAMES[currentLang] || LANGUAGE_NAMES.ky;
  return [
    "You are KYRGYZ AI — a professional artificial intelligence company assistant from Kyrgyzstan.",
    "Your style: precise, clear, respectful, and highly professional (like a top-tier AI product).",
    "ALWAYS answer ONLY in " + lang + ". Never mix languages. Never switch language unless the user explicitly asks.",
    "If the user writes in another language, still reply in " + lang + " (or briefly acknowledge and answer in " + lang + ").",
    "Be accurate. If you are unsure, say so honestly. Do not invent facts.",
    "Keep answers structured and useful. Use short paragraphs. Avoid fluff.",
    "You represent the company KYRGYZ AI. Be confident but not arrogant.",
    "When an image is provided: describe and analyze it carefully. You cannot edit or generate new images yet — say so politely if asked for montage/editing."
  ].join(" ");
}

const translations = {
  ky: {
    navAbout:"Компания", navServices:"Технология",
    navAssistant:"AI Платформа", headerCta:"Баштоо",
    eyebrowText:"КЫРГЫЗСТАНДАН ДҮЙНӨГӨ",
    heroLineOne:"Келечек", heroLineTwo:"ушул жерден башталат.",
    intro:"KYRGYZ AI — Кыргызстандан дүйнөгө багытталган жаңы муундагы жасалма интеллект компаниясы. Биз суверендүү AI, көп тилдүү интеллект жана глобалдык масштабды куруп жатабыз.",
    startButton:"AI менен сүйлөшүү", exploreButton:"Компанияны билүү",
    heroNote:"Your World. Your AI.", flagCaption:"КЫРГЫЗСТАН",
    description:"Бизнестин жана адамдардын күнүмдүк иштерин жасалма интеллект менен жеңилдетебиз. Биздин максат — Кыргызстандан чыккан дүйнөлүк деңгээлдеги AI платформасын куруу.",
    servicesKicker:"БИЗ КИМБИЗ",
    servicesTitle:"KYRGYZ AI —<br>жасалма интеллект компаниясы.",
    businessTitle:"Бизнес үчүн AI",
    businessText:"Иш процесстерин автоматташтыруу, акылдуу аналитика жана компаниялар үчүн жекелештирилген AI чечимдери.",
    peopleTitle:"Ар бир адам үчүн",
    peopleText:"Күнүмдүк суроолорго жооп, идеялар, окуу жана жеке жардамчы. AI ар кимге жеткиликтүү болушу керек.",
    globalTitle:"Дүйнөгө ачык",
    globalText:"Кыргызча, орусча жана англисче баарлашуу. Глобалдык рынокко чыгуу жана эл аралык өнөктөштүк.",
    chatKicker:"AI ПЛАТФОРМА",
    assistantTitle:"Сүйлөшүүнү баштаңыз",
    welcome:"Саламатсызбы! Мен KYRGYZ AI жардамчысымын. Сизге кандай жардам бере алам?",
    onlineText:"Онлайн жардамчы · Текст · Үн · Сүрөт",
    initialMessage:"Саламатсызбы! Мен KYRGYZ AI жардамчысымын. Сурооңузду жазыңыз.",
    placeholder:"Сурооңузду жазыңыз...",
    disclaimer:"KYRGYZ AI · Your World. Your AI.",
    closingTitle:"Бирге келечекке кадам таштайлы.",
    closingButton:"Азыр баштоо", sending:"Жөнөтүлүүдө...",
    error:"Ката кетти. Кайра аракет кылыңыз.",
    empty:"Сурооңузду жазыңыз.",
    imagePrompt:"Бул сүрөттү талдап бер. (Монтаж/редакция азырынча жок)",
    removeImage:"Өчүрүү"
  },
  ru: {
    navAbout:"Компания", navServices:"Технология",
    navAssistant:"AI Платформа", headerCta:"Начать",
    eyebrowText:"ИЗ КЫРГЫЗСТАНА В МИР",
    heroLineOne:"Будущее", heroLineTwo:"начинается здесь.",
    intro:"KYRGYZ AI — компания искусственного интеллекта нового поколения из Кыргызстана для всего мира. Мы строим суверенный AI, многоязычный интеллект и глобальный масштаб.",
    startButton:"Общаться с AI", exploreButton:"О компании",
    heroNote:"Your World. Your AI.", flagCaption:"КЫРГЫЗСТАН",
    description:"Мы упрощаем повседневные задачи бизнеса и людей с помощью искусственного интеллекта. Наша цель — создать AI-платформу мирового уровня из Кыргызстана.",
    servicesKicker:"КТО МЫ",
    servicesTitle:"KYRGYZ AI —<br>компания искусственного интеллекта.",
    businessTitle:"AI для бизнеса",
    businessText:"Автоматизация процессов, умная аналитика и персонализированные AI-решения для компаний.",
    peopleTitle:"Для каждого",
    peopleText:"Ответы на повседневные вопросы, идеи, обучение и персональный помощник. AI должен быть доступен всем.",
    globalTitle:"Открыты миру",
    globalText:"Общение на кыргызском, русском и английском. Выход на глобальный рынок и международное партнёрство.",
    chatKicker:"AI ПЛАТФОРМА",
    assistantTitle:"Начните разговор",
    welcome:"Здравствуйте! Я помощник KYRGYZ AI. Чем могу вам помочь?",
    onlineText:"Онлайн-помощник · Текст · Голос · Изображение",
    initialMessage:"Здравствуйте! Я помощник KYRGYZ AI. Напишите свой вопрос.",
    placeholder:"Напишите свой вопрос...",
    disclaimer:"KYRGYZ AI · Your World. Your AI.",
    closingTitle:"Давайте вместе шагнём в будущее.",
    closingButton:"Начать сейчас", sending:"Отправка...",
    error:"Произошла ошибка. Попробуйте ещё раз.",
    empty:"Напишите свой вопрос.",
    imagePrompt:"Проанализируй это фото. (Монтаж/редактирование пока недоступно)",
    removeImage:"Удалить"
  },
  en: {
    navAbout:"Company", navServices:"Technology",
    navAssistant:"AI Platform", headerCta:"Get started",
    eyebrowText:"FROM KYRGYZSTAN TO THE WORLD",
    heroLineOne:"The future", heroLineTwo:"starts here.",
    intro:"KYRGYZ AI is a next-generation artificial intelligence company from Kyrgyzstan for the world. We are building sovereign AI, multilingual intelligence, and global scale.",
    startButton:"Talk to AI", exploreButton:"About the company",
    heroNote:"Your World. Your AI.", flagCaption:"KYRGYZSTAN",
    description:"We make everyday tasks easier for businesses and people with artificial intelligence. Our mission is to build a world-class AI platform from Kyrgyzstan.",
    servicesKicker:"WHO WE ARE",
    servicesTitle:"KYRGYZ AI —<br>an artificial intelligence company.",
    businessTitle:"AI for business",
    businessText:"Workflow automation, intelligent analytics, and personalized AI solutions for companies.",
    peopleTitle:"For everyone",
    peopleText:"Answers to everyday questions, ideas, learning, and a personal assistant. AI should be accessible to all.",
    globalTitle:"Open to the world",
    globalText:"Communicate in Kyrgyz, Russian, and English. Global market expansion and international partnerships.",
    chatKicker:"AI PLATFORM",
    assistantTitle:"Start a conversation",
    welcome:"Hello! I'm the KYRGYZ AI assistant. How can I help you?",
    onlineText:"Online assistant · Text · Voice · Image",
    initialMessage:"Hello! I'm the KYRGYZ AI assistant. Write your question.",
    placeholder:"Write your question...",
    disclaimer:"KYRGYZ AI · Your World. Your AI.",
    closingTitle:"Let's take a step into the future together.",
    closingButton:"Start now", sending:"Sending...",
    error:"Something went wrong. Please try again.",
    empty:"Please write your question.",
    imagePrompt:"Analyze this image. (Montage/editing not available yet)",
    removeImage:"Remove"
  }
};

/* ЖАЛПЫ ЖАРДАМЧЫ ФУНКЦИЯЛАР */

function getText(key) {
  return translations[currentLang]?.[key] || translations.ky[key] || key;
}

function setVoiceStatus(message) {
  const status = document.getElementById("voiceStatus");
  if (status) status.textContent = message;
}

function setAccountStatus(message) {
  const status = document.getElementById("accountStatus");
  if (status) status.textContent = message;
}

function setLang(lang, button) {
  if (!translations[lang]) return;
  const langChanged = currentLang && currentLang !== lang;
  currentLang = lang;
  if (langChanged) {
    // Avoid mixing languages in the model context
    chatHistory = [];
  }
  const words = translations[lang];

  Object.keys(words).forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;
    if (id === "servicesTitle") element.innerHTML = words[id];
    else element.textContent = words[id];
  });

  const input = document.getElementById("userInput");
  if (input) input.placeholder = words.placeholder;

  const prompt = document.getElementById("imagePrompt");
  if (prompt && !prompt.value) prompt.placeholder = words.imagePrompt;

  const removeButton = document.getElementById("removeImageBtn");
  if (removeButton) removeButton.textContent = words.removeImage;

  const analyzeButton = document.getElementById("analyzeImageBtn");
  if (analyzeButton) analyzeButton.style.display = "none";

  document.documentElement.lang = lang;

  document.querySelectorAll(".languages button").forEach(btn => {
    btn.classList.remove("active");
  });

  if (button) button.classList.add("active");
  else {
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

function clearChatDisplay() {
  const messages = document.getElementById("messages");
  if (messages) messages.innerHTML = "";
  chatHistory = [];
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

/* SUPABASE ИНИЦИАЛИЗАЦИЯСЫ */

function initializeSupabase() {
  if (!window.supabase || !window.supabase.createClient) {
    setAccountStatus("Supabase китепканасы жүктөлгөн жок. Интернетти текшериңиз.");
    return;
  }

  if (SUPABASE_URL.includes("PASTE_") ||
      SUPABASE_PUBLISHABLE_KEY.includes("PASTE_")) {
    setAccountStatus("Supabase URL жана Publishable key кодго киргизиле элек.");
    return;
  }

  try {
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );
    listenToAuthChanges();
    checkCurrentSession();
  } catch (error) {
    console.error("Supabase initialization:", error);
    setAccountStatus("Supabase туташтырууда ката кетти.");
  }
}

async function checkCurrentSession() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    await updateAuthInterface(data.session?.user || null);
  } catch (error) {
    console.error("Session error:", error);
    setAccountStatus("Аккаунт абалын текшерүү мүмкүн болгон жок.");
  }
}

function listenToAuthChanges() {
  if (!supabaseClient) return;
  supabaseClient.auth.onAuthStateChange((event, session) => {
    setTimeout(() => {
      updateAuthInterface(session?.user || null);
    }, 0);
  });
}

async function updateAuthInterface(user) {
  const previousUserId = currentUser?.id || null;
  currentUser = user;

  const userElement = document.getElementById("accountUser");
  const signInButton = document.getElementById("signInBtn");
  const googleSignInButton = document.getElementById("googleSignInBtn");
  const signUpButton = document.getElementById("signUpBtn");
  const signOutButton = document.getElementById("signOutBtn");
  const historyButtons = document.querySelector(".history-actions");

  if (user) {
    if (userElement) userElement.textContent = "Кирдиңиз: " + user.email;
    if (signInButton) signInButton.hidden = true;
    if (googleSignInButton) googleSignInButton.hidden = true;
    if (signUpButton) signUpButton.hidden = true;
    if (signOutButton) signOutButton.hidden = false;
    if (historyButtons) historyButtons.style.display = "flex";

    setAccountStatus("Аккаунт ийгиликтүү туташты.");

    if (previousUserId !== user.id) {
      currentConversationId = null;
      await loadConversations();
      showWelcomeMessage(true);
    }
  } else {
    if (userElement) userElement.textContent = "Аккаунтка кире элексиз.";
    if (signInButton) signInButton.hidden = false;
    if (googleSignInButton) googleSignInButton.hidden = false;
    if (signUpButton) signUpButton.hidden = false;
    if (signOutButton) signOutButton.hidden = true;
    if (historyButtons) historyButtons.style.display = "none";

    // Only reset chat when user actually logged out (not on every page load)
    if (previousUserId) {
      currentConversationId = null;
      renderConversationList([]);
      clearChatDisplay();
      showWelcomeMessage(true);
    }
  }
}

function showWelcomeMessage(force) {
  const messages = document.getElementById("messages");
  if (!force && messages && messages.children.length > 0) return;
  clearChatDisplay();
  chatHistory = [];
  addMessage(getText("initialMessage"), "bot");
}

/* АККАУНТ АЧУУ */

async function signUp() {
  if (!supabaseClient) {
    setAccountStatus("Алгач Supabase URL жана Publishable key киргизиңиз.");
    return;
  }

  const email = document.getElementById("authEmail")?.value.trim();
  const password = document.getElementById("authPassword")?.value;

  if (!email || !password) {
    setAccountStatus("Электрондук почта жана сырсөздү жазыңыз.");
    return;
  }

  if (password.length < 6) {
    setAccountStatus("Сырсөз кеминде 6 белгиден турушу керек.");
    return;
  }

  setAccountStatus("Аккаунт түзүлүп жатат...");

  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;

    if (data.session) {
      setAccountStatus("Аккаунт ийгиликтүү ачылды!");
    } else {
      setAccountStatus("Катталуу ийгиликтүү. Электрондук почтаңызды текшерип, катталууну ырастаңыз.");
    }
  } catch (error) {
    console.error("Sign up:", error);
    setAccountStatus("Катталууда ката: " + error.message);
  }
}

/* АККАУНТКА КИРҮҮ */

async function signIn() {
  if (!supabaseClient) {
    setAccountStatus("Supabase туташкан жок.");
    return;
  }

  const email = document.getElementById("authEmail")?.value.trim();
  const password = document.getElementById("authPassword")?.value;

  if (!email || !password) {
    setAccountStatus("Электрондук почта жана сырсөздү жазыңыз.");
    return;
  }

  setAccountStatus("Аккаунтка кирип жатат...");

  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    setAccountStatus("Ийгиликтүү кирдиңиз!");
  } catch (error) {
    console.error("Sign in:", error);
    setAccountStatus("Кирүүдө ката: " + error.message);
  }
}

/* GOOGLE МЕНЕН КИРҮҮ */

async function signInWithGoogle() {
  if (!supabaseClient) {
    setAccountStatus("Supabase туташкан жок.");
    return;
  }

  setAccountStatus("Google аркылуу кирүү...");

  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error("Google sign in:", error);
    setAccountStatus("Google аркылуу кирүүдө ката: " + error.message);
  }
}

/* АККАУНТТАН ЧЫГУУ */

async function signOut() {
  if (!supabaseClient) return;

  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    setAccountStatus("Аккаунттан чыктыңыз.");
  } catch (error) {
    console.error("Sign out:", error);
    setAccountStatus("Чыгууда ката: " + error.message);
  }
}

/* СҮЙЛӨШҮҮЛӨРДҮН ТАРЫХЫ */

async function createConversation() {
  if (!supabaseClient || !currentUser) return null;

  try {
    const { data, error } = await supabaseClient
      .from("conversations")
      .insert({ user_id: currentUser.id, title: "Жаңы сүйлөшүү" })
      .select("id")
      .single();

    if (error) throw error;
    currentConversationId = data.id;
    await loadConversations();
    return data.id;
  } catch (error) {
    console.error("Create conversation:", error);
    setAccountStatus("Сүйлөшүү түзүүдө ката: " + error.message);
    return null;
  }
}

async function ensureConversation() {
  if (!currentUser) return null;
  if (currentConversationId) return currentConversationId;
  return await createConversation();
}

async function loadConversations() {
  if (!supabaseClient || !currentUser) return;

  try {
    const { data, error } = await supabaseClient
      .from("conversations")
      .select("id,title,created_at")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    renderConversationList(data || []);
  } catch (error) {
    console.error("Load conversations:", error);
    setAccountStatus("Сүйлөшүүлөрдү жүктөөдө ката: " + error.message);
  }
}

function renderConversationList(conversations) {
  const list = document.getElementById("conversationList");
  if (!list) return;

  list.innerHTML = "";
  if (!currentUser) return;

  if (!conversations.length) {
    const empty = document.createElement("p");
    empty.textContent = "Азырынча сүйлөшүүлөр жок.";
    empty.style.color = "#9aa8bd";
    list.appendChild(empty);
    return;
  }

  conversations.forEach(conversation => {
    const item = document.createElement("button");
    item.type = "button";
    item.textContent = conversation.title || "Жаңы сүйлөшүү";

    if (conversation.id === currentConversationId) {
      item.classList.add("active");
    }

    item.addEventListener("click", () => openConversation(conversation.id));
    list.appendChild(item);
  });
}

async function openConversation(conversationId) {
  if (!supabaseClient || !currentUser || isLoadingHistory) return;

  isLoadingHistory = true;
  currentConversationId = conversationId;

  try {
    const { data, error } = await supabaseClient
      .from("messages")
      .select("role,content,created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    clearChatDisplay();

    if (!data || data.length === 0) {
      addMessage(getText("initialMessage"), "bot");
    } else {
      data.forEach(message => {
        addMessage(message.content, message.role === "user" ? "user" : "bot");
      });
    }

    await loadConversations();
  } catch (error) {
    console.error("Open conversation:", error);
    setAccountStatus("Сүйлөшүүнү ачууда ката: " + error.message);
  } finally {
    isLoadingHistory = false;
  }
}

async function startNewConversation() {
  if (!currentUser) {
    setAccountStatus("Сүйлөшүү тарыхын колдонуу үчүн аккаунтка кириңиз.");
    return;
  }

  currentConversationId = null;
  clearSelectedImage();
  showWelcomeMessage(true);
  await createConversation();
}

async function saveMessage(role, content) {
  if (!supabaseClient || !currentUser || !content) return;

  const conversationId = await ensureConversation();
  if (!conversationId) throw new Error("Сүйлөшүү түзүлгөн жок.");

  const { error } = await supabaseClient
    .from("messages")
    .insert({ conversation_id: conversationId, role, content });

  if (error) throw error;
}

/* ҮН МЕНЕН ЖООП БЕРҮҮ */

async function speakText(text) {
  if (!text || !String(text).trim()) return;
  try {
    const response = await fetch(SPEAK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: String(text).slice(0, 1200),
        language: currentLang,
        lang: currentLang
      })
    });

    if (!response.ok) throw new Error("Voice server error: " + response.status);

    const audioBlob = await response.blob();
    if (!audioBlob || audioBlob.size < 100) {
      console.warn("KYRGYZ AI Voice: empty audio");
      return;
    }
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => URL.revokeObjectURL(audioUrl);
    audio.onerror = () => URL.revokeObjectURL(audioUrl);
    await audio.play();
  } catch (error) {
    console.error("KYRGYZ AI Voice:", error);
  }
}

/* СҮРӨТТҮ ТАЗАЛОО */

function clearSelectedImage() {
  selectedImage = null;
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("imagePreview");
  const previewImage = document.getElementById("previewImage");

  if (imageInput) imageInput.value = "";
  if (previewImage) previewImage.src = "";
  if (preview) preview.style.display = "none";
}

/* AI ЧАТКА БИЛДИРҮҮ ЖӨНӨТҮҮ */

async function sendMessage(event) {
  event.preventDefault();

  const input = document.getElementById("userInput");
  const button = document.getElementById("sendButton");
  const status = document.getElementById("status");
  const promptInput = document.getElementById("imagePrompt");

  if (!input || !button || !status) return;

  let message = input.value.trim();

  if (!message && selectedImage && promptInput) {
    message = promptInput.value.trim();
  }
  if (!message && selectedImage) message = getText("imagePrompt");

  if (!message && !selectedImage) {
    status.textContent = getText("empty");
    return;
  }

  const imageToSend = selectedImage;
  const messageForHistory = imageToSend
    ? message + " [Сүрөт тиркелген]"
    : message;

  if (imageToSend) addUserImageMessage(message, imageToSend);
  else addMessage(message, "user");

  input.value = "";
  button.disabled = true;
  status.textContent = getText("sending");

  try {
    if (currentUser) {
      try {
        await saveMessage("user", messageForHistory);
      } catch (saveError) {
        console.error("Save user message:", saveError);
        setAccountStatus("Билдирүү базага сакталган жок: " + saveError.message);
      }
    }

    // Keep local history for context
    chatHistory.push({ role: "user", content: messageForHistory });
    if (chatHistory.length > MAX_HISTORY) {
      chatHistory = chatHistory.slice(-MAX_HISTORY);
    }

    const payload = {
      message,
      language: currentLang,
      lang: currentLang,
      system: buildSystemInstruction(),
      instructions: buildSystemInstruction(),
      history: chatHistory.slice(0, -1), // previous turns only
      professional: true,
      company: "KYRGYZ AI"
    };
    if (imageToSend) payload.image = imageToSend;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Server error");

    let reply = data.reply || data.response || data.text || data.message;
    if (!reply) throw new Error("Empty response");
    reply = String(reply).trim();

    chatHistory.push({ role: "assistant", content: reply });
    if (chatHistory.length > MAX_HISTORY) {
      chatHistory = chatHistory.slice(-MAX_HISTORY);
    }

    addMessage(reply, "bot");

    if (currentUser) {
      try {
        await saveMessage("assistant", reply);
      } catch (saveError) {
        console.error("Save assistant message:", saveError);
        setAccountStatus("AI жообу базага сакталган жок: " + saveError.message);
      }
      await loadConversations();
    }

    if (imageToSend) {
      clearSelectedImage();
      if (promptInput) promptInput.value = "";
    }

    status.textContent = "";
    speakText(reply);
  } catch (error) {
    console.error("KYRGYZ AI error:", error);
    status.textContent = getText("error") + " " + error.message;
  } finally {
    button.disabled = false;
    input.focus();
  }
}

/* ҮНДҮ ТЕКСТКЕ АЙЛАНДЫРУУ */

async function startVoice() {
  const voiceBtn = document.getElementById("voiceBtn");

  if (isRecording) {
    if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setVoiceStatus("Браузер микрофонду колдобойт. Chrome колдонуп көрүңүз.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    let options = {};

    if (window.MediaRecorder &&
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
      options.mimeType = "audio/webm;codecs=opus";
    }

    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) recordedChunks.push(event.data);
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
        setVoiceStatus("Текстти текшериңиз. Анан жөнөтүү баскычын басыңыз.");
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

/* СҮРӨТ ТИРКӨӨ */

function setupImageUpload() {
  const imageBtn = document.getElementById("imageBtn");
  const imageInput = document.getElementById("imageInput");
  const preview = document.getElementById("imagePreview");
  const previewImage = document.getElementById("previewImage");
  const removeBtn = document.getElementById("removeImageBtn");
  const analyzeBtn = document.getElementById("analyzeImageBtn");

  if (!imageBtn || !imageInput || !preview || !previewImage) return;
  if (analyzeBtn) analyzeBtn.style.display = "none";

  imageBtn.addEventListener("click", () => imageInput.click());

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
    reader.onerror = () => alert("Сүрөттү окуу мүмкүн болгон жок.");
    reader.readAsDataURL(file);
  });

  if (removeBtn) removeBtn.addEventListener("click", clearSelectedImage);
}

/* БАРДЫК ФУНКЦИЯЛАРДЫ ИШКЕ КОШУУ */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chatForm");
  if (form) form.addEventListener("submit", sendMessage);

  const voiceBtn = document.getElementById("voiceBtn");
  if (voiceBtn) voiceBtn.addEventListener("click", startVoice);

  const signInBtn = document.getElementById("signInBtn");
  if (signInBtn) signInBtn.addEventListener("click", signIn);

  const googleSignInBtn = document.getElementById("googleSignInBtn");
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", signInWithGoogle);
  }

  const signUpBtn = document.getElementById("signUpBtn");
  if (signUpBtn) signUpBtn.addEventListener("click", signUp);

  const signOutBtn = document.getElementById("signOutBtn");
  if (signOutBtn) signOutBtn.addEventListener("click", signOut);

  const newConversationBtn = document.getElementById("newConversationBtn");
  if (newConversationBtn) {
    newConversationBtn.addEventListener("click", startNewConversation);
  }

  const refreshBtn = document.getElementById("refreshConversationsBtn");
  if (refreshBtn) refreshBtn.addEventListener("click", loadConversations);

  setupImageUpload();
  setLang("ky");
  showWelcomeMessage(true);
  initializeSupabase();
});
