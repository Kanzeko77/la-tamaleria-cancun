// Asegúrate que todas las funciones usen el mismo nombre de colección ("productos")
// y mismos nombres de campos en español (nombre, descripción, precio, stock, imagen)

// Función para agregar un nuevo producto (versión mejorada)
function addProduct() {
  const productName = document.getElementById("product-name").value;
  const productPrice = document.getElementById("product-price").value;
  const productStock = document.getElementById("product-stock").value;

  // Validación de campos obligatorios
  if (!productName || !productPrice || !productStock) {
    alert("Por favor complete todos los campos");
    return;
  }

  // Validación de tipos numéricos
  const price = parseFloat(productPrice);
  const stock = parseInt(productStock);
  
  if (isNaN(price) || isNaN(stock)) {
    alert("Precio y stock deben ser valores numéricos");
    return;
  }

  db.collection("productos").add({
    nombre: productName,
    precio: price,
    stock: stock,
    // Agregar campos faltantes según la estructura completa
    descripcion: "", // Considerar agregar campo en el formulario
    imagen: ""       // Considerar agregar campo en el formulario
  })
  .then(docRef => {
    alert("Producto agregado correctamente");
    setTimeout(() => {
      window.location.href = "admin-dashboard.html";
    }, 1500); // Da tiempo de leer el alert antes de redirigir
  })
  .catch(error => {
    console.error("Error al agregar producto: ", error);
    alert("Error al agregar producto. Consola para más detalles.");
  });
}

// Función para actualizar el stock de un producto con transacción
function updateProductStock(productId, newStock) {
  const stock = parseInt(newStock);
  
  if (isNaN(stock)) {
    alert("El stock debe ser un valor numérico");
    return;
  }

  const productRef = db.collection("productos").doc(productId);
  
  db.runTransaction(transaction => {
    return transaction.get(productRef).then(doc => {
      if (!doc.exists) throw "El producto no existe";
      transaction.update(productRef, { stock: stock });
    });
  })
  .then(() => {
    alert("Stock actualizado correctamente");
    loadProducts();
  })
  .catch(error => {
    console.error("Error al actualizar el stock: ", error);
    alert(error.message || "Error al actualizar stock");
  });
}

// Leer productos con manejo de errores
function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = '';

  db.collection("productos").get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        productsContainer.innerHTML = '<p>No hay productos disponibles</p>';
        return;
      }
      
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        const productId = doc.id;
        displayProduct(product, productId);
      });
    })
    .catch((error) => {
      console.error("Error al cargar productos: ", error);
      productsContainer.innerHTML = '<p>Error al cargar productos</p>';
    });
}

// Mostrar producto de forma segura
function displayProduct(product, productId) {
  const productsContainer = document.getElementById("products");
  const productDiv = document.createElement("div");
  productDiv.classList.add("producto");

  // Sanitizar contenido y crear elementos de forma segura
  const img = document.createElement("img");
  img.src = product.imagen || 'placeholder.jpg';
  img.alt = product.nombre.substring(0, 50); // Limitar longitud

  const h3 = document.createElement("h3");
  h3.textContent = product.nombre;

  const description = document.createElement("p");
  description.textContent = product.descripcion;

  // ... Similar para otros elementos

  // Botones con event listeners seguros
  const updateBtn = document.createElement("button");
  updateBtn.className = "update-button";
  updateBtn.textContent = "Actualizar";
  updateBtn.addEventListener('click', () => updateProduct(productId));

  // Agregar elementos al DOM
  productDiv.append(img, h3, description, /* ... */, updateBtn);
  productsContainer.appendChild(productDiv);
}

// Actualizar producto con validación
function updateProduct(productId) {
  const name = prompt("Nuevo nombre del producto:");
  if (name === null) return; // Si el usuario cancela

  // Mejor usar un formulario modal en lugar de prompts
  // Validaciones similares para otros campos...
  
  // Actualización segura con validación
  const updates = {};
  if (name) updates.nombre = name;
  
  // Repetir para otros campos con validaciones...

  db.collection("productos").doc(productId).update(updates)
    .then(() => {
      alert("Producto actualizado exitosamente");
      loadProducts();
    })
    .catch((error) => {
      console.error("Error al actualizar el producto: ", error);
      alert("Error al actualizar. Verifica la consola.");
    });
}

// Eliminar producto con confirmación
function deleteProduct(productId) {
  if (!confirm("¿Estás seguro de eliminar este producto?")) return;

  db.collection("productos").doc(productId).delete()
    .then(() => {
      alert("Producto eliminado exitosamente");
      loadProducts();
    })
    .catch((error) => {
      console.error("Error al eliminar el producto: ", error);
      alert("Error al eliminar producto");
    });
}

// Ordenar producto con actualización de stock
function orderProduct(productId) {
  const quantity = prompt("Cantidad a ordenar:");
  const quantityNum = parseInt(quantity);

  if (isNaN(quantityNum) || quantityNum < 1) {
    alert("Cantidad inválida");
    return;
  }

  const productRef = db.collection("productos").doc(productId);

  db.runTransaction(transaction => {
    return transaction.get(productRef).then(doc => {
      if (!doc.exists) throw "Producto no encontrado";
      
      const currentStock = doc.data().stock;
      if (currentStock < quantityNum) throw "Stock insuficiente";
      
      transaction.update(productRef, {
        stock: currentStock - quantityNum
      });
    });
  })
  .then(() => {
    alert("Pedido realizado exitosamente");
    loadProducts();
  })
  .catch(error => {
    alert(error.toString());
    console.error("Error en pedido:", error);
  });
}