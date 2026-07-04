import { CONFIG } from './config.js';

// ============================================
// Pentimento WebAR - Main Application
// ============================================

// DOM Elements
const screens = {
  landing: document.getElementById('landing-screen'),
  loading: document.getElementById('loading-screen'),
  ar: document.getElementById('ar-screen'),
  error: document.getElementById('error-screen'),
};

const elements = {
  startBtn: document.getElementById('start-btn'),
  retryBtn: document.getElementById('retry-btn'),
  loadingText: document.getElementById('loading-text'),
  errorText: document.getElementById('error-text'),
  scanningOverlay: document.getElementById('scanning-overlay'),
  trackingLostOverlay: document.getElementById('tracking-lost-overlay'),
  ctaButton: document.getElementById('cta-button'),
  arContainer: document.getElementById('ar-container'),
};

// State
let mindarThree = null;
let cafeScene = null;
let animationFrameId = null;
let isTracking = false;

// ============================================
// Screen Management
// ============================================
function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  if (screens[screenName]) {
    screens[screenName].classList.add('active');
  }
}

function showError(message) {
  elements.errorText.textContent = message || CONFIG.ui.generalError;
  showScreen('error');
}

// ============================================
// 3D Cafe Scene Builder (Fallback with Three.js primitives)
// ============================================
function createCafeScene(THREE) {
  const group = new THREE.Group();

  // Materials
  const ceramicMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5f0e8,
    roughness: 0.3,
    metalness: 0.0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
  });

  const coffeeMat = new THREE.MeshPhysicalMaterial({
    color: 0x3c1e0a,
    roughness: 0.1,
    metalness: 0.0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  });

  const saucerMat = new THREE.MeshPhysicalMaterial({
    color: 0xeee8dc,
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.3,
  });

  const goldAccent = new THREE.MeshPhysicalMaterial({
    color: 0xc9a96e,
    roughness: 0.2,
    metalness: 0.8,
    clearcoat: 0.5,
  });

  // Saucer
  const saucerGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.04, 32);
  const saucer = new THREE.Mesh(saucerGeo, saucerMat);
  saucer.position.y = 0.02;
  group.add(saucer);

  // Saucer rim (gold)
  const saucerRimGeo = new THREE.TorusGeometry(0.40, 0.008, 8, 48);
  const saucerRim = new THREE.Mesh(saucerRimGeo, goldAccent);
  saucerRim.rotation.x = Math.PI / 2;
  saucerRim.position.y = 0.045;
  group.add(saucerRim);

  // Cup body (using lathe for realistic shape)
  const cupPoints = [];
  cupPoints.push(new THREE.Vector2(0.001, 0));
  cupPoints.push(new THREE.Vector2(0.14, 0));
  cupPoints.push(new THREE.Vector2(0.16, 0.02));
  cupPoints.push(new THREE.Vector2(0.15, 0.06));
  cupPoints.push(new THREE.Vector2(0.14, 0.10));
  cupPoints.push(new THREE.Vector2(0.145, 0.18));
  cupPoints.push(new THREE.Vector2(0.16, 0.26));
  cupPoints.push(new THREE.Vector2(0.175, 0.30));
  cupPoints.push(new THREE.Vector2(0.18, 0.32));
  cupPoints.push(new THREE.Vector2(0.178, 0.33));
  cupPoints.push(new THREE.Vector2(0.165, 0.33));
  cupPoints.push(new THREE.Vector2(0.16, 0.31));
  cupPoints.push(new THREE.Vector2(0.001, 0.31));

  const cupGeo = new THREE.LatheGeometry(cupPoints, 32);
  const cup = new THREE.Mesh(cupGeo, ceramicMat);
  cup.position.y = 0.04;
  group.add(cup);

  // Cup gold rim
  const cupRimGeo = new THREE.TorusGeometry(0.172, 0.006, 8, 32);
  const cupRim = new THREE.Mesh(cupRimGeo, goldAccent);
  cupRim.rotation.x = Math.PI / 2;
  cupRim.position.y = 0.375;
  group.add(cupRim);

  // Coffee liquid surface
  const coffeeGeo = new THREE.CircleGeometry(0.155, 32);
  const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.35;
  group.add(coffee);

  // Latte art (simple heart shape using small circle)
  const latteArtMat = new THREE.MeshPhysicalMaterial({
    color: 0xd4b896,
    roughness: 0.1,
    metalness: 0.0,
    transparent: true,
    opacity: 0.6,
  });
  const artGeo = new THREE.CircleGeometry(0.04, 16);
  const art = new THREE.Mesh(artGeo, latteArtMat);
  art.rotation.x = -Math.PI / 2;
  art.position.y = 0.352;
  art.position.z = -0.02;
  group.add(art);

  // Cup handle
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.17, 0.28, 0),
    new THREE.Vector3(0.28, 0.26, 0),
    new THREE.Vector3(0.30, 0.20, 0),
    new THREE.Vector3(0.28, 0.14, 0),
    new THREE.Vector3(0.17, 0.12, 0),
  ]);
  const handleGeo = new THREE.TubeGeometry(handleCurve, 20, 0.015, 8, false);
  const handle = new THREE.Mesh(handleGeo, ceramicMat);
  handle.position.y = 0.04;
  group.add(handle);

  // Steam particles
  const steamGroup = new THREE.Group();
  steamGroup.position.y = 0.38;

  if (CONFIG.animation.enableSteam) {
    const steamCount = CONFIG.animation.steamParticleCount;
    const steamGeo = new THREE.SphereGeometry(0.008, 6, 6);
    const steamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });

    for (let i = 0; i < steamCount; i++) {
      const particle = new THREE.Mesh(steamGeo, steamMat.clone());
      particle.position.set(
        (Math.random() - 0.5) * 0.12,
        Math.random() * 0.15,
        (Math.random() - 0.5) * 0.12
      );
      particle.userData.speed = 0.01 + Math.random() * 0.02;
      particle.userData.offset = Math.random() * Math.PI * 2;
      particle.userData.maxY = 0.08 + Math.random() * 0.12;
      steamGroup.add(particle);
    }
  }
  group.add(steamGroup);

  // Small croissant-like pastry
  const pastryGroup = new THREE.Group();
  const pastryMat = new THREE.MeshPhysicalMaterial({
    color: 0xc8943e,
    roughness: 0.7,
    metalness: 0.0,
  });

  // Body of croissant
  const pastryBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.04, 0.12, 8, 12),
    pastryMat
  );
  pastryBody.rotation.z = Math.PI / 2;
  pastryBody.scale.set(1, 0.7, 0.8);
  pastryGroup.add(pastryBody);

  // Croissant curve
  const pastryEnd1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    pastryMat
  );
  pastryEnd1.position.set(-0.08, -0.005, 0.015);
  pastryEnd1.scale.y = 0.6;
  pastryGroup.add(pastryEnd1);

  const pastryEnd2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 8, 8),
    pastryMat
  );
  pastryEnd2.position.set(0.08, -0.005, 0.015);
  pastryEnd2.scale.y = 0.6;
  pastryGroup.add(pastryEnd2);

  pastryGroup.position.set(-0.28, 0.04, 0.15);
  pastryGroup.rotation.y = 0.4;
  group.add(pastryGroup);

  // Scale and position entire scene
  const scale = CONFIG.arObject.scale;
  group.scale.set(scale.x, scale.y, scale.z);

  const pos = CONFIG.arObject.position;
  group.position.set(pos.x, pos.y, pos.z);

  return { group, steamGroup };
}

