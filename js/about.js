window.addEventListener("scroll", function () {
  const navbarCustom = document.querySelector(".navbar-custom");
  if (window.pageYOffset == 0) {
    navbarCustom.classList.remove("navbar-toggle");
  } else if (window.pageYOffset > 60) {
    navbarCustom.classList.add("navbar-toggle");
  }
});

function typeWriter() {
  const text = "RadhikaCuisine - About Us";
  let i = 0;
  const captionForCarousel = document.querySelector(".caption-for-carousel");
  captionForCarousel.innerHTML = "";
  setInterval(() => {
    if (i < text.length) {
      captionForCarousel.innerHTML += text[i];
      i++;
      if (i == text.length) {
        setTimeout(() => {
          captionForCarousel.innerHTML = "";
          i = 0;
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
    let objectBottom = el.offsetTop;
    if (objectBottom < windowBottom) {
      el.classList.add("fadeIn");
    } else if (objectBottom > windowBottom) {
      el.classList.remove("fadeIn");
    }
  });
});

window.addEventListener("load", function () {
  setTimeout(() => {
    window.scrollTo({
      top: document.querySelector(".content-container").offsetTop - 50,
      behavior: "smooth",
    });
  }, 1000);
});
