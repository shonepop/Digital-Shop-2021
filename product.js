const tabDescription = document.querySelector(".product__info-description");
const tabInfo = document.querySelector(".product__add-info");
const detail = document.querySelector(".product__description-detail");
const specifications = document.querySelector(".product__specifications");
const productDOM = document.querySelector(".product__container");

tabDescription.addEventListener("click", () => {

    tabDescription.classList.add("active");
    detail.classList.add("active");
    tabInfo.classList.remove("active");
    specifications.classList.remove("active");
})

tabInfo.addEventListener("click", () => {

    tabInfo.classList.add("active");
    specifications.classList.add("active");
    tabDescription.classList.remove("active");
    detail.classList.remove("active");
})

// Cart 
let cart = [];
// Buttons
let buttonsDOM = [];
// Product
let productID = [];
// Color
let colorID = [];
// Size
let sizeID = [];

// Display products
class UI {

    displaySingleProduct() {

        let product = Storage.getProductSpec()[0];
        const productImg = document.createElement("div");
        productImg.classList.add("product__image");
        const productInfo = document.createElement("div");
        productInfo.classList.add("product__info");

        productImg.innerHTML = `
                      <div class="product__gallery">
                          <div class="product__gallery-wrapper">
                              <div class="product__slide"><img src=${product.image} alt="" class="product__mainImg"></div>
                          </div>
                      </div>
                      <div class="product__thumbs">
                          <div class="product__gallery-thumbs">
                              <div class="product__thumbs-slide">
                                  <img class="product__thumbs-slide-img1" src=${product.image} alt="">
                              </div>
                          </div>
                      </div>
            `;

        productInfo.innerHTML = `
                <div class="product__model">${product.model}</div>
                <div class="product__heading">${product.title}</div>
                <div class="product__price">$${product.price}</div>
                <div class="product__description">This NoiseStorm font is inspired by Classic Retro and Vintage apparel,
                    headlines, signage, logo, quote, apparel and other creative applications.</div>
                <div class="product__quantity">
                    <input class="product__amount" type="text" autocomplete="off"
                        value="${product.amount}" role="spinbutton">
                    <a class="product__btnMin" data-id=${product.id}></a>
                    <a class="product__btnPlus" data-id=${product.id}></a>
                    <a class="product__btn" data-id=${product.id}>Add To Cart</a>
                </div>
                <div class="product__colors">
                    <div class="product__color-heading">Color:</div>
                    <span class="product__color-blue product__color"></span>
                    <span class="product__color-green product__color"></span>
                    <span class="product__color-orange product__color"></span>
                    <span class="product__color-red product__color"></span>
                </div>
                <div class="product__sizes">
                    <div class="product__size-heading">Size:</div>
                    <span class="product__size-m product__size">M</span>
                    <span class="product__size-xl product__size">XL</span>
                    <span class="product__size-xs product__size">XS</span>
                </div>
                <div class="product__alert">
                    <span class="product__alert-span">Please select product color and size.</span>
                </div>
            `
        productDOM.prepend(productInfo);
        productDOM.prepend(productImg);
    }

    getBagButtons() {

        let colors = document.querySelectorAll(".product__color");
        colors.forEach((color) => {
            color.addEventListener("click", () => {
                for (let i = 0; i < colors.length; i++) {
                    colors[i].style.outline = "none";
                }
                let item = getComputedStyle(color);
                let itemColor = item.backgroundColor;
                if (itemColor == "rgb(255, 0, 0)") {
                    itemColor = "Red"
                } else if (itemColor == "rgb(255, 165, 0)") {
                    itemColor = "Orange"
                } else if (itemColor == "rgb(0, 128, 0)") {
                    itemColor = "Green"
                } else if (itemColor == "rgb(26, 95, 255)") {
                    itemColor = "Blue"
                }
                colorID = [itemColor];
                Storage.saveColor(colorID);
                color.style.outline = "3px solid blue";
            })
        })
        let sizes = document.querySelectorAll(".product__size");
        sizes.forEach((size) => {
            size.addEventListener("click", () => {
                for (let i = 0; i < sizes.length; i++) {
                    sizes[i].style.outline = "none";
                }
                let item = size.innerText;
                sizeID = [item];
                Storage.saveSize(sizeID);
                size.style.outline = "3px solid blue";
            })
        })

        let button = document.querySelector(".product__btn");
        buttonsDOM = button;

        let idN = Storage.getId()
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id === id);