// ============================================
// Steam Animation
// ============================================
function animateSteam(steamGroup, time) {
  if (!steamGroup) return;
  steamGroup.children.forEach((particle) => {
    const speed = particle.userData.speed;
    const offset = particle.userData.offset;
    const maxY = particle.userData.maxY;

    particle.position.y += speed * 0.3;
    particle.position.x += Math.sin(time * 2 + offset) * 0.0003;
    particle.position.z += Math.cos(time * 1.5 + offset) * 0.0003;

    // Fade out as it rises
    const progress = particle.position.y / maxY;
    if (particle.material) {
      particle.material.opacity = 0.15 * (1 - progress);
    }

    // Reset particle
    if (particle.position.y > maxY) {
      particle.position.set(
        (Math.random() - 0.5) * 0.12,
        0,
        (Math.random() - 0.5) * 0.12
      );
    }
  });
}

// ============================================
// Load CDN Scripts
// ============================================
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(script);
  });
}

async function loadDependencies() {
  elements.loadingText.textContent = CONFIG.ui.loading;

  // Load Three.js first
  await loadScript('https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js');

  // Load MindAR (image tracking, three.js integration)
  await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js');

  return window.THREE;
}

// ============================================
// AR Session
// ============================================
async function startAR() {
  showScreen('loading');

  try {
    const THREE = await loadDependencies();
    if (!THREE) {
      throw new Error('Three.js not loaded');
    }

    elements.loadingText.textContent = 'در حال راهاندازی دوربین...';

    // Initialize MindAR
    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: elements.arContainer,
      imageTargetSrc: CONFIG.targetPath,
      filterMinCF: CONFIG.mindAR.filterMinCF,
      filterBeta: CONFIG.mindAR.filterBeta,
      missTolerance: CONFIG.mindAR.missTolerance,
      warmupTolerance: CONFIG.mindAR.warmupTolerance,
      uiLoading: 'no',
      uiScanning: 'no',
      uiError: 'no',
    });

    const { renderer, scene, camera } = mindarThree;

    // Configure renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8f0, 1.2);
    dirLight.position.set(2, 4, 3);
    dirLight.castShadow = false;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe8d5b5, 0.4);
    fillLight.position.set(-2, 1, -1);
    scene.add(fillLight);

    // Get anchor
    const anchor = mindarThree.addAnchor(0);

    // Create 3D cafe scene
    cafeScene = createCafeScene(THREE);
    anchor.group.add(cafeScene.group);

    // Tracking events
    anchor.onTargetFound = () => {
      isTracking = true;
      elements.scanningOverlay.classList.remove('active');
      elements.trackingLostOverlay.classList.remove('active');
      elements.ctaButton.classList.add('visible');
    };

    anchor.onTargetLost = () => {
      isTracking = false;
      elements.trackingLostOverlay.classList.add('active');
      elements.ctaButton.classList.remove('visible');
    };

    // Start AR
    elements.loadingText.textContent = 'در حال شروع...';
    await mindarThree.start();

    // Show AR screen
    showScreen('ar');
    elements.scanningOverlay.classList.add('active');

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (cafeScene && isTracking) {
        // Gentle floating
        if (CONFIG.animation.enableFloat) {
          cafeScene.group.position.y = CONFIG.arObject.position.y +
            Math.sin(elapsed * CONFIG.animation.floatSpeed) * CONFIG.animation.floatAmplitude;
        }

        // Subtle rotation
        if (CONFIG.animation.enableRotation) {
          cafeScene.group.rotation.y = CONFIG.arObject.rotation.z +
            Math.sin(elapsed * CONFIG.animation.rotationSpeed) * 0.05;
        }

        // Steam animation
        if (CONFIG.animation.enableSteam) {
          animateSteam(cafeScene.steamGroup, elapsed);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

  } catch (error) {
    console.error('AR Error:', error);

    if (error.name === 'NotAllowedError' || error.message?.includes('Permission')) {
      showError(CONFIG.ui.cameraDenied);
    } else if (error.message?.includes('getUserMedia') || error.message?.includes('not supported')) {
      showError(CONFIG.ui.unsupportedBrowser);
    } else {
      showError(CONFIG.ui.generalError);
    }
  }
}

// ============================================
// Cleanup
// ============================================
function stopAR() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (mindarThree) {
    try {
      mindarThree.stop();
    } catch (e) {
      console.warn('Stop error:', e);
    }
    mindarThree = null;
  }
  cafeScene = null;
  isTracking = false;
}

// ============================================
// Event Listeners
// ============================================
elements.startBtn.addEventListener('click', () => {
  startAR();
});

elements.retryBtn.addEventListener('click', () => {
  stopAR();
  showScreen('landing');
});

// CTA link from config
elements.ctaButton.href = CONFIG.instagramUrl;

// Prevent zoom on double-tap
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

// Log ready
console.log('Pentimento WebAR Ready');
