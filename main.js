const productsDOM = document.querySelector(".main__products");
const productsSliderDOM = document.querySelector(".main__new-products-slider");

// Slider
var swiper = new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 30,
  slidesPerGroup: 1,
  loop: true,
  loopFillGroupWithBlank: true,
  breakpoints: {
    768: {
      slidesPerView: 2,
      slidesPerGroup: 1
    },
    1366: {
      slidesPerView: 4,
      slidesPerGroup: 1
    }
  },
  navigation: {
    nextEl: '.main__nextBtn',
    prevEl: '.main__previousBtn',
  }
});


// Change style for product slider
newProducts.forEach((product) => {

  product.style.cursor = "grab";

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

    products = products.filter(product => {
      return product.id < 9;
    });

    let result = "";
    products.forEach(product => {
      result += `
      <div class="main__product">
                  <a href="product.html" class="main__singleProduct" data-id=${product.id}>
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
                        <div class="main__btn">
                            <span class="main__btn-text">Add to Cart</span>
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                    </a>
        </div>
      `
    });
    productsDOM.innerHTML = result;
  }

  sliderProducts(products) {

    products = products.filter(product => {
      return product.id > 8;
    });

    let slider = "";
    products.forEach((product) => {
      slider += `
      <div class="main__new-product swiper-slide">
                      <a href="product.html" class="main__singleProduct" data-id=${product.id}>
                        <div class="main__img">
                            <img class="main__img-photo" src=${product.image} alt="">
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
                            <div class="main__btn">
                                <span class="main__btn-text">Add to Cart</span>
                                <i class="fas fa-shopping-bag"></i>
                            </div>
                        </a>
        </div>
        `
    });

    productsSliderDOM.innerHTML = slider;
  }

  getBagButtons() {

    const buttons = [...document.querySelectorAll(".main__cartBtn")];
    buttonsDOM = buttons;

    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      if (inCart) {
        button.innerHTML = "In Cart";
        button.style.pointerEvents = "none";
      }
      button.addEventListener("click", () => {
        button.innerHTML = "In Cart";
        button.style.pointerEvents = "none";

        // Get product from products
        let cartItem = {
          ...Storage.getProduct(id),
          amount: 1,
          color: colorID,
          size: sizeID
        };
        // Add product to the cart
        cart = [...cart, cartItem];
        // Save product in local storage
        Storage.saveCart(cart)
        // Set cart values
        this.setCartValues(cart);
        // Display cart item
        this.addCartItem(cartItem);
        // Check if the cart is full
        checkCart()
      });

    })

  }
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
            <span class="navigation__btnMin"><i class="navigation fas fa-minus" data-id=${item.id}></i></span>
            <span class="navigation__cart-view-quantity">${item.amount}</span>
            <span class="navigation__btnPlus"><i class="navigation fas fa-plus" data-id=${item.id}></i></span>
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
        checkCart()

      } else if (event.target.classList.contains("fa-plus")) {

        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        if (tempItem.amount > 50) {
          tempItem.amount = 50;
        }
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.parentElement.previousElementSibling.innerText = tempItem.amount;

      } else if (event.target.classList.contains("fa-minus")) {

        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount < 1) {
          tempItem.amount = 1;
        }
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.parentElement.nextElementSibling.innerText = tempItem.amount;
      }
    })
  }

  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.style.pointerEvents = "auto";
    button.innerHTML = `
                              <div class="main__btn">
                                  <span class="main__btn-text">Add to Cart</span>
                                  <i class="fas fa-shopping-bag"></i>
                              </div>`
  }

  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }

  productID() {

    let productBtn = document.querySelectorAll(".main__singleProduct");

    productBtn.forEach((button) => {
      button.addEventListener("click", () => {
        let id = button.dataset.id;
        // Get product from products
        let buttons = {
          ...Storage.getProduct(id),
          amount: 1,
          color: colorID,
          size: sizeID
        };
        // Add product to the list
        productID = [...productID, buttons];
        // Save product in local storage
        Storage.saveProduct(productID);
      })
    })
  }
}

// Local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
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
    ui.sliderProducts(products);
    Storage.saveProducts(products);
  }).then(() => {
    ui.getBagButtons();
    ui.productID();
  });
})

function productSpecs(id) {

  const product = Storage.getProduct(id);
  const exist = cart.findIndex(element => element.id === id);
  let singleProduct = [cart[exist]];

  // Save product in local storage
  Storage.saveProduct(singleProduct);
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