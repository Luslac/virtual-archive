
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

  const container = document.getElementById("sandboxBox");
  const iconElements = document.querySelectorAll(".bouncing-icon");
  let iconsData = [];
  const iconSize = 70;
  const radius = iconSize / 2;

  function initIcons() {
    const cWidth = container.clientWidth;
    const cHeight = container.clientHeight;
    iconsData = [];
    iconElements.forEach((el) => {
      let x = Math.random() * (cWidth - iconSize - 40) + 20;
      let y = Math.random() * (cHeight - iconSize - 40) + 20;
      let angle = Math.random() * Math.PI * 2;
      let speed = 2.2 + Math.random() * 1.5;
      iconsData.push({
        element: el,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: iconSize,
        height: iconSize,
        radius: radius,
      });
    });
  }

  initIcons();

  function updatePhysics() {
    const cWidth = container.clientWidth;
    const cHeight = container.clientHeight;

    for (let i = 0; i < iconsData.length; i++) {
      let item = iconsData[i];
      item.x += item.vx;
      item.y += item.vy;
      if (item.x <= 0) {
        item.x = 0;
        item.vx *= -1;
      } else if (item.x + item.width >= cWidth) {
        item.x = cWidth - item.width;
        item.vx *= -1;
      }
      if (item.y <= 0) {
        item.y = 0;
        item.vy *= -1;
      } else if (item.y + item.height >= cHeight) {
        item.y = cHeight - item.height;
        item.vy *= -1;
      }
    }

    for (let i = 0; i < iconsData.length; i++) {
      for (let j = i + 1; j < iconsData.length; j++) {
        let b1 = iconsData[i],
          b2 = iconsData[j];
        let dx = b2.x + b2.radius - (b1.x + b1.radius);
        let dy = b2.y + b2.radius - (b1.y + b1.radius);
        let distance = Math.sqrt(dx * dx + dy * dy);
        let minDist = b1.radius + b2.radius;

        if (distance < minDist) {
          let tempVx = b1.vx,
            tempVy = b1.vy;
          b1.vx = b2.vx;
          b1.vy = b2.vy;
          b2.vx = tempVx;
          b2.vy = tempVy;
          let overlap = minDist - distance,
            nx = dx / distance,
            ny = dy / distance;
          b1.x -= nx * overlap * 0.5;
          b1.y -= ny * overlap * 0.5;
          b2.x += nx * overlap * 0.5;
          b2.y += ny * overlap * 0.5;
        }
      }
    }

    for (let i = 0; i < iconsData.length; i++) {
      iconsData[i].element.style.transform =
        `translate(${iconsData[i].x}px, ${iconsData[i].y}px)`;
    }
    requestAnimationFrame(updatePhysics);
  }

  requestAnimationFrame(updatePhysics);

  window.addEventListener("resize", () => {
    const cWidth = container.clientWidth,
      cHeight = container.clientHeight;
    iconsData.forEach((item) => {
      if (item.x + item.width > cWidth) item.x = cWidth - item.width;
      if (item.y + item.height > cHeight) item.y = cHeight - item.height;
    });
  });
});
