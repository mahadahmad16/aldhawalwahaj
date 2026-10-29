(function () {
  const container = document.querySelector(".home-hero-slides");
  const allSlides = Array.from(document.querySelectorAll(".home-hero-slide"));
  const hero = document.querySelector(".home-hero");

  if (!container || allSlides.length < 2) return;

  // Controls are intentionally not used on this page
  document.querySelector(".hero-slider-controls")?.remove();

  const SLIDE_DELAY = 5000;
  const DURATION = 700;
  const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
  const mobileQuery = window.matchMedia("(max-width: 600px)");

  let slides = [];
  let current = 0;
  let animating = false;
  let timer;
  let resetTimeout;

  function setup() {
    stop();
    clearTimeout(resetTimeout);
    animating = false;

    // Only slides that are visible at this screen size take part
    // (e.g. a slide marked .desktop-only is hidden on mobile by CSS)
    slides = allSlides.filter(
      (slide) => getComputedStyle(slide).display !== "none"
    );
    current = 0;

    // Banner height comes from CSS (aspect-ratio), so it is never set here
    container.style.position = "relative";
    container.style.overflow = "hidden";

    allSlides.forEach((slide) => {
      slide.classList.remove("active", "is-left", "is-instant");
      slide.style.position = "absolute";
      slide.style.inset = "0";
      slide.style.willChange = "transform";
      slide.style.transition = "none";
      slide.style.transform = "translateX(100%)";
      slide.style.zIndex = "1";
    });

    if (!slides.length) return;

    slides[0].style.transform = "translateX(0)";
    slides[0].style.zIndex = "2";

    if (slides.length > 1) start();
  }

  function goTo(next) {
    if (animating || next === current || slides.length < 2) return;
    animating = true;

    const outgoing = slides[current];
    const incoming = slides[next];

    // Incoming slide waits on the right, without animation
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

    resetTimeout = setTimeout(function () {
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
    if (document.hidden) stop();
    else if (slides.length > 1) start();
  });

  // Re-run when the screen crosses the mobile breakpoint (rotate / resize)
  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", setup);
  } else {
    mobileQuery.addListener(setup);
  }

  setup();
})();