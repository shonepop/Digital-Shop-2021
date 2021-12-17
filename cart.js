const cartList = document.querySelector(".navigation__cart-shopping-list");
const cartCloseBtn = document.querySelector(".navigation__cart-view-close");
const cartView = document.querySelector(".navigation__cart-view");
const cartIcon = document.querySelector(".navigation__cart-span");
const navigationBtn = document.querySelector(".navigation__sidebarBtn");
const sidebarBtn = document.querySelector(".sidebar__btn");
const sidebar = document.querySelector(".sidebar");
const newProducts = document.querySelectorAll(".main__new-product");
const fullCart = document.querySelector(".navigation__cart-link");
const cartItems = document.querySelector(".navigation__cart-items");
const cartTotal = document.querySelector(".navigation__cart-view-subtotal");
const cartProducts = document.querySelector(".navigation__cartBasket");

// Change cart icon text in menu bar
window.addEventListener("resize", cartText);

function cartText() {

  if (window.innerWidth < 425) {
    cartIcon.innerHTML = "";
  } else {
    cartIcon.innerHTML = "Cart";
  }
}
cartText();

// Cart view transform to sidebar
cartList.addEventListener("click", () => {
  cartView.classList.add("active");
})
cartCloseBtn.addEventListener("click", () => {
  cartView.classList.remove("active");
})

window.addEventListener("resize", cartSidebar);

function cartSidebar() {

  if (window.innerWidth > 767) {
    cartView.classList.remove("active");
  }
}

// Sidebar navigation
navigationBtn.addEventListener("click", () => {

  sidebar.classList.add("active");
})
sidebarBtn.addEventListener("click", () => {

  sidebar.classList.remove("active");
})

window.addEventListener("resize", sidebarNav);

function sidebarNav() {

  if (window.innerWidth > 900) {
    sidebar.classList.remove("active");
  }
}

