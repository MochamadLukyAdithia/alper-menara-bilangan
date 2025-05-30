// Inisialisasi scene Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Setup kamera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 20, 30);
camera.lookAt(0, 0, 0);

// Setup renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("container").appendChild(renderer.domElement);

// Kontrol orbit
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Pencahayaan
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Variabel global
let selectedRing = null;
let isDraggingFromBasket = false;
let draggedRingElement = null;
const rings = [];
const poles = [];
const poleGroup = new THREE.Group();
scene.add(poleGroup);

// Buat lantai
const floorGeometry = new THREE.PlaneGeometry(60, 60);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0xdddddd,
  roughness: 0.8,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Buat papan kayu
createWoodenBoard();
createPoleGrid();

// Event listeners
document.getElementById("clearAll").addEventListener("click", clearAllRings);

// Mouse tracking untuk 3D scene
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseDown = false;

function createWoodenBoard() {
  const boardGeometry = new THREE.BoxGeometry(25, 0.8, 40);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#D8A15E";
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "#8B4513";
  ctx.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 51.2);
    ctx.lineTo(512, i * 51.2 + Math.random() * 20 - 10);
    ctx.stroke();
  }

  const woodTexture = new THREE.CanvasTexture(canvas);
  const boardMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    color: 0xd2691e,
  });

  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.position.set(0, 0.4, 0);
  board.castShadow = true;
  scene.add(board);

  // Teks papan
  const textCanvas = document.createElement("canvas");
  textCanvas.width = 1024;
  textCanvas.height = 256;
  const textCtx = textCanvas.getContext("2d");

  textCtx.font = "Bold 120px Arial";
  textCtx.fillStyle = "white";
  textCtx.strokeStyle = "#2A2A2A";
  textCtx.lineWidth = 3;
  textCtx.textAlign = "center";
  textCtx.textBaseline = "middle";
  textCtx.strokeText("Menara Bilangan", 512, 128);
  textCtx.fillText("Menara Bilangan", 512, 128);

  const textTexture = new THREE.CanvasTexture(textCanvas);
  const textMaterial = new THREE.MeshBasicMaterial({
    map: textTexture,
    transparent: true,
  });

  const textGeometry = new THREE.PlaneGeometry(12, 3);
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(0, 0.81, -16.5);
  textMesh.rotation.x = -Math.PI / 2;
  scene.add(textMesh);
}
function createPoleGrid() {
  const poleGeometry = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
  const poleMaterial = new THREE.MeshPhongMaterial({
    color: 0x8b4513,
    shininess: 30,
  });

  const baseGeometry = new THREE.BoxGeometry(1, 0.3, 1);
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x654321,
  });

  const columns = 5;
  const rows = 8;
  let currentNumber = 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      let poleNumber;

      if (row < 6) {
        poleNumber = currentNumber++;
      } else if (row === 6) {
        // Baris ke-7: 1 2 3 4 5
        poleNumber = col + 1;
      } else if (row === 7) {
        // Baris ke-8: 5 4 3 2 1
        poleNumber = 5 - col;
      }

      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.x = (col - 2) * 4;
      pole.position.z = (row - 3) * 4;
      pole.position.y = 3.8;
      pole.userData.number = poleNumber;
      pole.userData.ringCount = 0;
      pole.castShadow = true;

      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.copy(pole.position);
      base.position.y = 0.95;
      base.castShadow = true;

      // Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = 120; // Set to 120
      canvas.height = 120; // Set to 120
      const context = canvas.getContext("2d");

      // Background with a darker single color (deep burgundy)
      context.fillStyle = "#4A1A1A";
      context.fillRect(0, 0, 150, 150);

      // Border circle (soft gold for contrast)
      context.beginPath();
      context.arc(60, 60, 60, 0, 2 * Math.PI); // Scaled radius (45 * 1.2)
      context.strokeStyle = "#f1c40f";
      context.lineWidth = 3.6; // Scaled from 3 (proportional to canvas)
      context.stroke();

      // Shadow for text (slightly darker for depth)
      context.shadowColor = "rgba(0, 0, 0, 0.7)";
      context.shadowBlur = 4.8; // Scaled from 4
      context.shadowOffsetX = 1.8; // Scaled from 1.5
      context.shadowOffsetY = 1.8; // Scaled from 1.5

      // Main text
      context.font = "Bold 100px Helvetica"; // Scaled from 40px (proportional)
      context.fillStyle = "#ffffff";
      context.strokeStyle = "#f39c12";
      context.lineWidth = 1.8; // Scaled from 1.5
      context.textAlign = "center";
      context.textBaseline = "middle";

      // Draw stroke first, then fill
      context.strokeText(poleNumber, 60, 60); // Adjusted to center (120/2)
      context.fillText(poleNumber, 60, 60);

      // Reset shadow for next elements
      context.shadowColor = "transparent";

      const textTexture = new THREE.CanvasTexture(canvas);
      textTexture.needsUpdate = true;
      const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        alphaTest: 0.2, // Kept for crisper edges
      });

      // Create text geometry and mesh
      const textGeometry = new THREE.PlaneGeometry(1.2, 1.2); // Scaled from 1x1
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(
        pole.position.x, // Keep x aligned with pole
        pole.position.y - 2.3, // Kept above base (base at y=0.95, height=0.3)
        pole.position.z + 2  // Adjusted from 1.5 for better visibility
      );
      textMesh.rotation.y = Math.PI / 4; // Kept for side visibility

      poleGroup.add(pole);
      poleGroup.add(base);
      poleGroup.add(textMesh);
      poles.push(pole);
    }
  }
}

