const sortBtn = document.querySelector(".shop__sort-btn");
const productsSort = document.querySelector(".shop__products-sort");
const productsDOM = document.querySelector(".shop__products-body");
let filterBtn = document.querySelector(".shop__filter-priceBtn")
let slider1 = document.querySelector(".shop__filter-slider1")
let slider2 = document.querySelector(".shop__filter-slider2")
let sliderStart = document.querySelector(".shop__filter-range-start")
let sliderEnd = document.querySelector(".shop__filter-range-end")
let minGap = 100;

sortBtn.addEventListener("click", () => {
  productsSort.classList.toggle("active");
})

// Cart 
let cart = [];
// Buttons
let buttonsDOM = [];
// Product ID
let productID = [];
// Color
let colorID = ["White"];
// Size
let sizeID = ["XS"];

// Getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;

      products = products.map(item => {
        const {
          title,
          description,
          model,
          price,
          category,
          brand
        } = item.fields;
        const {
          id
        } = item.sys;
        const image = item.fields.image.fields.file.url;
        return {
          title,
          description,
          model,
          price,
          category,
          brand,
          id,
          image
        };
      })
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// Display products
class UI {
  displayProducts(products) {

    // Product filter
    const checkboxes = document.querySelectorAll(".shop__filter input[type='checkbox']");
    let checkEd = [];
    let productsArray = products;

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        productsArray = products;
        for (let i = 0; i < checkboxes.length; i++) {
          checkboxes[i].checked = false;
        }
        checkbox.checked = true;

        checkEd =
          Array.from(checkboxes)
          .filter(i => i.checked)
          .map(i => i.id)
          .toString()

        productsArray.forEach(product => {

          let category = product.category;
          let brand = product.brand;

          if (checkEd == category) {
            productsArray = productsArray.filter(product => product.category === checkEd)
          } else if (checkEd == brand) {
            productsArray = productsArray.filter(product => product.brand === checkEd)
          } else if (checkEd == "all") {
            productsArray = productsArray.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
          }
        })

        importProducts(productsArray)
        addShopEvents()
        filterRange(productsArray)
        sortBy(productsArray)
      })
    })

    importProducts(productsArray)
    addShopEvents()
    filterRange(productsArray)
    filterSlider()
    sortBy(productsArray)
  } //kraj funkcije


  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    })
    cartTotal.innerText = `$${parseFloat(tempTotal.toFixed(2))}`;
    cartItems.innerText = `(${itemsTotal})`;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("navigation__cart-view-basket");
    div.innerHTML = `
        
        <img class="navigation__cart-view-img" src=${item.image} alt="">
        <div class="navigation__cart-view-info">
        <div onclick="productSpecs('${item.id}')" class="navigation__cart-view-product" data-id=${item.id}>${item.title}</div>
          <div class="navigation__quantityItems">
            <span class="navigation__cart-view-quantity">${item.amount} x</span>   
          </div>
          <div class="navigation__cart-view-price">$${item.price}</div>
          <span class="navigation__cart-view-remove"><i class="fas fa-times" data-id=${item.id}></i></span>
          </div>
        
        `
    cartProducts.append(div);
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    checkCart()
  }

  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }

  cartLogic() {

    cartView.addEventListener("click", (event) => {

      if (event.target.classList.contains("fa-times")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartProducts.removeChild(removeItem.parentElement.parentElement.parentElement);
        this.removeItem(id);
        
      }
    })
  }

  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    checkCart()
    let button = this.getSingleButton(id);
    button.style.pointerEvents = "auto";
    button.innerHTML = `
                              <div class="main__btn" data-id=${id}>
                                  <span class="main__btn-text" data-id=${id}>Add to Cart</span>
                                  <i class="fas fa-shopping-bag" data-id=${id}></i>
                              </div>`
  }

  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }

  // productID() {

  //   let productBtn = document.querySelectorAll(".main__singleProduct");

  //   productBtn.forEach((button) => {
  //     button.addEventListener("click", () => {
  //       let id = button.dataset.id;
  //       // Get product from products
  //       let buttons = {
  //         ...Storage.getProduct(id),
  //         amount: 1,
  //         color: colorID,
  //         size: sizeID
  //       };
  //       // Add product to the list
  //       productID = [...productID, buttons];
  //       // Save product in local storage
  //       Storage.saveProduct(productID);
  //     })
  //   })
  // }
}

// Local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProducts() {
    return localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  }
  static saveProduct(product) {
    localStorage.setItem("product", JSON.stringify(product));
  }
  static getProductSpec() {
    return localStorage.getItem("product") ? JSON.parse(localStorage.getItem("product")) : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // Setup APP
  ui.setupAPP();
  ui.cartLogic();

  // Get all products
  products.getProducts().then((products) => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(() => {
    // ui.productID();
  });
})

