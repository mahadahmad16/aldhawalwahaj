(function () {
  const container = document.querySelector(".home-hero-slides");
  const slides = Array.from(document.querySelectorAll(".home-hero-slide"));
  const hero = document.querySelector(".home-hero");

  if (!container || slides.length < 2) return;

  // Controls are intentionally not used on this page
  document.querySelector(".hero-slider-controls")?.remove();

  const SLIDE_DELAY = 3000;
  const DURATION = 500;
  const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

  let current = 0;
  let animating = false;
  let timer;

  // Self-contained setup: inline styles beat any leftover CSS
  container.style.position = "relative";
  container.style.overflow = "hidden";
  container.style.aspectRatio = "2172 / 724";

  slides.forEach((slide, i) => {
    slide.classList.remove("active", "is-left", "is-instant");
    slide.style.position = "absolute";
    slide.style.inset = "0";
    slide.style.willChange = "transform";
    slide.style.transition = "none";
    slide.style.transform = i === 0 ? "translateX(0)" : "translateX(100%)";
    slide.style.zIndex = i === 0 ? "2" : "1";
  });

  function goTo(next) {
    if (animating || next === current) return;
    animating = true;

    const outgoing = slides[current];
    const incoming = slides[next];

    // Make sure the incoming slide waits on the right, without animation
    incoming.style.transition = "none";
    incoming.style.transform = "translateX(100%)";
    incoming.style.zIndex = "2";
    outgoing.style.zIndex = "1";
    incoming.getBoundingClientRect(); // force reflow

    // Both slides move left together
    const t = "transform " + DURATION + "ms " + EASING;
    outgoing.style.transition = t;
    incoming.style.transition = t;
    outgoing.style.transform = "translateX(-100%)";
    incoming.style.transform = "translateX(0)";

    current = next;

    setTimeout(function () {
      // Park the old slide back on the right, unseen
      outgoing.style.transition = "none";
      outgoing.style.transform = "translateX(100%)";
      animating = false;
    }, DURATION + 50);
  }

  function nextSlide() {
    goTo((current + 1) % slides.length);
  }

  function start() {
    stop();
    timer = setInterval(nextSlide, SLIDE_DELAY);
  }

  function stop() {
    clearInterval(timer);
  }

  hero?.addEventListener("mouseenter", stop);
  hero?.addEventListener("mouseleave", start);
  document.addEventListener("visibilitychange", function () {
    document.hidden ? stop() : start();
  });

  start();
})();