const birthday = new Date("2026-09-17T00:00:00+07:00").getTime();

function countdown() {
  const now = Date.now();
  const d = Math.max(0, birthday - now);
  const totalHours = Math.floor(d / 3600000);
  const minute = Math.floor((d / 60000) % 60);
  const second = Math.floor((d / 1000) % 60);
  const hoursEl = document.querySelector("#hours");
  const minutesEl = document.querySelector("#minutes");
  const secondsEl = document.querySelector("#seconds");
  if (hoursEl) hoursEl.textContent = String(totalHours).padStart(2,"0");
  if (minutesEl) minutesEl.textContent = String(minute).padStart(2,"0");
  if (secondsEl) secondsEl.textContent = String(second).padStart(2,"0");
}
countdown();
setInterval(countdown,1000);

const music = document.querySelector("#music");
const musicBtn = document.querySelector("#musicBtn");
let playing = false;

async function playMusic() {
  try {
    music.volume = 0.75;
    await music.play();
    playing = true;
    musicBtn.textContent = "❚❚ Pause Music";
    document.body.classList.add("music-playing");
    return true;
  } catch (e) {
    console.error("Music playback error:", e);
    musicBtn.textContent = "♫ Play Music";
    return false;
  }
}

function pauseMusic() {
  music.pause();
  playing = false;
  musicBtn.textContent = "♫ Play Music";
  document.body.classList.remove("music-playing");
}

musicBtn.addEventListener("click", async () => {
  if (playing) pauseMusic();
  else {
    const ok = await playMusic();
    if (!ok) alert("Musiknya belum bisa diputar. Pastikan file assets/music/lagu.mp3 ada dan browser mengizinkan audio.");
  }
});

// Opening surprise: this click is a user gesture, so music can start here.
const opening = document.querySelector("#opening");
document.querySelector("#openSurprise").addEventListener("click", async () => {
  opening.classList.add("hide");
  burst(46);
  await playMusic();
  setTimeout(() => document.querySelector("#home").scrollIntoView({behavior:"smooth"}), 350);
});

document.querySelector("#startBtn").addEventListener("click", async () => {
  if (!playing) await playMusic();
  document.querySelector("#letter").scrollIntoView({behavior:"smooth"});
});

const modal = document.querySelector("#modal");
document.querySelector("#giftBtn").addEventListener("click", () => {
  modal.classList.add("show");
  burst(65);
});
document.querySelector("#close").addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });

document.addEventListener("keydown", e => {
  if (e.key === "Escape") modal.classList.remove("show");
});

function burst(count=40) {
  const symbols = ["♡","✦","✧","☁","⋆"];
  for(let i=0;i<count;i++){
    const h=document.createElement("span");
    h.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    h.style.position="fixed";
    h.style.left=Math.random()*100+"vw";
    h.style.top=(55+Math.random()*35)+"vh";
    h.style.zIndex="201";
    h.style.color=Math.random()>.45?"#78a9dc":"#ef9da9";
    h.style.fontSize=(15+Math.random()*25)+"px";
    h.style.pointerEvents="none";
    h.style.transition="transform 2.7s cubic-bezier(.2,.8,.2,1), opacity 2.7s ease";
    document.body.appendChild(h);
    requestAnimationFrame(()=>{
      h.style.transform=`translate(${(Math.random()-.5)*260}px,-${350+Math.random()*650}px) rotate(${Math.random()*500-250}deg) scale(${.7+Math.random()*.9})`;
      h.style.opacity="0";
    });
    setTimeout(()=>h.remove(),2900);
  }
}

// Small floating sparkles are generated once for a cute ambient effect.
const sparkleLayer = document.querySelector(".sparkle-layer");
for(let i=0;i<18;i++){
  const s=document.createElement("span");
  s.textContent = i%3===0 ? "♡" : "✦";
  s.style.position="absolute";
  s.style.left=Math.random()*100+"%";
  s.style.top=Math.random()*100+"%";
  s.style.color=i%2 ? "#ffffff" : "#efb5bd";
  s.style.fontSize=(10+Math.random()*16)+"px";
  s.style.animation=`floatHeart ${3+Math.random()*4}s ease-in-out ${Math.random()*-4}s infinite`;
  sparkleLayer.appendChild(s);
}

// Safety net for the audio element: if the file is interrupted, reset the UI.
music.addEventListener("pause", () => {
  if (!music.ended) {
    playing = false;
    musicBtn.textContent = "♫ Play Music";
  }
});
music.addEventListener("ended", () => {
  playing = false;
  musicBtn.textContent = "♫ Play Music";
});
