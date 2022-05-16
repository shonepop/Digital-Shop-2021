const cartSubtotal = document.querySelector(".cart__subtotals-num");
const cartTotals = document.querySelector(".cart__totals-num");
const bagProductInfo = document.querySelector(".cart__info");
const updateCart = document.querySelector(".cart__updateBtn");

// Cart 
let cart = [];

// Display products
class UI {

    displaySingleProduct() {

        let products = Storage.getCart();

        let result = "";

        products.forEach((product) => {

            result += `
            <tr class="cart__product-info">
                                <td class="cart__product-remove"><i class="fas fa-times" data-id=${product.id}></i></td>
                                <td class="cart__productImg"><img class="cart__product-img" src=${product.image}
                                        alt=""></td>
                                <td class="cart__product-detail">       
                                    <span onclick="productSpecs('${product.id}')" class="cart__product-detail-heading cart__singleProduct" data-id=${product.id}>${product.title}</span>                
                                    <dl class="cart__color-variation">
                                        <dt class="cart__product-color">Color :</dt>
                                        <dd class="cart__color">${product.color}</dd>
                                        <dt class="cart__product-size">Size :</dt>
                                        <dd class="cart__size">${product.size}</dd>
                                    </dl>
                                </td>
                                <td class="cart__price">$${product.price}</td>
                                <td class="product__quantity">
                                <input type="text" autocomplete="off" aria-valuemin="0"
                                     value="${product.amount}" role="spinbutton" class="product__amount">
                                    <a class="product__btnMin" data-id=${product.id}></a>
                                    <a class="product__btnPlus" data-id=${product.id}></a>
                                </td>
                                <td class="cart__subtotal" data-id=${product.id}>= $${product.price * product.amount}</td> 
            </tr>
        `
        })

        bagProductInfo.innerHTML = result;
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })

        cartTotal.innerText = `$${parseFloat(tempTotal.toFixed(2))}`;
        cartSubtotal.innerText = `$${parseFloat(tempTotal.toFixed(2))}`;
        cartTotals.innerText = `$${parseFloat(tempTotal.toFixed(2))}`;
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
                let products = document.querySelectorAll(".cart__singleProduct");
                let removeItem = event.target;
                let id = removeItem.dataset.id;

                // Remove item from basket
                cartProducts.removeChild(removeItem.parentElement.parentElement.parentElement);

                // Remove product from shopping bag
                products.forEach(product => {
                    if (product.dataset.id == id) {
                        bagProductInfo.removeChild(product.parentElement.parentElement);
                    }
                })

                // Remove item from cart
                this.removeItem(id);
                checkCart()
            }
        })

        bagProductInfo.addEventListener("click", (event) => {

            if (event.target.classList.contains("fa-times")) {
                let items = document.querySelectorAll(".navigation__cart-view-product");
                let removeItem = event.target;
                let id = removeItem.dataset.id;

                // Remove product from shopping bag
                bagProductInfo.removeChild(removeItem.parentElement.parentElement);

                // Remove item from basket
                items.forEach(item => {
                    if (item.dataset.id == id) {
                        cartProducts.removeChild(item.parentElement.parentElement);
                    }
                })

                // Remove item from cart
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

    checkAmount() {

        const amounts = document.querySelectorAll(".product__quantity");
        const subtotals = document.querySelectorAll(".cart__subtotal");
        const productInfo = document.querySelectorAll(".cart__product-info");
        const cartQuantity = document.querySelectorAll(".navigation__cart-view-quantity");

        productInfo.forEach(product => {

            product.addEventListener("click", (event) => {

                if (event.target.classList.contains("product__btnPlus")) {

                    let addAmount = event.target;
                    let id = addAmount.dataset.id;
                    let tempItem = cart.find(item => item.id === id);
                    tempItem.amount = tempItem.amount + 1;
                    if (tempItem.amount > 50) {
                        tempItem.amount = 50;
                    }
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    addAmount.previousElementSibling.previousElementSibling.value = tempItem.amount;
                    
                    subtotals.forEach(subtotal => {
                        if (subtotal.dataset.id == id) {
                            subtotal.innerText = "= $" + tempItem.amount * tempItem.price;
                        }
                    })

                } else if (event.target.classList.contains("product__btnMin")) {

                    let addAmount = event.target;
                    let id = addAmount.dataset.id;
                    let tempItem = cart.find(item => item.id === id);
                    tempItem.amount = tempItem.amount - 1;
                    if (tempItem.amount < 1) {
                        tempItem.amount = 1;
                    }
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    addAmount.previousElementSibling.value = tempItem.amount;
                    subtotals.forEach(subtotal => {
                        if (subtotal.dataset.id == id) {
                            subtotal.innerText = "= $" + tempItem.amount * tempItem.price;
                        }
                    })
                }
            })
        })

        updateCart.addEventListener("click", () => {

            location.reload();
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

    // Setup APP
    ui.setupAPP();
    ui.cartLogic();
    ui.displaySingleProduct();
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