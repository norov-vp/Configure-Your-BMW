import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* =========================================
   O'ZGARUVCHILAR
========================================= */
let scene, camera, renderer, controls;
let carGroup;
let wheels = [];
let headlights = [];
let taillights = [];
let automaticRotation = true;
let mouseDown = false;
let currentModel = "M5";
let currentColor = "#b4000c";
let carBodyMaterial;
let doorOpen = false;
let lightsOn = true;
let isResetting = false;

/* =========================================
   MODELLAR MA'LUMOTLARI
========================================= */
const modelData = {
  M5: {
    name: "M5",
    tagline: "ENG ZOR PERFORMANS SEDANI",
    desc: "Afsonaviy BMW M5 ni his eting. Performans uchun yaratilgan, aniqlik uchun ishlab chiqilgan va yo'lda hukmronlik qilish uchun mo'ljallangan.",
    power: "717",
    acceleration: "3.4",
    speed: "305",
    torque: "750",
    color: "#b4000c"
  },
  M3: {
    name: "M3",
    tagline: "SPORT SEDAN KING",
    desc: "BMW M3 - bu sport va kundalik hayotning mukammal uyg'unligi. 523 ot kuchiga ega bo'lgan bu mashina har bir burilishda zavq bag'ishlaydi.",
    power: "523",
    acceleration: "3.5",
    speed: "290",
    torque: "650",
    color: "#1a8a3a"
  },
  M4: {
    name: "M4",
    tagline: "KUPE KLASSI",
    desc: "BMW M4 - bu dinamika va uslubning timsoli. 503 ot kuchi bilan u har bir masofani zavqga aylantiradi.",
    power: "503",
    acceleration: "3.9",
    speed: "290",
    torque: "600",
    color: "#1a4a8a"
  },
  M8: {
    name: "M8",
    tagline: "LUKS SPORT",
    desc: "BMW M8 - bu hashamat va quvvatning birlashmasi. 617 ot kuchi va 305 km/s tezlik bilan u yo'lda qirol.",
    power: "617",
    acceleration: "3.2",
    speed: "305",
    torque: "750",
    color: "#4a1a2a"
  },
  XM: {
    name: "XM",
    tagline: "SUV PERFORMANS",
    desc: "BMW XM - bu SUV dunyosidagi eng quvvatli avtomobil. 738 ot kuchi va gibrid texnologiyasi bilan u kelajakni bugundan ko'rsatadi.",
    power: "738",
    acceleration: "3.8",
    speed: "270",
    torque: "1000",
    color: "#2a4a1a"
  },
  i4: {
    name: "i4 M50",
    tagline: "ELEKTR PERFORMANS",
    desc: "BMW i4 M50 - bu elektr dvigatelning quvvatini sport avtomobiliga olib kiradi. 536 ot kuchi va 0-100 km/s 3.7 soniyada.",
    power: "536",
    acceleration: "3.7",
    speed: "225",
    torque: "795",
    color: "#0a4a6a"
  },
  M2: {
    name: "M2",
    tagline: "KOMPAKT QUVVAT",
    desc: "BMW M2 - bu eng kichik M avtomobili, lekin eng katta quvvat. 460 ot kuchi bilan u har bir haydashni unutilmas qiladi.",
    power: "460",
    acceleration: "4.1",
    speed: "280",
    torque: "550",
    color: "#6a2a0a"
  }
};

/* =========================================
   BOSHLASH
========================================= */
init();
animate();

