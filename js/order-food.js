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
    showFoodDetail(getFoodData, foodId);
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
  }
});

function showFoodDetail(data, id) {
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
}

async function addToCart(id, loc) {
  const getFoodData = await reqData();
  const filteredData = getFoodData.filter((data) => data.id == id);
  const tempalteFilteredData = filteredData.map(
    (data) =>
      `<div class="card menu-card-at-cart-box ml-1 mr-1 mb-1" data-id="${data.id}">
        <img src="${data.gambar}" alt="...">
        <div class="card-body menu-card-info-for-cart">
          <ul>
            <li><span class="customTitle">${data.nama}</span> (2 pcs)</li>
            <li>Harga : Rp. ${data.harga}</li>
          </ul>
          <ul>
            <li>Total : Rp. 100000</li>
          </ul>
          <ul>
            <div class="btn-group counter-cntrl-btn ">
              <button class="minBtn btn bg-light text-dark btn-sm">-</button>
              <button class="counterArea btn bg-light text-darkcounter-box btn-sm">1</button>
              <button class="plusBtn btn bg-light text-darkbtn-sm">+</button>
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
}

let dataAccumulatorId = [];
let dataAccumulator = [];
function cekData(id, loc) {
  let dataAccumulatorIdInString = dataAccumulatorId.join(" - ");
  let status;
  if (dataAccumulator.length > 0) {
    if (dataAccumulatorIdInString.includes(id)) {
      status = false;
    } else if (!dataAccumulatorIdInString.includes(id)) {
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
  data.forEach((data) => dataAccumulator.push(data));
  let tempAccumulatorId = data.map((data) => data.id);
  dataAccumulatorId.push(tempAccumulatorId);
}
