// admin.js - Versión mejorada con CRUD completo y validaciones

// Inicializa Firebase (Asegúrate de tener tu configuración)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializa la app de Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Referencias a elementos del DOM
const productsContainer = document.getElementById("products");
const productForm = document.getElementById("productForm");
const btnSubmit = document.getElementById("btnSubmit");

// Variables de estado
let editingId = null;

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});

// Función para cargar productos con paginación
function loadProducts() {
  productsContainer.innerHTML = '<div class="loading">Cargando productos...</div>';
  
  db.collection("products").orderBy("name").get()
    .then(snapshot => {
      productsContainer.innerHTML = '';
      if (snapshot.empty) {
        productsContainer.innerHTML = '<p class="no-products">No hay productos registrados</p>';
        return;
      }
      
      snapshot.forEach(doc => {
        const product = doc.data();
        const productElement = document.createElement("div");
        productElement.className = "product-item card";
        productElement.innerHTML = `
          <img src="${product.image || 'img/placeholder.jpg'}" alt="${product.name}">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-meta">
              <span class="price">$${product.price} MXN</span>
              <span class="stock">Disponibles: ${product.stock}</span>
            </div>
            <div class="product-actions">
              <button class="btn-edit" onclick="loadEditForm('${doc.id}')">Editar</button>
              <button class="btn-delete" onclick="deleteProduct('${doc.id}')">Eliminar</button>
            </div>
          </div>
        `;
        productsContainer.appendChild(productElement);
      });
    })
    .catch(error => {
      console.error("Error al cargar productos: ", error);
      productsContainer.innerHTML = '<p class="error">Error al cargar los productos</p>';
    });
}

// Función para crear/actualizar producto
function handleProduct(e) {
  e.preventDefault();
  
  const product = {
    name: document.getElementById("productName").value.trim(),
    description: document.getElementById("productDescription").value.trim(),
    price: parseFloat(document.getElementById("productPrice").value),
    stock: parseInt(document.getElementById("productStock").value),
    image: document.getElementById("productImage").value.trim(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // Validaciones
  if (!product.name || !product.price || product.stock < 0) {
    alert("Por favor completa los campos requeridos (Nombre, Precio y Stock)");
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.textContent = "Procesando...";

  try {
    if (editingId) {
      // Actualizar producto existente
      db.collection("products").doc(editingId).update(product)
        .then(() => {
          showFeedback("Producto actualizado correctamente");
          resetForm();
          loadProducts();
        });
    } else {
      // Crear nuevo producto
      db.collection("products").add(product)
        .then(() => {
          showFeedback("Producto creado exitosamente");
          resetForm();
          loadProducts();
        });
    }
  } catch (error) {
    console.error("Error: ", error);
    showFeedback("Ocurrió un error", "error");
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = editingId ? "Actualizar Producto" : "Crear Producto";
  }
}

// Cargar datos en formulario para editar
function loadEditForm(productId) {
  editingId = productId;
  
  db.collection("products").doc(productId).get()
    .then(doc => {
      if (doc.exists) {
        const product = doc.data();
        document.getElementById("productName").value = product.name;
        document.getElementById("productDescription").value = product.description;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productStock").value = product.stock;
        document.getElementById("productImage").value = product.image;
        
        btnSubmit.textContent = "Actualizar Producto";
        window.scrollTo(0, 0);
      }
    })
    .catch(error => {
      console.error("Error al cargar producto: ", error);
      showFeedback("Error al cargar el producto", "error");
    });
}

// Eliminar producto
function deleteProduct(productId) {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    db.collection("products").doc(productId).delete()
      .then(() => {
        showFeedback("Producto eliminado correctamente");
        loadProducts();
      })
      .catch(error => {
        console.error("Error al eliminar: ", error);
        showFeedback("Error al eliminar el producto", "error");
      });
  }
}

// Helpers
function resetForm() {
  productForm.reset();
  editingId = null;
  btnSubmit.textContent = "Crear Producto";
}

function showFeedback(message, type = "success") {
  const feedback = document.createElement("div");
  feedback.className = `feedback ${type}`;
  feedback.textContent = message;
  document.body.appendChild(feedback);
  
  setTimeout(() => feedback.remove(), 3000);
}

// Event Listeners
productForm.addEventListener("submit", handleProduct);