function init() {
  const container = document.getElementById("car3d");

  // SCENE
  scene = new THREE.Scene();
  scene.background = null;

  // CAMERA
  camera = new THREE.PerspectiveCamera(32, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(6.5, 3.1, 8);

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);

  // CONTROLS
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.minDistance = 4.5;
  controls.maxDistance = 14;
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.6;
  controls.target.set(0, 0.8, 0);
  controls.update();

  // LIGHTS
  createLights();

  // FLOOR
  createFloor();

  // CAR
  carGroup = createBMW(currentModel, currentColor);
  scene.add(carGroup);

  // RESIZE
  window.addEventListener("resize", onResize);

  // ROTATION BUTTON
  document.getElementById("rotateBtn").addEventListener("click", () => {
    automaticRotation = !automaticRotation;
  });

  // RESET VIEW
  document.getElementById("resetViewBtn").addEventListener("click", resetView);

  // MODEL MENU
  setupModels();

  // COLOR PICKER
  setupColorPicker();

  // MOBILE MENU
  setupMenu();

  // DRAG
  renderer.domElement.addEventListener("pointerdown", () => {
    mouseDown = true;
    automaticRotation = false;
  });
  renderer.domElement.addEventListener("pointerup", () => {
    mouseDown = false;
  });

  // CAR CONTROLS
  document.getElementById("openDoorBtn").addEventListener("click", toggleDoor);
  document.getElementById("toggleLightsBtn").addEventListener("click", toggleLights);

  // LOADING
  setTimeout(() => {
    document.getElementById("loading").classList.add("hide");
  }, 1500);
}

/* =========================================
   LIGHTS
========================================= */
function createLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambient);

  const front = new THREE.DirectionalLight(0xffffff, 4);
  front.position.set(5, 7, 8);
  front.castShadow = true;
  scene.add(front);

  const back = new THREE.DirectionalLight(0xffffff, 1.5);
  back.position.set(-3, 4, -5);
  scene.add(back);

  const red = new THREE.PointLight(0xff0018, 45, 12);
  red.position.set(5, 2, -4);
  scene.add(red);

  const blue = new THREE.PointLight(0x126bff, 35, 10);
  blue.position.set(-5, 2, 4);
  scene.add(blue);

  const top = new THREE.DirectionalLight(0xffffff, 2);
  top.position.set(0, 10, 0);
  scene.add(top);
}

/* =========================================
   FLOOR
========================================= */
function createFloor() {
  const geometry = new THREE.CircleGeometry(8, 64);
  const material = new THREE.MeshBasicMaterial({
    color: 0x111111,
    transparent: true,
    opacity: 0.55
  });
  const floor = new THREE.Mesh(geometry, material);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.05;
  scene.add(floor);

  const ringGeometry = new THREE.RingGeometry(3.2, 3.5, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xd90012,
    transparent: true,
    opacity: 0.13,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.01;
  scene.add(ring);
}

/* =========================================
   BMW YARATISH
========================================= */
function createBMW(model, color) {
  const group = new THREE.Group();
// Material
const carBodyMaterial = new THREE.MeshPhysicalMaterial({
  color: color,
  metalness: 0.75,
  roughness: 0.22,
  clearcoat: 1,
  clearcoatRoughness: 0.1
});

  // BODY
  const bodyGroup = createBody(color);
  group.add(bodyGroup);

  // HOOD
  const hood = createHood(color);
  group.add(hood);

  // ROOF
  const roof = createRoof(color);
  group.add(roof);

  // WINDOWS
  const windows = createWindows();
  group.add(windows);

  // GRILLE
  const grille = createGrille();
  group.add(grille);

  // HEADLIGHTS
  const lightsGroup = createHeadlights();
  group.add(lightsGroup);

  // TAILLIGHTS
  const tailGroup = createTaillights();
  group.add(tailGroup);

  // WHEELS
  wheels = [];
  createWheels(group);

  // MIRRORS
  createMirrors(group, color);

  // BUMPERS
  createBumpers(group);

  // EXHAUST
  createExhaust(group);

  // SIDE DETAILS
  createSideDetails(group, color);

  // M BADGE
  createMBadge(group, model);

  // FINAL SCALE & POSITION
  const scale = getModelScale(model);
  group.scale.set(scale, scale, scale);
  group.position.y = 0.55;
  group.rotation.y = Math.PI * 0.05;

  return group;
}


function getModelScale(model) {
  const scales = {
    M5: 1.15,
    M3: 1.08,
    M4: 1.10,
    M8: 1.20,
    XM: 1.28,
    i4: 1.12,
    M2: 1.02
  };
  return scales[model] || 1.15;
}

/* =========================================
   BODY
========================================= */
function createBody(color) {
  const shape = new THREE.Shape();
  shape.moveTo(-2.7, 0);
  shape.quadraticCurveTo(-2.3, 0.85, -1.1, 1);
  shape.lineTo(1.8, 1);
  shape.quadraticCurveTo(2.5, 0.85, 2.75, 0);
  shape.lineTo(2.6, -0.35);
  shape.lineTo(-2.5, -0.35);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1.9,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.16,
    bevelThickness: 0.12
  });
  geometry.center();
  geometry.rotateY(Math.PI / 2);
  geometry.scale(1, 0.65, 1);

  const body = new THREE.Mesh(geometry, carBodyMaterial);
  body.scale.set(1, 1, 0.75);
  body.position.y = 0.25;
  body.castShadow = true;
  body.receiveShadow = true;

  return body;
}

