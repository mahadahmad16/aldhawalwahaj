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

    // Filter out hidden slides (like the desktop-only third banner on mobile)
    slides = allSlides.filter(
      (slide) => getComputedStyle(slide).display !== "none"
    );
    current = 0;

    // Clear any inline styles that JS may have previously applied
    allSlides.forEach((slide) => {
      slide.classList.remove("active", "is-left", "is-instant");
      slide.style.position = "";
      slide.style.inset = "";
      slide.style.willChange = "";
      slide.style.transition = "";
      slide.style.transform = "";
      slide.style.zIndex = "";
      slide.style.opacity = "";
    });

    if (!slides.length) return;

    // Set the first slide as active
    slides[0].classList.add("active");
    
    // Apply initial inline styles based on screen size
    if (mobileQuery.matches) {
      // Mobile: CSS handles positioning/opacity, we just set the active class
      slides[0].style.opacity = "1";
    } else {
      // Desktop: Set up the left-push translate state
      slides.forEach((slide, index) => {
        slide.style.position = "absolute";
        slide.style.inset = "0";
        slide.style.willChange = "transform";
        slide.style.transition = "none";
        slide.style.transform = index === 0 ? "translateX(0)" : "translateX(100%)";
        slide.style.zIndex = index === 0 ? "2" : "1";
      });
    }

    if (slides.length > 1) start();
  }

  function goTo(next) {
    if (animating || next === current || slides.length < 2) return;
    animating = true;

    const outgoing = slides[current];
    const incoming = slides[next];

    if (mobileQuery.matches) {
      // --- MOBILE FADE LOGIC ---
      outgoing.classList.remove("active");
      outgoing.style.opacity = "0";
      
      incoming.classList.add("active");
      incoming.style.opacity = "1";
      
      current = next;
      setTimeout(() => {
        animating = false;
      }, 450); // Matches CSS opacity transition

    } else {
      // --- DESKTOP LEFT-PUSH LOGIC ---
      incoming.style.transition = "none";
      incoming.style.transform = "translateX(100%)";
      incoming.style.zIndex = "2";
      outgoing.style.zIndex = "1";
      
      // Force reflow
      incoming.getBoundingClientRect(); 

      const t = "transform " + DURATION + "ms " + EASING;
      outgoing.style.transition = t;
      incoming.style.transition = t;
      
      outgoing.style.transform = "translateX(-100%)";
      outgoing.classList.remove("active");
      
      incoming.style.transform = "translateX(0)";
      incoming.classList.add("active");

      current = next;

      resetTimeout = setTimeout(function () {
        // Park the old slide back on the right
        outgoing.style.transition = "none";
        outgoing.style.transform = "translateX(100%)";
        animating = false;
      }, DURATION + 50);
    }
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

  // Re-run setup when the screen crosses the mobile breakpoint
  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", setup);
  } else {
    mobileQuery.addListener(setup);
  }

  setup();
})();