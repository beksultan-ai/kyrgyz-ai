/* KYRGYZ AI — cinematic intro */
function playIntroSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = "sine";
    osc2.type = "triangle";
    osc1.frequency.setValueAtTime(392, now);
    osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.35);
    osc2.frequency.setValueAtTime(784, now);
    osc2.frequency.exponentialRampToValueAtTime(1046.5, now + 0.4);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.75);
    osc2.stop(now + 0.75);
  } catch (e) {}
}

function runSiteIntro() {
  const intro = document.getElementById("siteIntro");
  if (!intro) {
    document.body.classList.remove("is-intro");
    return;
  }
  try {
    if (navigator.vibrate) navigator.vibrate([30, 40, 50, 40, 80]);
  } catch (e) {}
  setTimeout(playIntroSound, 180);
  const finish = () => {
    intro.classList.add("is-done");
    document.body.classList.remove("is-intro");
    document.body.classList.add("page-reveal");
    setTimeout(() => intro.remove(), 800);
  };
  const timer = setTimeout(finish, 2000);
  intro.addEventListener("click", () => {
    clearTimeout(timer);
    finish();
  }, { once: true });
}

document.addEventListener("DOMContentLoaded", runSiteIntro);
