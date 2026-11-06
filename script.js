async function sendMessage() {
  const input = document.getElementById("question");
  const messages = document.getElementById("messages");

  const message = input.value.trim();
  if (!message) return;

  messages.innerHTML += `<p><b>Сиз:</b> ${message}</p>`;
  input.value = "";

  const loading = document.createElement("p");
  loading.textContent = "KYRGYZ AI жооп даярдап жатат...";
  messages.appendChild(loading);

  try {
    const response = await fetch(
      "https://kyrgyz-ai-server.bekskylyc.workers.dev/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      }
    );

    const data = await response.json();
    loading.textContent = "KYRGYZ AI: " + (data.reply || data.error || "Жооп алынган жок.");
  } catch (error) {
    loading.textContent = "Ката кетти. Кайра аракет кылыңыз.";
  }
}
