function reqData() {
  return fetch("json/menu.json")
    .then((result) => {
      if (!result.ok) {
        throw new Error("failed to load data");
      }
      return result.json();
    })
    .then((result) => result);
}

window.addEventListener("load", async function () {
  try {
    const data = await reqData();
    filterData(data);
  } catch (err) {
    console.error(err);
  }
});

function filterData(data) {
  const makananPembukaBox = document.querySelector(".makanan-pembuka-box");
  const makananUtamaBox = document.querySelector(".makanan-utama-box");
  const makananPenutupBox = document.querySelector(".makanan-penutup-box");
  data.forEach((data) => {
    if (data.kategori == "makanan-pembuka") {
      makananPembukaBox.innerHTML += displayData(data);
    } else if (data.kategori == "makanan-utama") {
      makananUtamaBox.innerHTML += displayData(data);
    } else if (data.kategori == "makanan-penutup") {
      makananPenutupBox.innerHTML += displayData(data);
    }
  });
}

function displayData(data) {
  return ` <div class="col-md-4 pl-2 pr-2">
                <div class="card my-2 menu-card-box">
                  <img src="${data.gambar}" class="card-img-top" alt="...">
                    <div class="card-body menu-card-info">
                        <h5 class="card-title">${data.nama}</h5>
                        <ul>
                            <li><span class="priceTitle">Harga : </span>Rp. ${
                              data.harga
                            }</li>
                            <li class="descForMoreThan768px">${
                              data.deskripsi.length > 120
                                ? `${data.deskripsi.substring(0, 117) + "..."}`
                                : `${data.deskripsi}`
                            }</li>
                            <li class="descForLessThan768px">${
                              data.deskripsi.length > 50
                                ? `${data.deskripsi.substring(0, 47) + "..."}`
                                : `${data.deskripsi}`
                            }</li>
                        </ul>
                        <div class="card-button-wrap">
                          <button type="button" class="btn btn-outline-dark btn-sm more-detail-btn " data-id="${
                            data.id
                          }" data-toggle="modal" data-target="#foodDetails">More Detail</button>
                          <button class="btn btn-warning btn-sm text-white add-to-cart-btn" data-id="${
                            data.id
                          }">Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>`;
}

document.addEventListener("click", async function (el) {
  const target = el.target;
  const getFoodData = await reqData();
  const foodId = target.dataset.id;
  if (target.classList.contains("menu-card-box")) {
    const moreDetailBtnLoc = target.children[1].children[2].children[0];
    moreDetailBtnLoc.click();
  } else if (target.classList.contains("more-detail-btn")) {
    showFoodDetail(target, getFoodData, foodId);
  } else if (target.classList.contains("add-to-cart-btn")) {
    const makananPembukaCartBox = document.querySelector(
      ".makanan-pembuka-cart-box"
    );
    const makananUtamaCartBox = document.querySelector(
      ".makanan-utama-cart-box"
    );
    const makananPenutupCartBox = document.querySelector(
      ".makanan-penutup-cart-box"
    );
    const foodId = target.dataset.id;
    if (foodId.includes("aptz")) {
      cekData(foodId, makananPembukaCartBox);
    } else if (foodId.includes("mm")) {
      cekData(foodId, makananUtamaCartBox);
    } else if (foodId.includes("dsrt")) {
      cekData(foodId, makananPenutupCartBox);
    }
  } else if (target.classList.contains("minBtn")) {
    foodCounter(target, foodId, "min");
  } else if (target.classList.contains("plusBtn")) {
    foodCounter(target, foodId, "plus");
  } else if (target.classList.contains("delete-btn")) {
    deleteItem(target.parentElement);
  }
});

function showFoodDetail(loc, data, id) {
  const foodDetailData = data
    .filter((data) => data.id == id)
    .map(
      (data) => `<div class="container">
                  <div class="row">
                    <div class="col-md-4">
                      <img src="${data.gambar}" alt="" class="img-fluid">
                    </div>
                    <div class="col-md-8">
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item"><span class="customTitle">${data.nama}</span></li>
                          <li class="list-group-item"><span class="customTitle">Harga : </span>Rp. ${data.harga}</li>
                          <li class="list-group-item"><span class="customTitle">Deskripsi Makanan : </span> <br/> ${data.deskripsi}</li>
                        </ul>
                    </div>
                  </div>
                </div>
    `
    )
    .join("");
  const foodDetailModalBody = document.querySelector(".food-detail-modal-body");
  const modalAddToCartBtn = document.querySelector(".modal-add-to-cart-btn");
  foodDetailModalBody.innerHTML = foodDetailData;
  modalAddToCartBtn.dataset.id = id;
  disabledEnabledAddToCartBtn("toBeDisabledForModalBox", id, loc);
}

