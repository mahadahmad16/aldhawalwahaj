document.addEventListener("DOMContentLoaded", () => {
  const INTERVAL = 5500;
  const DURATION = 700; // must match the CSS transition (0.7s)

  /* ---------- Home banner: left-push slider ---------- */
  const banner = document.querySelector(".home-hero");
  const pushSlides = [...document.querySelectorAll(".home-hero-slide")];

  if (banner && pushSlides.length > 1) {
    const dots = [...document.querySelectorAll(".hero-dot")];
    const prevBtn = document.querySelector(".hero-arrow.prev, .hero-arrow[data-dir='prev']") ||
                    document.querySelectorAll(".hero-arrow")[0];
    const nextBtn = document.querySelector(".hero-arrow.next, .hero-arrow[data-dir='next']") ||
                    document.querySelectorAll(".hero-arrow")[1];

    let current = pushSlides.findIndex(s => s.classList.contains("active"));
    if (current < 0) current = 0;

    // Clean initial state: only one slide active
    pushSlides.forEach((s, i) => {
      s.classList.remove("is-left", "is-instant");
      s.classList.toggle("active", i === current);
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === current));

    let busy = false;
    let timer;

    function goTo(index) {
      index = (index + pushSlides.length) % pushSlides.length;
      if (busy || index === current) return;
      busy = true;

      const outgoing = pushSlides[current];
      const incoming = pushSlides[index];

      // Both slides move left at the same time
      outgoing.classList.remove("active");
      outgoing.classList.add("is-left");
      incoming.classList.add("active");

      dots.forEach((d, i) => d.classList.toggle("active", i === index));
      current = index;

      // After the move, silently park the old slide back on the right
      setTimeout(() => {
        outgoing.classList.add("is-instant");
        outgoing.classList.remove("is-left");
        outgoing.getBoundingClientRect(); // force reflow
        outgoing.classList.remove("is-instant");
        busy = false;
      }, DURATION + 50);
    }

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    function start() { stop(); timer = setInterval(next, INTERVAL); }
    function stop() { clearInterval(timer); }

    if (nextBtn) nextBtn.addEventListener("click", () => { next(); start(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); start(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { goTo(i); start(); }));

    banner.addEventListener("mouseenter", stop);
    banner.addEventListener("mouseleave", start);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

    start();
    return; // banner handled, skip legacy hero
  }

  /* ---------- Legacy fade hero (unchanged behaviour) ---------- */
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".dot")];
  const number = document.getElementById("slideNumber");
  if (!slides.length) return;

  let current = 0;
  let timer;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    if (number) number.textContent = String(current + 1).padStart(2, "0");
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), INTERVAL);
  }

  dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); start(); }));
  showSlide(0);
  start();
});