const checkoutSubtotal = document.querySelector(".checkout__subtotal-num");
const checkoutTotals = document.querySelector(".checkout__total-num");
const checkoutInfo = document.querySelector(".checkout__info");

// Cart 
let cart = [];

// Display products
class UI {

    displaySingleProduct() {

        let products = Storage.getCart();

        products.forEach(product => {
        const div = document.createElement("tr");
        div.classList.add("checkout__product-info");
        div.innerHTML = `
        <td class="checkout__productImg">
                                        <img class="checkout__product-img" src=${product.image} alt=""> 
                                    </td>
                                 <td class="checkout__product-detail">
                                 <a onclick="productSpecs('${product.id}')" class="checkout__singleProduct" data-id=${product.id}>
                                        <span class="checkout__product-heading">${product.title} <span class="checkout__product-heading--amount">x${product.amount}</span></span>
                                        </a>
                                     <dl class="checkout__color-variation">
                                            <dt class="checkout__product-color">Color :</dt>
                                            <dd class="checkout__color">${product.color}</dd>
                                            <dt class="checkout__product-size">Size :</dt>
                                            <dd class="checkout__size">${product.size}</dd>
                                        </dl>
                                    </td>
                                    <td class="checkout__subtotal">$${product.price * product.amount}</td>
        `
            checkoutInfo.prepend(div);
        })
}

setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
    })
    checkoutTotals.innerText = `$${parseFloat(tempTotal.toFixed(2))}`;
    checkoutSubtotal.innerText = `$${parseFloat(tempTotal.toFixed(2))}`;
    cartTotal.innerText = `$${parseFloat(tempTotal.toFixed(2))}`;
    cartItems.innerText = `(${itemsTotal})`;
}

addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("navigation__cart-view-basket");
    div.innerHTML = `
    
        <img class="navigation__cart-view-img" src=${item.image} alt="">
        <div class="navigation__cart-view-info">
        <div onclick="productSpecs('${item.id}')" class="navigation__cart-view-product navigation__singleProduct" data-id=${item.id}>${item.title}</div>
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
                let products = document.querySelectorAll(".checkout__singleProduct");
                let removeItem = event.target;
                let id = removeItem.dataset.id;

                // Remove item from basket
                cartProducts.removeChild(removeItem.parentElement.parentElement.parentElement);

                // Remove product from your order
                products.forEach(product => {
                    if (product.dataset.id == id) {
                        checkoutInfo.removeChild(product.parentElement.parentElement);
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