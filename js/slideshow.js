document.addEventListener("DOMContentLoaded",()=>{
  const slides=[...document.querySelectorAll(".hero-slide")];
  const dots=[...document.querySelectorAll(".dot")];
  const number=document.getElementById("slideNumber");
  let current=0;
  let timer;

  function showSlide(index){
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle("active",i===current));
    dots.forEach((dot,i)=>dot.classList.toggle("active",i===current));
    if(number) number.textContent=String(current+1).padStart(2,"0");
  }

  function start(){
    clearInterval(timer);
    timer=setInterval(()=>showSlide(current+1),5500);
  }

  dots.forEach((dot,i)=>dot.addEventListener("click",()=>{showSlide(i);start()}));
  showSlide(0);
  start();
});
