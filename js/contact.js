window.addEventListener("scroll", function () {
  const navbarCustom = document.querySelector(".navbar-custom");
  if (window.pageYOffset == 0) {
    navbarCustom.classList.remove("navbar-toggle");
  } else if (window.pageYOffset > 60) {
    navbarCustom.classList.add("navbar-toggle");
  }
});

function typeWriter() {
  const text = "RadhikaCuisine - Contact Us";
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
