// Inicialización de Three.js para Realidad Aumentada
// Usando AR.js con Three.js para cargar y mostrar un modelo 3D en AR

// Configuración de la escena y la cámara
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear un objeto 3D (por ejemplo, tamal)
const geometry = new THREE.BoxGeometry( 1, 1, 1 ); // Usando una caja para simular un tamal 3D
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh( geometry, material );
scene.add(cube);

// Posicionar la cámara
camera.position.z = 5;

// Función de animación para la visualización AR
function animate() {
  requestAnimationFrame(animate);

  // Rotar el objeto 3D para animarlo
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

// Llamada a la función de animación
animate();

// Integración con AR.js
// Asegúrate de tener AR.js incluido en el proyecto para usar la funcionalidad de AR
const arToolkitSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });

arToolkitSource.init(function () {
  setTimeout(function () {
    onResize();
  }, 2000);
});

const arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: 'path_to_camera_para.dat',
  detectionMode: 'mono',
});

arToolkitContext.init(function () {
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

// Animación AR
function onRenderFrame() {
  if (arToolkitSource.ready === false) {
    return;
  }

  arToolkitContext.update(arToolkitSource.domElement);
  renderer.render(scene, camera);
}

arToolkitSource.onResize = onResize;
window.addEventListener('resize', onResize);

function onResize() {
  arToolkitSource.onResize();
  arToolkitContext.onResize();
}

animate(); // Start AR render loop