/* =========================================
   HOOD
========================================= */
function createHood(color) {
  const geometry = new THREE.BoxGeometry(3.5, 0.18, 1.75, 8, 2, 8);
  const hood = new THREE.Mesh(geometry, carBodyMaterial);
  hood.position.set(1.35, 0.95, 0);
  hood.rotation.z = -0.025;
  hood.castShadow = true;
  return hood;
}

/* =========================================
   ROOF
========================================= */
function createRoof(color) {
  const geometry = new THREE.CapsuleGeometry(1.05, 2.3, 8, 16);
  const roof = new THREE.Mesh(geometry, carBodyMaterial);
  roof.scale.set(1, 0.45, 0.85);
  roof.position.set(-0.25, 1.42, 0);
  roof.rotation.z = Math.PI / 2;
  roof.castShadow = true;
  return roof;
}

/* =========================================
   WINDOWS
========================================= */
function createWindows() {
  const group = new THREE.Group();
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x06101a,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.05,
    transparent: true,
    opacity: 0.85
  });

  const positions = [
    { x: 0.65, z: 0.88, rot: -0.18 },
    { x: -0.65, z: 0.88, rot: 0.18 },
    { x: 0.65, z: -0.88, rot: -0.18 },
    { x: -0.65, z: -0.88, rot: 0.18 }
  ];

  positions.forEach(p => {
    const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.55, 0.06), material);
    windowMesh.position.set(p.x, 1.35, p.z);
    windowMesh.rotation.z = p.rot;
    group.add(windowMesh);
  });

  return group;
}

/* =========================================
   GRILLE
========================================= */
function createGrille() {
  const group = new THREE.Group();
  const blackMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.8, roughness: 0.22 });
  const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 1, roughness: 0.15 });

  for (let i = -1; i <= 1; i += 2) {
    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.7, 0.08), blackMat);
    grille.position.set(2.75, 0.58, i * 0.38);
    grille.rotation.y = 0.08;
    group.add(grille);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.77, 0.035), chromeMat);
    frame.position.set(2.78, 0.58, i * 0.38);
    group.add(frame);
  }

  return group;
}

/* =========================================
   HEADLIGHTS
========================================= */
function createHeadlights() {
  const group = new THREE.Group();
  const lightMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    emissive: 0xbfdcff,
    emissiveIntensity: 8,
    metalness: 0.1,
    roughness: 0.1
  });

  for (const z of [-0.62, 0.62]) {
    const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.13, 0.4), lightMat);
    headlight.position.set(2.7, 0.88, z);
    group.add(headlight);
    headlights.push(headlight);

    const glow = new THREE.PointLight(0xcce7ff, 2.5, 4);
    glow.position.set(2.9, 0.9, z);
    group.add(glow);
  }

  return group;
}

/* =========================================
   TAILLIGHTS
========================================= */
function createTaillights() {
  const group = new THREE.Group();
  const tailMat = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    emissive: 0xff0000,
    emissiveIntensity: 3,
    metalness: 0.1,
    roughness: 0.3
  });

  for (const z of [-0.55, 0.55]) {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.4), tailMat);
    tail.position.set(-2.75, 0.8, z);
    group.add(tail);
    taillights.push(tail);
  }

  return group;
}

/* =========================================
   WHEELS
========================================= */
function createWheels(group) {
  const positions = [
    [1.65, 0.15, 0.96],
    [-1.55, 0.15, 0.96],
    [1.65, 0.15, -0.96],
    [-1.55, 0.15, -0.96]
  ];

  positions.forEach(pos => {
    const wheel = createWheel();
    wheel.position.set(pos[0], pos[1], pos[2]);
    group.add(wheel);
    wheels.push(wheel);
  });
}

