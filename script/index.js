document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.getElementById("loading-screen");
  const loaderBar = document.getElementById("loader-bar");
  const loaderPercentage = document.getElementById("loader-percentage");

  const totalDuration = 2000;
  const intervalTime = 50;
  let currentProgress = 0;
  const increment = 100 / (totalDuration / intervalTime);

  const loadingInterval = setInterval(() => {
    currentProgress += increment;
    if (currentProgress >= 100) {
      currentProgress = 100;
      clearInterval(loadingInterval);
      setTimeout(() => loadingScreen.classList.add("loader-hidden"), 200);
    }

    loaderBar.style.width = currentProgress + "%";
    loaderPercentage.textContent = Math.floor(currentProgress) + "%";
  }, intervalTime);

  const bgMusic = document.getElementById("bg-music");
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");

  bgMusic.volume = 1;

  const savedTime = localStorage.getItem("musicTime");
  const savedState = localStorage.getItem("musicState");

  if (savedTime) bgMusic.currentTime = parseFloat(savedTime);

  if (savedState === "playing") {
    bgMusic
      .play()
      .then(() => {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
      })
      .catch((err) => console.log("Autoplay dicegah:", err));
  }

  bgMusic.addEventListener("timeupdate", () => {
    localStorage.setItem("musicTime", bgMusic.currentTime);
  });

  musicToggleBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic
        .play()
        .then(() => {
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
          localStorage.setItem("musicState", "playing");
        })
        .catch((err) => console.log("Autoplay dicegah:", err));
    } else {
      bgMusic.pause();
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
      localStorage.setItem("musicState", "paused");
    }
  });

  const nav = document.getElementById("navbar");
  const logoEl = nav.querySelector(".logo");
  const navLinkEls = nav.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section, footer");

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const theme = entry.target.getAttribute("data-theme");
          const color = theme === "dark" ? "#f8fafc" : "#0f172a";
          logoEl.style.color = color;
          musicToggleBtn.style.color = color;
          navLinkEls.forEach((link) => (link.style.color = color));
        }
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((sec) => navObserver.observe(sec));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("animate-show");
        else entry.target.classList.remove("animate-show");
      });
    },
    { rootMargin: "0px", threshold: 0.15 },
  );

  document
    .querySelectorAll(".fade-up, .fade-down")
    .forEach((el) => observer.observe(el));
});
