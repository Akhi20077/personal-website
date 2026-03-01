function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Rotating / fading words in hero section
(function initRotatingWords() {
  const wrap = document.querySelector(".rotating-words-wrap");
  if (!wrap) return;
  const words = wrap.querySelectorAll(".rotating-word");
  if (words.length === 0) return;
  let index = 0;
  setInterval(() => {
    words[index].classList.remove("active");
    index = (index + 1) % words.length;
    words[index].classList.add("active");
  }, 2500);
})();

// About section image carousel
(function initAboutCarousel() {
  const track = document.getElementById("aboutCarouselTrack");
  const dotsContainer = document.getElementById("aboutCarouselDots");
  const carousel = document.getElementById("aboutCarousel");
  if (!track || !dotsContainer || !carousel) return;

  const slides = track.querySelectorAll(".about-carousel-slide");
  const total = slides.length;
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function getSlideWidth() {
    const slide = track.querySelector(".about-carousel-slide");
    return slide ? slide.getBoundingClientRect().width : 400;
  }

  function setSlide(index) {
    currentIndex = ((index % total) + total) % total;
    const slideWidthPx = getSlideWidth();
    const peekPx = Math.round(slideWidthPx * 0.035);
    const tx = currentIndex === 0 ? 0 : -currentIndex * slideWidthPx + peekPx;
    track.style.transform = `translateX(${tx}px)`;
    dotsContainer.querySelectorAll(".about-carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  window.addEventListener("resize", () => setSlide(currentIndex));

  const prevBtn = document.getElementById("aboutCarouselPrev");
  const nextBtn = document.getElementById("aboutCarouselNext");
  if (prevBtn) prevBtn.addEventListener("click", () => setSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => setSlide(currentIndex + 1));

  // Build dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "about-carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Go to photo " + (i + 1));
    dot.addEventListener("click", () => setSlide(i));
    dotsContainer.appendChild(dot);
  }

  // Touch / swipe
  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        setSlide(currentIndex + (diff > 0 ? 1 : -1));
      }
    },
    { passive: true }
  );

  // Mouse drag (optional, for desktop)
  let mouseDown = false;
  let startX = 0;
  carousel.addEventListener("mousedown", (e) => {
    mouseDown = true;
    startX = e.pageX;
  });
  carousel.addEventListener("mouseleave", () => (mouseDown = false));
  carousel.addEventListener("mouseup", (e) => {
    if (!mouseDown) return;
    mouseDown = false;
    const diff = startX - e.pageX;
    if (Math.abs(diff) > 50) {
      setSlide(currentIndex + (diff > 0 ? 1 : -1));
    }
  });
})();