function create3DRing(pole, color) {
  const ringGeometry = new THREE.TorusGeometry(0.6, 0.2, 16, 32);
  const ringMaterial = new THREE.MeshPhongMaterial({
    color: color === "red" ? 0xff3333 : 0x33ff33,
    shininess: 80,
    emissive: color === "red" ? 0x330000 : 0x003300,
    emissiveIntensity: 0.1,
  });

  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.position.copy(pole.position);
  ring.position.y = 3.8 + pole.userData.ringCount * 0.5;
  ring.rotation.x = Math.PI / 2;
  ring.userData.poleNumber = pole.userData.number;
  ring.userData.color = color;
  ring.userData.id = Date.now() + Math.random();
  ring.castShadow = true;

  scene.add(ring);
  rings.push(ring);
  pole.userData.ringCount++;

  return ring;
}

function createBasketRing(color) {
  const ringDiv = document.createElement("div");
  ringDiv.className = `ring-3d ${color} mx-auto`;
  ringDiv.draggable = true;
  ringDiv.dataset.color = color;
  ringDiv.dataset.id = `${color}-${Date.now()}-${Math.random()}`;

  // Drag events
  ringDiv.addEventListener("dragstart", (e) => {
    isDraggingFromBasket = true;
    draggedRingElement = ringDiv;
    ringDiv.classList.add("drag-ghost");
    e.dataTransfer.setData("text/plain", ringDiv.dataset.id);
    e.dataTransfer.effectAllowed = "move";
  });

  ringDiv.addEventListener("dragend", () => {
    ringDiv.classList.remove("drag-ghost");
    isDraggingFromBasket = false;
    draggedRingElement = null;
  });

  return ringDiv;
}

function initializeBasket() {
  const basketContent = document.getElementById("basket-content");
  basketContent.innerHTML = "";

  // Tambahkan 5 ring merah dan 5 ring hijau
  for (let i = 0; i < 5; i++) {
    basketContent.appendChild(createBasketRing("red"));
    basketContent.appendChild(createBasketRing("green"));
  }
}

function replenishRing(color) {
  const basketContent = document.getElementById("basket-content");
  basketContent.appendChild(createBasketRing(color));
}

function clearAllRings() {
  // Hapus ring 3D dari scene
  rings.forEach((ring) => scene.remove(ring));
  rings.length = 0;

  // Reset pole data
  poles.forEach((pole) => {
    pole.userData.ringCount = 0;
  });

  // Reset basket
  initializeBasket();
}

// Handle drop on 3D scene
renderer.domElement.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
});

renderer.domElement.addEventListener("drop", (e) => {
  e.preventDefault();

  if (!isDraggingFromBasket || !draggedRingElement) return;

  // Convert screen coordinates to 3D world coordinates
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(poles);

  if (intersects.length > 0) {
    const pole = intersects[0].object;
    const color = draggedRingElement.dataset.color;

    // Create 3D ring on pole
    create3DRing(pole, color);

    // Remove from basket
    draggedRingElement.remove();

    // Replenish basket
    replenishRing(color);

    console.log(`Ring ${color} ditambahkan ke cagak ${pole.userData.number}`);
  }
});

// Mouse interaction for 3D rings
function updateMouse(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

renderer.domElement.addEventListener("mousedown", (e) => {
  updateMouse(e);
  mouseDown = true;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(rings);

  if (intersects.length > 0) {
    selectedRing = intersects[0].object;
    controls.enabled = false; // Disable orbit controls when dragging ring
  }
});

renderer.domElement.addEventListener("mousemove", (e) => {
  updateMouse(e);

  if (selectedRing && mouseDown) {
    // Move ring with mouse
    raycaster.setFromCamera(mouse, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    selectedRing.position.x = intersection.x;
    selectedRing.position.z = intersection.z;
    selectedRing.position.y = 6; // Lift ring while dragging
  }
});

renderer.domElement.addEventListener("mouseup", (e) => {
  if (selectedRing) {
    updateMouse(e);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(poles);

    if (intersects.length > 0) {
      const targetPole = intersects[0].object;
      const sourcePole = poles.find(
        (p) => p.userData.number === selectedRing.userData.poleNumber
      );

      // Update source pole
      if (sourcePole) {
        sourcePole.userData.ringCount--;
        // Reposition remaining rings on source pole
        const remainingRings = rings.filter(
          (r) =>
            r.userData.poleNumber === sourcePole.userData.number &&
            r !== selectedRing
        );
        remainingRings.forEach((r, index) => {
          r.position.y = 3.8 + index * 0.5;
        });
      }

      // Move ring to target pole
      selectedRing.position.set(
        targetPole.position.x,
        3.8 + targetPole.userData.ringCount * 0.5,
        targetPole.position.z
      );
      selectedRing.userData.poleNumber = targetPole.userData.number;
      targetPole.userData.ringCount++;
    } else {
      // Return to original position if not dropped on a pole
      const originalPole = poles.find(
        (p) => p.userData.number === selectedRing.userData.poleNumber
      );
      if (originalPole) {
        const ringIndex = rings
          .filter((r) => r.userData.poleNumber === originalPole.userData.number)
          .indexOf(selectedRing);
        selectedRing.position.set(
          originalPole.position.x,
          3.8 + ringIndex * 0.5,
          originalPole.position.z
        );
      }
    }

    controls.enabled = true; // Re-enable orbit controls
    selectedRing = null;
  }
  mouseDown = false;
});

// Window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Rotate selected ring
  if (selectedRing) {
    selectedRing.rotation.z += 0.05;
  }

  // Update text orientation
  poleGroup.children.forEach((child) => {
    if (child.geometry && child.geometry.type === "PlaneGeometry") {
      child.lookAt(camera.position);
    }
  });

  renderer.render(scene, camera);
}

// Initialize and start
initializeBasket();
animate();