function createWheel() {
  const group = new THREE.Group();

  const tyreMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, roughness: 0.8, metalness: 0.05 });
  const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.32, 32), tyreMat);
  tyre.rotation.z = Math.PI / 2;
  tyre.castShadow = true;
  group.add(tyre);

  const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 1, roughness: 0.15 });
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.34, 32), chromeMat);
  rim.rotation.z = Math.PI / 2;
  group.add(rim);

  const blackMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.8, roughness: 0.22 });
  const center = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.36, 20), blackMat);
  center.rotation.z = Math.PI / 2;
  group.add(center);

  for (let i = 0; i < 10; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.55, 0.025), blackMat);
    spoke.rotation.z = i * Math.PI / 5;
    spoke.position.x = 0.18;
    group.add(spoke);
  }

  return group;
}

/* =========================================
   MIRRORS
========================================= */
function createMirrors(group, color) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: color,
    metalness: 0.75,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  });

  for (const z of [-1, 1]) {
    const mirror = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 12), mat);
    mirror.scale.set(1, 0.7, 0.6);
    mirror.position.set(0.1, 1.18, z);
    group.add(mirror);
  }
}

/* =========================================
   BUMPERS
========================================= */
function createBumpers(group) {
  const blackMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.8, roughness: 0.22 });

  const front = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 1.8), blackMat);
  front.position.set(2.78, 0.38, 0);
  group.add(front);

  const rear = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.4, 1.8), blackMat);
  rear.position.set(-2.75, 0.4, 0);
  group.add(rear);
}

/* =========================================
   EXHAUST
========================================= */
function createExhaust(group) {
  const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 1, roughness: 0.15 });

  for (const z of [-0.55, 0.55]) {
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.15, 24), chromeMat);
    exhaust.rotation.z = Math.PI / 2;
    exhaust.position.set(-2.85, 0.28, z);
    group.add(exhaust);
  }
}

/* =========================================
   SIDE DETAILS
========================================= */
function createSideDetails(group, color) {
  const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 1, roughness: 0.15 });

  const line = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.025, 0.025), chromeMat);
  line.position.set(0, 0.65, 0.97);
  group.add(line);

  const line2 = line.clone();
  line2.position.z = -0.97;
  group.add(line2);
}

/* =========================================
   M BADGE
========================================= */
function createMBadge(group, model) {
  const colors = {
    M5: 0x167cff,
    M3: 0x1a8a3a,
    M4: 0x1a4a8a,
    M8: 0x4a1a2a,
    XM: 0x2a4a1a,
    i4: 0x0a4a6a,
    M2: 0x6a2a0a
  };

  const badge = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.12, 0.025),
    new THREE.MeshBasicMaterial({ color: colors[model] || 0x167cff })
  );
  badge.position.set(0.55, 0.9, 0.99);
  group.add(badge);
}

