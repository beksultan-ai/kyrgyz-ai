/* KYRGYZ AI — cinematic intro (tap to enter = sound works) */
(function () {
  function playIntroSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.12, now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      master.connect(ctx.destination);

      function tone(freq, type, start, dur) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(0.35, start + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        o.connect(g);
        g.connect(master);
        o.start(start);
        o.stop(start + dur + 0.05);
      }

      tone(392, "sine", now, 0.35);
      tone(523.25, "sine", now + 0.12, 0.4);
      tone(659.25, "triangle", now + 0.22, 0.5);
    } catch (e) {
      console.warn("KYRGYZ AI sound:", e);
    }
  }

  function vibrate() {
    try {
      if (navigator.vibrate) navigator.vibrate([40, 30, 60, 30, 100]);
    } catch (e) {}
  }

  function finishIntro(intro) {
    intro.classList.add("is-done");
    document.body.classList.remove("is-intro");
    document.body.classList.add("page-reveal");
    setTimeout(function () {
      if (intro.parentNode) intro.parentNode.removeChild(intro);
    }, 700);
  }

  function runSiteIntro() {
    var intro = document.getElementById("siteIntro");
    if (!intro) {
      document.body.classList.remove("is-intro");
      return;
    }

    // Hint: browsers block sound until user taps
    var hint = intro.querySelector(".intro-hint");
    if (!hint) {
      hint = document.createElement("p");
      hint.className = "intro-hint";
      hint.textContent = "Кирүү үчүн басыңыз · Tap to enter";
      intro.appendChild(hint);
    }

    var entered = false;
    function enter() {
      if (entered) return;
      entered = true;
      playIntroSound();
      vibrate();
      finishIntro(intro);
    }

    intro.addEventListener("click", enter, { once: true });
    intro.addEventListener("touchstart", enter, { once: true, passive: true });

    // Auto-enter after 4s without sound if user never taps
    setTimeout(function () {
      if (!entered) {
        entered = true;
        vibrate();
        finishIntro(intro);
      }
    }, 4000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runSiteIntro);
  } else {
    runSiteIntro();
  }
})();
