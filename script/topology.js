document.addEventListener("DOMContentLoaded", function () {
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
});
