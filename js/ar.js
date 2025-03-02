// Inicialización de Three.js para Realidad Aumentada
// Usando AR.js con Three.js para cargar y mostrar un modelo 3D en AR

let scene, camera, renderer, alebrije;

function initAR() {
    // Crear la escena con fondo gradient
    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL(0.6, 0.5, 0.5);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Renderizador con sombras
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Crear un alebrije estilizado
    const geometriaBase = new THREE.CylinderGeometry(1, 1.5, 2, 8);
    const material = new THREE.MeshStandardMaterial({
        color: 0xFFD700, // Dorado
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0xCD2026, // Rojo mexicano
        emissiveIntensity: 0.5
    });

    // Geometrías adicionales para detalles
    const detalleGeometria = new THREE.TorusGeometry(1.2, 0.1, 16, 100);
    const patronGeometria = new THREE.SphereGeometry(0.3, 32, 32);

    // Crear grupo principal
    alebrije = new THREE.Group();

    // Cuerpo principal
    const cuerpo = new THREE.Mesh(geometriaBase, material);
    alebrije.add(cuerpo);

    // Detalles decorativos
    const detalles = [];
    const colores = [0x008C45, 0xCD2026, 0xFFFFFF]; // Verde, rojo, blanco
    for(let i = 0; i < 8; i++) {
        const detalle = new THREE.Mesh(detalleGeometria, new THREE.MeshStandardMaterial({
            color: colores[i % 3],
            metalness: 0.5
        }));
        detalle.rotation.x = Math.PI/2;
        detalle.position.y = i * 0.2 - 0.8;
        detalles.push(detalle);
        alebrije.add(detalle);
    }

    // Patrones flotantes
    const patrones = new THREE.Group();
    for(let i = 0; i < 12; i++) {
        const patron = new THREE.Mesh(patronGeometria, new THREE.MeshStandardMaterial({
            color: colores[i % 3],
            emissive: colores[(i+1) % 3],
            emissiveIntensity: 0.3
        }));
        const angulo = (i / 12) * Math.PI * 2;
        patron.position.set(Math.cos(angulo) * 2, Math.sin(angulo) * 0.5, Math.sin(angulo) * 2);
        patrones.add(patron);
    }
    alebrije.add(patrones);

    scene.add(alebrije);

    // Iluminación dramática
    const luzFondo = new THREE.PointLight(0xCD2026, 1, 50);
    luzFondo.position.set(0, 5, 5);
    scene.add(luzFondo);

    const luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(luzAmbiente);

    camera.position.z = 7;

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Animación compleja con múltiples movimientos
    alebrije.rotation.y += 0.01;
    alebrije.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
    alebrije.position.y = Math.sin(Date.now() * 0.002) * 0.5;
    
    // Rotación de patrones
    alebrije.children[2].rotation.y += 0.02;
    alebrije.children[2].children.forEach((patron, index) => {
        patron.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
    });

    renderer.render(scene, camera);
}

initAR();