/* =========================================
   ANIMATION
========================================= */
function animate() {
  requestAnimationFrame(animate);

  if (automaticRotation && carGroup) {
    carGroup.rotation.y += 0.0025;
  }

  const time = performance.now() * 0.002;

  // Headlight pulse
  headlights.forEach(light => {
    if (light.material) {
      light.material.emissiveIntensity = lightsOn ? (6 + Math.sin(time) * 2) : 0;
    }
  });

  // Taillights
  taillights.forEach(tail => {
    if (tail.material) {
      tail.material.emissiveIntensity = lightsOn ? 3 : 0.5;
    }
  });

  // Wheel rotation
  const wheelSpeed = automaticRotation ? 0.5 : 0.1;
  wheels.forEach((wheel, index) => {
    if (index % 2 === 0) {
      wheel.rotation.x += 0.01 * wheelSpeed;
    } else {
      wheel.rotation.x += 0.01 * wheelSpeed;
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

/* =========================================
   RESIZE
========================================= */
function onResize() {
  const container = document.getElementById("car3d");
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

/* =========================================
   RESET VIEW
========================================= */
function resetView() {
  if (isResetting) return;
  isResetting = true;

  const targetPos = new THREE.Vector3(6.5, 3.1, 8);
  const startPos = camera.position.clone();

  let startTime = null;
  const duration = 800;

  function animateReset(time) {
    if (!startTime) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(startPos, targetPos, ease);
    controls.target.set(0, 0.8, 0);
    controls.update();

    if (progress < 1) {
      requestAnimationFrame(animateReset);
    } else {
      isResetting = false;
    }
  }

  requestAnimationFrame(animateReset);
}

/* =========================================
   TOGGLE DOOR
========================================= */
function toggleDoor() {
  doorOpen = !doorOpen;
  const btn = document.getElementById("openDoorBtn");
  btn.textContent = doorOpen ? "🚪 Yopish" : "🚪 Eshik";
  btn.style.borderColor = doorOpen ? "#e30613" : "#333";

  // Door animation - find door parts and animate
  // For simplicity, we'll just rotate the whole car slightly
  if (doorOpen) {
    carGroup.rotation.z = 0.03;
  } else {
    carGroup.rotation.z = 0;
  }
}

/* =========================================
   TOGGLE LIGHTS
========================================= */
function toggleLights() {
  lightsOn = !lightsOn;
  const btn = document.getElementById("toggleLightsBtn");
  btn.textContent = lightsOn ? "💡 Chiroq" : "💡 O'chirish";
  btn.style.borderColor = lightsOn ? "#1479ff" : "#333";
}

/* =========================================
   MODEL SWITCHING
========================================= */
function setupModels() {
  const models = document.querySelectorAll(".model");
  const mobileModels = document.querySelectorAll(".mobile-menu a");

  models.forEach(model => {
    model.addEventListener("click", () => {
      switchModel(model);
    });
  });

  mobileModels.forEach(model => {
    model.addEventListener("click", () => {
      const name = model.dataset.model;
      const btn = document.querySelector(`.model[data-model="${name}"]`);
      if (btn) {
        switchModel(btn);
      }
      document.getElementById("mobileMenu").classList.remove("open");
    });
  });
}

function switchModel(button) {
  document.querySelectorAll(".model").forEach(item => item.classList.remove("active"));
  button.classList.add("active");

  const name = button.dataset.model;
  currentModel = name;
  const data = modelData[name];

  // Update UI
  document.getElementById("modelName").textContent = data.name;
  document.getElementById("modelTagline").textContent = data.tagline;
  document.getElementById("modelDesc").textContent = data.desc;

  // Update stats with animation
  animateNumber(document.getElementById("power"), data.power);
  animateNumber(document.getElementById("acceleration"), data.acceleration);
  animateNumber(document.getElementById("speed"), data.speed);
  animateNumber(document.getElementById("torque"), data.torque);

  // Update color picker
  document.querySelectorAll(".color-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.color === data.color) {
      btn.classList.add("active");
    }
  });

  // Change car
  currentColor = data.color;
  if (carGroup) {
    scene.remove(carGroup);
  }
  carGroup = createBMW(name, currentColor);
  scene.add(carGroup);

  // Reset door and lights
  doorOpen = false;
  document.getElementById("openDoorBtn").textContent = "🚪 Eshik";
  document.getElementById("openDoorBtn").style.borderColor = "#333";
  carGroup.rotation.z = 0;

  // Play switch animation
  carGroup.scale.set(0.8, 0.8, 0.8);
  let scale = 0.8;
  const interval = setInterval(() => {
    scale += 0.02;
    carGroup.scale.set(scale, scale, scale);
    if (scale >= 1) {
      clearInterval(interval);
    }
  }, 10);
}

/* =========================================
   COLOR PICKER
========================================= */
function setupColorPicker() {
  const colorBtns = document.querySelectorAll(".color-btn");

  colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      colorBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentColor = btn.dataset.color;

      // Update car color
      if (carGroup) {
        scene.remove(carGroup);
        carGroup = createBMW(currentModel, currentColor);
        scene.add(carGroup);
      }
    });
  });
}

/* =========================================
   NUMBER ANIMATION
========================================= */
function animateNumber(element, value) {
  element.style.opacity = "0";
  element.style.transform = "translateY(10px)";

  setTimeout(() => {
    element.textContent = value;
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
  }, 200);
}

/* =========================================
   MOBILE MENU
========================================= */
function setupMenu() {
  const menu = document.getElementById("mobileMenu");
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeMenu");

  menuBtn.addEventListener("click", () => {
    menu.classList.add("open");
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("open");
  });
}