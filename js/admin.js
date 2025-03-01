// Lógica para el panel de administración

// Función para mostrar los productos en el panel
function loadProducts() {
  const productsContainer = document.getElementById("products-container");

  db.collection("products").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const product = doc.data();
        const productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.innerHTML = `
          <h3>${product.name}</h3>
          <p>Precio: ${product.price}</p>
          <p>Stock: ${product.stock}</p>
          <button onclick="deleteProduct('${doc.id}')">Eliminar Producto</button>
        `;
        productsContainer.appendChild(productElement);
      });
    })
    .catch(error => {
      console.error("Error al cargar productos: ", error);
    });
}

// Función para eliminar un producto
function deleteProduct(productId) {
  db.collection("products").doc(productId).delete()
    .then(() => {
      alert("Producto eliminado correctamente");
      loadProducts(); // Recargar productos
    })
    .catch(error => {
      console.error("Error al eliminar producto: ", error);
    });
}

// Cargar productos al iniciar la página
window.onload = function() {
  loadProducts();
};