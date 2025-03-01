// Lógica de la página principal (index.html)

// Función para agregar productos al carrito
function addToCart(productId) {
  const product = document.getElementById(productId);
  const productName = product.querySelector(".product-name").textContent;
  const productPrice = product.querySelector(".product-price").textContent;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  cart.push({ name: productName, price: productPrice });
  localStorage.setItem('cart', JSON.stringify(cart));

  alert(`${productName} ha sido agregado al carrito.`);
}

// Función para mostrar el carrito
function showCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartList = document.getElementById("cart-list");

  cartList.innerHTML = ''; // Limpiar la lista de productos en el carrito

  cart.forEach(item => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.name} - ${item.price}`;
    cartList.appendChild(listItem);
  });

  if (cart.length === 0) {
    cartList.innerHTML = '<li>El carrito está vacío.</li>';
  }
}

// Cargar el carrito al iniciar la página
window.onload = function() {
  showCart();
};