function importProducts(products) {
  let result = "";
  products.forEach(product => {

    result += `
        <div class="main__product" data-filter=${product.category} data-brand=${product.brand}>
                  <a role="button" onclick="productSpec('${product.id}')" class="main__singleProduct" data-id=${product.id}>
                    <div class="main__img">
                        <img class="main__img-photo" src=${product.image} alt="Product photo">
                    </div>
                    <div class="main__info">
                        <div class="main__detail">
                            <h3 class="main__heading">${product.title}</h3>
                            <p class="main__subheading">${product.description}</p>
                        </div>
                        <div class="main__price">$${product.price}</div>
                    </div>
                  </a>
                    <a role="button" class="main__cartBtn" data-id=${product.id}>
                        <div class="main__btn" data-id=${product.id}> 
                            <span class="main__btn-text" data-id=${product.id}>Add to Cart</span>
                            <i class="fas fa-shopping-bag" data-id=${product.id}></i>
                        </div>
                    </a>
        </div>
        `
  });

  productsDOM.innerHTML = result;
}

function getProduct(id) {
  let products = JSON.parse(localStorage.getItem("products"));
  return products.find(product => product.id === id);
}

function addShopEvents() {
  const buttons = [...document.querySelectorAll(".main__cartBtn")];
  buttonsDOM = buttons;
  buttons.forEach((button) => {
    let id = button.dataset.id;
    let inCart = cart.find(item => item.id === id);

    if (inCart) {
      button.innerHTML = "In Cart";
      button.style.pointerEvents = "none";
    }

    button.addEventListener("click", getBagButtons)
  })
}


function getBagButtons(e) {

  const ui = new UI();
  const button = e.target;
  const id = e.target.dataset.id;
  let prodID = getProduct(id);

  const addToCart = document.querySelectorAll(".main__cartBtn")

  addToCart.forEach((btn) => {
    if (btn.dataset.id == id) {
      btn.innerHTML = "In Cart";
      btn.style.pointerEvents = "none";
    }
  })

  // Get product from products
  let cartItem = {
    ...prodID,
    amount: 1,
    color: colorID,
    size: sizeID
  };

  // Add product to the cart
  cart = [...cart, cartItem];
  // Save product in local storage
  localStorage.setItem("cart", JSON.stringify(cart));
  // Set cart values
  ui.setCartValues(cart);
  // Display cart item
  ui.addCartItem(cartItem);
  checkCart()
}

function filterSlider() {

  slider1.oninput = function () {
    if (parseInt(slider2.value) - parseInt(slider1.value) <= minGap) {
      slider1.value = parseInt(slider2.value) - minGap;
    }
    sliderStart.innerText = `$${slider1.value}`;
  }
  slider2.oninput = function () {
    if (parseInt(slider2.value) - parseInt(slider1.value) <= minGap) {
      slider2.value = parseInt(slider1.value) + minGap;

    }
    sliderEnd.innerText = `$${slider2.value}`;
  }
}

function filterRange(products) {

  filterBtn.addEventListener("click", () => {
    productsArray = products;
    let slider1Val = +(slider1.value);
    let slider2Val = +(slider2.value);

    productsArray.forEach(() => {
      productsArray = productsArray.filter(function (product) {
        return product.price >= slider1Val && product.price <= slider2Val
      })
    })

    importProducts(productsArray)
    addShopEvents()
    sortBy(productsArray)
  })
}

function sortBy(productsArray) {
  const checkboxes2 = document.querySelectorAll(".shop__products-sort-options input[type='checkbox']");
  checkboxes2.forEach(checkbox => {
    checkbox.addEventListener("change", () => {

      for (let i = 0; i < checkboxes2.length; i++) {
        checkboxes2[i].checked = false;
      }
      checkbox.checked = true;

      checkEd =
        Array.from(checkboxes2)
        .filter(i => i.checked)
        .map(i => i.id)
        .toString()

      productsArray.forEach(() => {

        if (checkEd == "default") {
          productsArray = productsArray.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
        } else if (checkEd == "popularity") {
          productsArray = productsArray.sort((a, b) => a.title.length - b.title.length);
        } else if (checkEd == "rating") {
          productsArray = productsArray.sort((a, b) => a.brand.length - b.brand.length);
        } else if (checkEd == "newness") {
          productsArray = productsArray.sort((a, b) => a.description.length - b.description.length);
        } else if (checkEd == "lowprice") {
          productsArray = productsArray.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (checkEd == "highprice") {
          productsArray = productsArray.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
      })
      importProducts(productsArray)
      addShopEvents()

      setTimeout(() => {
        for (let i = 0; i < checkboxes2.length; i++) {
          checkboxes2[i].checked = false;
        }
      }, 3000)
    })
  })
}

function productSpecs(id) {

  const product = Storage.getProduct(id);
  const exist = cart.findIndex(element => element.id === id);
  let singleProduct = [cart[exist]];

  // Save product in local storage
  Storage.saveProduct(singleProduct);
  window.location.href = "product.html";
}

function productSpec(id) {

  let singleProduct = {
    ...Storage.getProduct(id),
    amount: 1,
    color: colorID,
    size: sizeID
  };
  // Add product to the list
  productID = [...productID, singleProduct];
  // Save product in local storage
  Storage.saveProduct(productID);
  window.location.href = "product.html";
}

function checkCart() {

  let cart = Storage.getCart();

  if (cart.length == 0) {
    fullCart.classList.remove("active");
  } else {
    fullCart.classList.add("active");
  }
}