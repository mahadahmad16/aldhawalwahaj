document.addEventListener("DOMContentLoaded",()=>{
  const toggle=document.querySelector(".menu-toggle");
  const nav=document.querySelector(".nav");
  if(toggle&&nav){
    toggle.addEventListener("click",()=>nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>nav.classList.remove("open")));
  }
});


const mobileMenuButton =
  document.getElementById("mobileMenuButton");

const mobileNav =
  document.getElementById("mobileNav");


if (
  mobileMenuButton &&
  mobileNav
) {

  mobileMenuButton.addEventListener(
    "click",
    () => {

      mobileNav.classList.toggle("show");

    }
  );

}