async function addToCart(id, loc) {
  const getFoodData = await reqData();
  const filteredData = getFoodData.filter((data) => data.id == id);
  const tempalteFilteredData = filteredData.map(
    (data) =>
      `<div class="card menu-card-at-cart-box ml-1 mr-1 mb-1 fadeInAnimation shadow-sm" data-id="${
        data.id
      }">
        <img src="${data.gambar}" alt="...">
        <div class="card-body menu-card-info-for-cart">
          <ul>
            <li><span class="customTitle">${data.nama}</span> (1 paket)</li>
            <li>Harga : Rp. ${data.harga}</li>
          </ul>
          <ul>
            <li>Total : Rp. ${data.harga}</li>
          </ul>
          <ul>
            <div class="btn-group counter-cntrl-btn border rounded">
              <button class="minBtn btn" data-id="${data.id}">-</button>
              <button class="counterArea btn counter-box btn-sm">${1}</button>
              <button class="plusBtn btn" data-id="${data.id}">+</button>
            </div>
          </ul>
       </div>
        <div class="delete-btn">
          <i class="fa fa-times" aria-hidden="true"></i>
        </div>
      </div>`
  );
  addToStorage(filteredData);
  loc.innerHTML += tempalteFilteredData;
  let menuCardAtCartBox = document.querySelectorAll(".menu-card-at-cart-box");
  menuCardAtCartBox.forEach((card) => {
    card.addEventListener("animationend", function () {
      card.classList.remove("fadeInAnimation");
    });
  });
  disabledEnabledAddToCartBtn("toBeDisabled", id);
}

let dataCollectorId = [];
let dataCollector = [];
function cekData(id, loc) {
  let dataCollectorIdInString = dataCollectorId.join(" - ");
  let status;
  if (dataCollector.length > 0) {
    if (dataCollectorIdInString.includes(id)) {
      status = false;
    } else if (!dataCollectorIdInString.includes(id)) {
      status = true;
    }
  } else {
    status = true;
  }

  if (status == true) {
    addToCart(id, loc);
  }
}

function addToStorage(data) {
  data.map((data) => {
    let collector = {
      id: data.id,
      harga: data.harga,
      jumlah: 1,
      totalHarga: data.harga,
    };
    dataCollector.push(collector);
  });
  let tempCollectorId = data.map((data) => data.id);
  dataCollectorId.push(tempCollectorId);
  totalPriceAllMenu();
}

function foodCounter(loc, id, event) {
  let counterDisplay = loc.parentElement.childNodes[3].childNodes[0];
  let totalPriceDisplay =
    loc.parentElement.parentElement.parentElement.childNodes[3].childNodes[1]
      .childNodes[0];
  let unitDisplay =
    loc.parentElement.parentElement.parentElement.childNodes[1].childNodes[1]
      .childNodes[1];
  if (event === "min") {
    for (let i of dataCollector) {
      if (i.id === id) {
        let jumlah = i.jumlah;
        jumlah--;
        if (jumlah >= 1) {
          i.jumlah = jumlah;
          i.totalHarga = i.harga * i.jumlah;
          counterDisplay.nodeValue = i.jumlah;
          totalPriceDisplay.nodeValue = `Total : Rp. ${i.totalHarga}`;
          unitDisplay.nodeValue = ` (${i.jumlah} paket)`;
        } else {
          i.jumlah = 1;
          counterDisplay.nodeValue = 1;
          totalPriceDisplay.nodeValue = `Total : Rp. ${i.totalHarga}`;
          unitDisplay.nodeValue = ` (${i.jumlah} paket)`;
        }
      }
    }
  } else {
    for (let i of dataCollector) {
      if (i.id === id) {
        let jumlah = i.jumlah;
        jumlah++;
        i.jumlah = jumlah;
        i.totalHarga = i.harga * i.jumlah;
        counterDisplay.nodeValue = jumlah;
        totalPriceDisplay.nodeValue = `Total : Rp. ${i.totalHarga}`;
        unitDisplay.nodeValue = ` (${i.jumlah} paket)`;
      }
    }
  }
  totalPriceAllMenu();
}

function deleteItem(loc) {
  let cardId = loc.dataset.id;
  for (let i in dataCollectorId) {
    if (dataCollectorId[i] == cardId) {
      dataCollectorId[i] = undefined;
    }
  }
  for (let i in dataCollector) {
    if (dataCollector[i].id == cardId) {
      for (let j in dataCollector[i]) {
        dataCollector[i][j] = null;
      }
    }
  }
  loc.classList.add("fadeOutAnimation");
  loc.addEventListener("animationend", function () {
    loc.remove();
    disabledEnabledAddToCartBtn("toBeEnabled", cardId);
  });
  totalPriceAllMenu();
}

function totalPriceAllMenu() {
  let totalPrice = 0;
  dataCollector.forEach((p) => (totalPrice += p.totalHarga));
  let totalPriceAllMenuBox = document.querySelector(
    ".total-price-all-menu-box"
  );
  totalPriceAllMenuBox.innerHTML = `Total Harga Makanan : Rp. ${totalPrice}`;
}

function disabledEnabledAddToCartBtn(condition, id, loc) {
  let selectedBtn = document.querySelectorAll(".add-to-cart-btn");
  selectedBtn.forEach((btn) => {
    if (btn.dataset.id == id) {
      if (condition === "toBeDisabled") {
        btn.disabled = true;
      } else if (condition === "toBeEnabled") {
        btn.disabled = false;
      } else {
        if (loc.nextElementSibling.disabled == false) {
          btn.disabled = false;
        } else {
          btn.disabled = true;
        }
      }
    }
  });
}
