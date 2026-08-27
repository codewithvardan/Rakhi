/* ============================================================
   PERSONALIZE (keep in sync with comments at the top of index.html)
   - SISTER’S NAME
   - MY NAME
   - MUSIC file path
   - Surprise messages live in SURPRISES below
   ============================================================ */
const SITE = {
  sisterName: "Rutu Didi",
  brotherName: "Vardan",
  musicSrc: "audio/rakhi-song.mp4",
};

function spawnFloaters() {
  const hearts = document.querySelector(".bg-hearts");
  const sparkles = document.querySelector(".bg-sparkles");
  if (!hearts || !sparkles) return;

  const heartChars = ["💗", "💖", "❤️", "💕"];
  for (let i = 0; i < 14; i += 1) {
    const el = document.createElement("span");
    el.textContent = heartChars[i % heartChars.length];
    el.style.left = `${Math.random() * 100}%`;
    el.style.fontSize = `${0.7 + Math.random() * 1.1}rem`;
    el.style.animationDuration = `${14 + Math.random() * 16}s`;
    el.style.animationDelay = `${-Math.random() * 18}s`;
    hearts.appendChild(el);
  }
  for (let i = 0; i < 18; i += 1) {
    const el = document.createElement("span");
    el.textContent = "✦";
    el.style.left = `${Math.random() * 100}%`;
    el.style.animationDuration = `${10 + Math.random() * 14}s`;
    el.style.animationDelay = `${-Math.random() * 16}s`;
    sparkles.appendChild(el);
  }
}

function markLoadedPhotos() {
  document.querySelectorAll(".photo-slot img").forEach((img) => {
    const slot = img.closest(".photo-slot");
    const show = () => slot.classList.add("has-photo");
    const hide = () => {
      slot.classList.remove("has-photo");
      img.style.display = "none";
    };
    img.addEventListener("load", show);
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth > 0) show();
  });
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navAnchors = [...links.querySelectorAll("a")];
  const onScroll = () => {
    const y = window.scrollY + 96;
    let current = sections[0]?.id;
    sections.forEach((sec) => {
      if (sec.offsetTop <= y) current = sec.id;
    });
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function setupMusic() {
  const audio = document.getElementById("rakhi-audio");
  const btn = document.querySelector(".music-btn");
  if (!audio || !btn) return;

  const toast = (msg) => {
    const old = document.querySelector(".toast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  };

  btn.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        if (!audio.currentSrc && !audio.src) {
          audio.src = SITE.musicSrc;
        }
        await audio.play();
        btn.classList.add("playing");
        btn.setAttribute("aria-label", "Pause music");
      } else {
        audio.pause();
        btn.classList.remove("playing");
        btn.setAttribute("aria-label", "Play music");
      }
    } catch (err) {
      console.error("Audio play error:", err);
      toast("Tap ♪ again to play music.");
    }
  });
}

function setupSurprises() {
  const modal = document.getElementById("surprise-modal");
  const body = document.getElementById("modal-body");
  if (!modal || !body) return;

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  modal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  const openQuiz = () => {
    body.innerHTML = `
      <h3>Quick question</h3>
      <p class="quiz-q">Who is your favourite bro?</p>
      <div class="quiz-options">
        <button type="button" data-answer="1">Of course it's me</button>
        <button type="button" data-answer="2">Yaa I know, it's me again</button>
      </div>
      <p class="quiz-result" hidden></p>
    `;
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    const result = body.querySelector(".quiz-result");
    body.querySelectorAll("[data-answer]").forEach((btn) => {
      btn.addEventListener("click", () => {
        result.hidden = false;
        result.textContent =
          btn.dataset.answer === "1"
            ? "Correct. There was never another option. 😌❤️"
            : "Also correct. I accept this as legally binding. 🫶";
      });
    });
  };

  document.querySelectorAll("[data-surprise]").forEach((card) => {
    card.addEventListener("click", () => {
      openQuiz();
    });
  });
}

spawnFloaters();
markLoadedPhotos();
setupNav();
setupMusic();
setupSurprises();
