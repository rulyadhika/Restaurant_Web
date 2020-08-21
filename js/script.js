window.addEventListener("scroll", function () {
  let navbarCustom = document.querySelector(".navbar-custom");
  if (window.pageYOffset == 0) {
    navbarCustom.classList.remove("navbar-toggle");
  } else if (window.pageYOffset > 60) {
    navbarCustom.classList.add("navbar-toggle");
  }
});

function typeWriter() {
  const text = [
    "All happiness depends on a leisurely breakfast.",
    "You don't need a silver fork to eat good food.",
    "Cooking is like love. It should be entered into with abandon or not at all.",
    "To eat is a necessity, but to eat intelligently is an art.",
    "When you eat food with your family and friends, it always tastes better!",
    "You know what’s better than blabbering about food? Yup, eating!",
    "In order to achieve a balanced diet, one must hold a cookie in each hand.",
    "Most people eat to live. On the contrary, I live to eat.",
    "Eating spaghetti requires so much attention. That’s why you can never feel lonely while eating it.",
    "Food is the ultimate pacifier. I feel like I can forgive anyone after a scrumptious meal.",
    "Whenever you see me seemingly thinking deep thoughts, I’m probably just thinking about food.",
    "Never break a promise! On the other hand, you can break as many pie crust as you want.",
    "Eat whatever you want, and if someone tries to lecture you about your weight, eat them too!",
  ];
  let i = 0;
  let j = 0;
  const captionForCarousel = document.querySelector(".caption-for-carousel");
  setInterval(() => {
    if (i < text[j].length) {
      captionForCarousel.innerHTML += text[j][i];
      i++;
      if (i == text[j].length) {
        setTimeout(() => {
          captionForCarousel.innerHTML = "";
          i = 0;
          j++;
          if (j >= text.length) {
            j = 0;
          }
        }, 5000);
      }
    }
  }, 100);
}

typeWriter();

// fade in effect for each section
window.addEventListener("scroll", function () {
  let windowBottom = this.pageYOffset + this.innerHeight;
  let elements = document.querySelectorAll(".row");
  elements.forEach(function (el) {
    let objectBottom = el.offsetTop + 50;
    if (objectBottom < windowBottom) {
      el.classList.add("fadeIn");
    } else if (objectBottom - 50 > windowBottom) {
      el.classList.remove("fadeIn");
    }
  });
});
