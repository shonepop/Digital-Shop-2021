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

// Display products
class UI {

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
            }
        })
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
    }

    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
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

    // Setup APP
    ui.setupAPP();
    ui.cartLogic();
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