        button.addEventListener("click", (event) => {

            const quantity = document.querySelectorAll(".navigation__cart-view-quantity");
            const productAmount = document.querySelector(".product__amount");

            const alert = document.querySelector(".product__alert-span");
            const product = Storage.getProductSpec()[0];
            const exist = cart.findIndex(element => element.id === product.id);
            let updateCart = [...cart];
            let color = Storage.getColor()
                .toString()
            let size = Storage.getSize()
                .toString()
            productAmount.value = product.amount;

            if (exist !== -1) {
                if (colorID == "" || sizeID == "") {
                    alert.style.display = "inline-block";
                } else if (updateCart[exist].color[0] === "White" && updateCart[exist].size[0] === "XS") {

                    updateCart[exist] = {
                        ...product,
                        color: colorID,
                        size: sizeID
                    }
                    Storage.saveCart(updateCart)
                    this.setCartValues(updateCart)
                    quantity[exist].innerText = `${product.amount} x`;
                    alert.style.display = "none";
                    location.reload()

                } else {

                    idN = +(idN + 17);
                    Storage.saveId(idN)
                    let idNew = idN.toString()

                    // Get product from storage
                    let cartItem = {
                        ...Storage.getProductSpec()[0],
                        id: idNew,
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
                    checkCart()
                    alert.style.display = "none";
                }

            } else {

                if (colorID == "" || sizeID == "") {
                    alert.style.display = "inline-block";
                } else {

                    // Get product from storage
                    let cartItem = {
                        ...Storage.getProductSpec()[0],
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
                    checkCart()
                    alert.style.display = "none";
                }
            }
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

    checkAmount() {

        const amount = document.querySelector(".product__quantity");
        const productAmount = document.querySelector(".product__amount");

        amount.addEventListener("click", (event) => {

            if (event.target.classList.contains("product__btnPlus")) {

                let tempItem = Storage.getProductSpec()[0];
                productID = [tempItem];
                tempItem.amount = tempItem.amount + 1;
                if (tempItem.amount > 50) {
                    tempItem.amount = 50;
                }
                Storage.saveProduct(productID);
                productAmount.value = tempItem.amount;

            } else if (event.target.classList.contains("product__btnMin")) {

                let tempItem = Storage.getProductSpec()[0];
                productID = [tempItem];
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount < 1) {
                    tempItem.amount = 1;
                }
                Storage.saveProduct(productID);
                productAmount.value = tempItem.amount;
            }
        })
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        checkCart()
    }

    getSingleButton(id) {
        if (buttonsDOM.dataset.id === id) {
            return buttonsDOM;
        }
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
    static saveColor(color) {
        localStorage.setItem("color", JSON.stringify(color));
    }

    static getColor() {
        return localStorage.getItem("color") ? JSON.parse(localStorage.getItem("color")) : [];
    }

    static saveSize(size) {
        localStorage.setItem("size", JSON.stringify(size));
    }

    static getSize() {
        return localStorage.getItem("size") ? JSON.parse(localStorage.getItem("size")) : [];
    }

    static saveId(id) {
        localStorage.setItem("id", JSON.stringify(id));
    }

    static getId() {
        return localStorage.getItem("id") ? JSON.parse(localStorage.getItem("id")) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();

    // Setup APP
    ui.setupAPP();
    ui.cartLogic();
    ui.displaySingleProduct();
    ui.getBagButtons();
    ui.checkAmount();
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