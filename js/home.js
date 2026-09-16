const slides =
  document.querySelectorAll(".home-hero-slide");

const dots =
  document.querySelectorAll(".hero-dot");

const previousButton =
  document.getElementById("heroPrev");

const nextButton =
  document.getElementById("heroNext");

let currentSlide = 0;
let slideInterval;


function showSlide(index) {

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle(
      "active",
      slideIndex === index
    );
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle(
      "active",
      dotIndex === index
    );
  });

  currentSlide = index;
}


function nextSlide() {

  const next =
    (currentSlide + 1) % slides.length;

  showSlide(next);
}


function previousSlide() {

  const previous =
    (currentSlide - 1 + slides.length) %
    slides.length;

  showSlide(previous);
}


function startSlider() {

  clearInterval(slideInterval);

  slideInterval =
    setInterval(nextSlide, 5000);
}


nextButton.addEventListener(
  "click",
  () => {
    nextSlide();
    startSlider();
  }
);


previousButton.addEventListener(
  "click",
  () => {
    previousSlide();
    startSlider();
  }
);


dots.forEach((dot) => {

  dot.addEventListener(
    "click",
    () => {

      const index =
        Number(dot.dataset.slide);

      showSlide(index);
      startSlider();

    }
  );

});


showSlide(0);
startSlider();