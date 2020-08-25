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

function reqDataCabang() {
  return fetch("json/outlet.json")
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
    //data for food menu
    const data = await reqData();
    //sort fetched data by name ascending
    const sortFoodData = data.sort((a, b) => a.nama.localeCompare(b.nama));
    filterData(sortFoodData);

    //data for outlet info
    const dataCabang = await reqDataCabang();
    proceedDataCabang(dataCabang);
  } catch (err) {
    console.error(err);
  }
  typeWriter();

  //scroll animation
  setTimeout(() => {
    window.scrollTo({
      top: document.querySelector(".content-container").offsetTop - 50,
      behavior: "smooth",
    });
  }, 1000);
});

window.addEventListener("scroll", function () {
  let navbarCustom = document.querySelector(".navbar-custom");
  if (window.pageYOffset == 0) {
    navbarCustom.classList.remove("navbar-toggle");
  } else if (window.pageYOffset > 60) {
    navbarCustom.classList.add("navbar-toggle");
  }
});

function typeWriter() {
  const text = "RadhikaCuisine - Order Food";
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
                        <h5 class="card-title">${
                          data.nama.length > 17
                            ? `${data.nama.substring(0, 17) + "..."}`
                            : `${data.nama}`
                        }</h5>
                        <ul>
                            <li><span class="priceTitle">Harga : </span>Rp. ${
                              data.harga
                            }/paket</li>
                            <li class="descForMoreThan768px">${
                              data.deskripsi.length > 100
                                ? `${data.deskripsi.substring(0, 97) + "..."}`
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

function proceedDataCabang(data) {
  const sortDataCabang = data.sort((a, b) => a.kota.localeCompare(b.kota));
  const inputCabang = document.querySelector("select[name=inputCabang]");
  const dataCabangTemplate = sortDataCabang
    .map(
      (data) => `
  <option value="${data.kota}">${data.kota}</option>
`
    )
    .join("");
  inputCabang.innerHTML += dataCabangTemplate;
}

//event binding
document.addEventListener("click", async function (el) {
  const target = el.target;
  const getFoodData = await reqData();
  const foodId = target.dataset.id;
  //displaying more detail modal box for mobile devices
  if (target.classList.contains("menu-card-box")) {
    const moreDetailBtnLoc = target.children[1].children[2].children[0];
    moreDetailBtnLoc.click();
  }
  //displaying more detail modal box
  else if (target.classList.contains("more-detail-btn")) {
    showFoodDetail(target, getFoodData, foodId);
  } else if (target.classList.contains("add-to-cart-btn")) {
    alertPopUp("success", foodId, getFoodData);
    const makananPembukaCartBox = document.querySelector(
      ".makanan-pembuka-cart-box"
    );
    const makananUtamaCartBox = document.querySelector(
      ".makanan-utama-cart-box"
    );
    const makananPenutupCartBox = document.querySelector(
      ".makanan-penutup-cart-box"
    );
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
    alertPopUp("delete", target.parentElement.dataset.id, getFoodData);
  } else if (target.classList.contains("save-customer-data-btn")) {
    addCustomerData();
  } else if (target.id === "agreementCheckBox") {
    const saveCustomerDataBtn = document.querySelector(
      ".save-customer-data-btn"
    );
    if (target.checked === true) {
      saveCustomerDataBtn.disabled = false;
    } else {
      saveCustomerDataBtn.disabled = true;
    }
  } else if (target.classList.contains("checkout-ready")) {
    proceedCheckout(target);
  }
  //reloading the page after checkout completed
  else if (target.classList.contains("versitile-modal-close-btn")) {
    setTimeout(() => {
      window.location.reload(false);
    }, 1500);
  }
});

function showFoodDetail(loc, data, id) {
  const foodDetailData = data
    .filter((data) => data.id == id)
    .map(
      (data) => `<div class="container">
                  <div class="row">
                    <div class="col-lg-4">
                      <img src="${data.gambar}" alt="" class="img-fluid">
                      <p class="picture-info">Picture By (<a href="https://www.masakapaya.com/">https://www.masakapaya.com/</a>)</p>
                    </div>
                    <div class="col-lg-8">
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item"><span class="customTitle">${data.nama}</span></li>
                          <li class="list-group-item"><span class="customTitle">Harga : </span>Rp. ${data.harga}</li>
                          <li class="list-group-item"><span class="customTitle">Jumlah : </span>${data.pcs} pcs/paket</li>
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
            <li><span class="customTitle">${
              data.nama.length > 17
                ? `${data.nama.substring(0, 15) + "..."}`
                : `${data.nama}`
            }</span> (1 paket)</li>
            <li>Harga : Rp. ${data.harga}</li>
          </ul>
          <ul>
            <li>Total : Rp. ${data.harga}</li>
          </ul>
          <ul>
            <div class="btn-group counter-cntrl-btn border rounded">
              <button class="minBtn btn btn-sm" data-id="${data.id}">-</button>
              <button class="counterArea btn counter-box btn-sm">${1}</button>
              <button class="plusBtn btn btn-sm" data-id="${data.id}">+</button>
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
      dataCollectorId.splice(i, 1);
    }
  }
  for (let i in dataCollector) {
    if (dataCollector[i].id == cardId) {
      dataCollector.splice(i, 1);
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
  totalPriceAllMenuBox.innerHTML = `Total Harga Makanan : Rp. ${
    totalPrice > 0
      ? `${totalPrice} ${
          totalPrice <= 30000 ? `(Gratis ongkir min Rp. 30000)` : ``
        }`
      : `-`
  }`;
  let totalBillBox = document.querySelector(".total-bill");
  totalBillBox.innerHTML = `Total Biaya : Rp. ${
    totalPrice > 0
      ? `${
          totalPrice >= 30000
            ? `${totalPrice}`
            : `${totalPrice + 5000} (Termasuk Ongkir)`
        }`
      : `-`
  }`;
  let customerDataBox = document.querySelector(".customerData");
  //ongkir list item on customerDataBox
  customerDataBox.children[6].innerHTML = `Biaya Ongkir : ${
    totalPrice > 0 ? `${totalPrice >= 30000 ? `Gratis` : `Rp. 5000`}` : `-`
  }`;
}

// disabling checkout button
let checkoutBtn = document.querySelector(".checkout-btn");
checkoutBtn.disabled = true;

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

  // disabling/enabling checkout button
  let checkoutBtn = document.querySelector(".checkout-btn");
  if (dataCollector.length == 0) {
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
  }
}

function alertPopUp(condition, id, foodData) {
  let popUpAlertTemplate = `
  <div class="alert popUpAlert" role="alert">
  ${
    condition == "Data Telah Berhasil Di Simpan"
      ? `${condition}`
      : `${foodData.filter((data) => data.id == id).map((data) => data.nama)} ${
          condition == "success" ? `Ditambahkan Ke` : `Dihapus Dari`
        } Keranjang`
  }
  </div>`;
  let popUpArea = document.querySelector(".popUpArea");
  popUpArea.innerHTML = popUpAlertTemplate;
  let popUpAlert = document.querySelectorAll(".popUpAlert");
  popUpAlert.forEach((e) => {
    e.addEventListener("animationend", function () {
      e.remove();
    });
  });
}

function addCustomerData() {
  let customerDataBox = document.querySelector(".customerData");
  let customerFormBox = document.querySelector(".customerForm");
  const inputNama = customerFormBox.querySelector("input[name='inputNama']");
  const inputEmail = customerFormBox.querySelector("input[name='inputEmail']");
  const inputNomerHp = customerFormBox.querySelector(
    "input[name='inputNomerHp']"
  );
  const textAreaAlamat = customerFormBox.querySelector(
    "textarea[name='inputAlamat']"
  );
  const selectCabang = customerFormBox.querySelector(
    "select[name='inputCabang']"
  );
  customerDataBox.children[1].innerHTML = `Nama : ${inputNama.value}`;
  customerDataBox.children[2].innerHTML = `Email : ${inputEmail.value}`;
  customerDataBox.children[3].innerHTML = `Nomor Hp : ${inputNomerHp.value}`;
  customerDataBox.children[4].innerHTML = `Alamat Tujuan : ${textAreaAlamat.value}`;
  customerDataBox.children[5].innerHTML = `Lokasi Cabang : ${
    selectCabang.options[selectCabang.selectedIndex].value
  }`;
  let checkoutBtn = document.querySelector(".checkout-btn");
  checkoutBtn.removeAttribute("data-toggle");
  checkoutBtn.removeAttribute("data-target");
  checkoutBtn.classList.add("checkout-ready");
  alertPopUp("Data Telah Berhasil Di Simpan");
}

// disabling saveCustomerDataBtn
const saveCustomerDataBtn = document.querySelector(".save-customer-data-btn");
saveCustomerDataBtn.disabled = true;

function proceedCheckout(target) {
  target.disabled = true;
  target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Tunggu Sebentar...`;
  setTimeout(() => {
    target.classList.replace("btn-warning", "btn-success");
    target.innerHTML = `Berhasil <i class="fa fa-check" aria-hidden="true"></i>`;
    setTimeout(function () {
      let versitileModalLabel = document.querySelector("#versitileModalLabel");
      let versitileModalBody = document.querySelector(".versitileModalBody");
      let versitileModalSaveBtn = document.querySelector(
        ".versitile-modal-save-btn"
      );
      let timesBtnVersitileModal = document.querySelector(
        ".times-btn-versitile-modal"
      );
      timesBtnVersitileModal.style.display = "none";
      versitileModalSaveBtn.style.display = "none";
      versitileModalSaveBtn.previousElementSibling.classList.remove(
        "modal-close-btn"
      );
      versitileModalSaveBtn.previousElementSibling.classList.add(
        "versitile-modal-close-btn"
      );
      versitileModalBody.classList.add("completeBox");
      versitileModalLabel.innerHTML = "Transaksi Berhasil";
      versitileModalBody.innerHTML = `<span>Terimakasih Atas Pesanan Yang Telah Anda Buat :)</span>
      <i class="far fa-check-circle"></i>`;
      $("#versitileModal").modal();
    }, 1500);
  }, 3000);
}
