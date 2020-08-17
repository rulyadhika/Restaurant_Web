function getData() {
  return fetch("json/outlet.json")
    .then((result) => {
      if (!result.ok) {
        throw new Error("Something went wrong");
      } else {
        return result.json();
      }
    })
    .then((result) => result);
}

window.addEventListener("load", async function () {
  try {
    const data = await getData();
    const sortedData = data.sort((a, b) => a.kota.localeCompare(b.kota));
    displayData(sortedData);
  } catch (err) {
    console.error(err);
  }
});

function displayData(data) {
  const tableBody = document.querySelector(".table-body");
  let count = 1;
  const allData = data
    .map(
      (data) => `<tr>
    <th scope="row" class="number">${count++}</th>
    <td class="kota">${data.kota}</td>
    <td class="alamat">
      ${data.alamat} <br />
      <span>(No.Telp : ${data.telp})</span>
    </td>
  </tr>`
    )
    .join("");
  tableBody.innerHTML = allData;
}

window.addEventListener("scroll", function () {
  const navbarCustom = document.querySelector(".navbar-custom");
  if (window.pageYOffset == 0) {
    navbarCustom.classList.remove("navbar-toggle");
  } else if (window.pageYOffset > 60) {
    navbarCustom.classList.add("navbar-toggle");
  }
});

function typeWriter() {
  const text = "RadhikaCuisine - Outlet";
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
