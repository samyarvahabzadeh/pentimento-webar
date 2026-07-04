import { CONFIG } from './config.js';

// ============================================
// Pentimento WebAR - Main A-Frame Application
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
  arSceneWrapper: document.getElementById('ar-scene-wrapper'),
  
  // Debug Elements
  debugPanel: document.getElementById('debug-panel'),
  debugBase: document.getElementById('debug-base'),
  debugSecure: document.getElementById('debug-secure'),
  debugDevices: document.getElementById('debug-devices'),
  debugGetUserMedia: document.getElementById('debug-getusermedia'),
  debugAFrame: document.getElementById('debug-aframe'),
  debugMindAR: document.getElementById('debug-mindar'),
  debugTarget: document.getElementById('debug-target'),
  debugStatus: document.getElementById('debug-status'),
  closeDebugBtn: document.getElementById('close-debug-btn'),
};

// ============================================
// Debug Console Helper
// ============================================
function updateDebugConsole(statusMsg, isError = false) {
  try {
    elements.debugBase.textContent = import.meta.env.BASE_URL || '/';
    elements.debugSecure.textContent = window.isSecureContext ? 'Yes (Secure)' : 'No (Not Secure)';
    elements.debugDevices.textContent = navigator.mediaDevices ? 'Yes' : 'No';
    elements.debugGetUserMedia.textContent = (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ? 'Yes' : 'No';
    elements.debugAFrame.textContent = (typeof AFRAME !== 'undefined') ? `Yes (${AFRAME.version})` : 'No';
    elements.debugMindAR.textContent = (window.MINDAR && window.MINDAR.IMAGE) ? 'Yes' : 'No';
    elements.debugTarget.textContent = CONFIG.targetPath;

    if (statusMsg) {
      elements.debugStatus.textContent = statusMsg;
      if (isError) {
        elements.debugStatus.className = 'status-error';
      } else {
        elements.debugStatus.className = 'status-ok';
      }
    }
  } catch (e) {
    console.error('Debug console update error:', e);
  }
}

// Close debug panel click
if (elements.closeDebugBtn) {
  elements.closeDebugBtn.addEventListener('click', () => {
    elements.debugPanel.style.display = 'none';
  });
}

// Initialize debug display
updateDebugConsole('Page loaded. Waiting for start...', false);

// ============================================
// Screen Management
// ============================================
function showScreen(screenName) {
  Object.keys(screens).forEach(key => {
    screens[key].classList.remove('active');
  });
  if (screens[screenName]) {
    screens[screenName].classList.add('active');
  }
}

function showError(message, techInfo = '') {
  elements.errorText.innerHTML = `${message}<br><small style="font-size: 0.75rem; opacity: 0.7;">${techInfo}</small>`;
  updateDebugConsole(techInfo || message, true);
  showScreen('error');
}

// ============================================
// Camera Permission & AR Initialization
// ============================================
async function initializeAR() {
  showScreen('loading');
  elements.loadingText.textContent = CONFIG.ui.loading;
  updateDebugConsole('Checking media devices permissions...', false);

  // 1. Verify Browser Support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    let techInfo = 'Devices API not supported';
    if (!window.isSecureContext && !isLocal) {
      techInfo = 'Not a secure context (HTTPS required)';
      showError(CONFIG.ui.unsupportedBrowser, 'مرورگر یا آدرس فعلی اجازه دسترسی به دوربین نمی‌دهد. سایت باید حتماً روی HTTPS باز شود.');
    } else {
      showError(CONFIG.ui.unsupportedBrowser, 'مرورگر یا دستگاه شما از وب‌کم پشتیبانی نمی‌کند.');
    }
    return;
  }

  // 2. Request Camera Permission Directly
  let testStream = null;
  try {
    updateDebugConsole('Invoking getUserMedia...', false);
    testStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });
    
    updateDebugConsole('Camera permission granted, stopping test stream...', false);
    // Stop the stream immediately to free camera for MindAR
    testStream.getTracks().forEach(track => track.stop());
  } catch (err) {
    console.error('Camera permission request failed:', err);
    showError(CONFIG.ui.cameraDenied, `${err.name}: ${err.message}`);
    return;
  }

  // 3. Inject A-Frame Scene dynamically with targets/card.mind
  try {
    updateDebugConsole('Injecting A-Frame scene markup...', false);
    const targetPath = CONFIG.targetPath;
    
    // Inject the entire A-Frame markup.
    // Setting autoStart: true is secure here because it's executed within user-click callback stack
    const sceneHTML = `
      <a-scene id="ar-scene" mindar-image="imageTargetSrc: ${targetPath}; autoStart: true; uiLoading: no; uiScanning: no;" color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

        <a-entity mindar-image-target="targetIndex: 0" id="ar-target">
          <!-- Cafe Scene -->
          <a-entity id="cafe-scene-container" rotation="90 0 0" position="0 0 0">
            <!-- Saucer -->
            <a-cylinder color="#eee8dc" height="0.02" radius="0.4" position="0 0.01 0"></a-cylinder>
            <a-torus color="#c9a96e" radius="0.38" radius-tubular="0.005" rotation="90 0 0" position="0 0.022 0"></a-torus>

            <!-- Cup Body -->
            <a-cylinder color="#f5f0e8" height="0.25" radius="0.16" position="0 0.13 0" material="roughness: 0.3; metalness: 0;"></a-cylinder>
            <a-torus color="#c9a96e" radius="0.16" radius-tubular="0.005" rotation="90 0 0" position="0 0.256 0"></a-torus>

            <!-- Coffee Liquid -->
            <a-cylinder color="#3c1e0a" height="0.01" radius="0.155" position="0 0.24 0"></a-cylinder>
            <a-circle color="#d4b896" radius="0.04" rotation="-90 0 0" position="0 0.242 0"></a-circle>

            <!-- Handle -->
            <a-torus color="#f5f0e8" radius="0.08" radius-tubular="0.015" arc="180" rotation="0 0 -90" position="0.16 0.13 0"></a-torus>

            <!-- Pastry (Croissant style) -->
            <a-entity position="-0.26 0.02 0.15" rotation="0 40 0">
              <a-cylinder color="#c8943e" radius="0.04" height="0.12" rotation="0 0 90"></a-cylinder>
              <a-sphere color="#c8943e" radius="0.025" position="-0.08 0 0.015" scale="1 0.6 1"></a-sphere>
              <a-sphere color="#c8943e" radius="0.025" position="0.08 0 0.015" scale="1 0.6 1"></a-sphere>
            </a-entity>

            <!-- Steam Particles -->
            <a-entity id="steam-container">
              <a-sphere color="#ffffff" radius="0.008" opacity="0.15" position="-0.02 0.26 0.01" animation="property: position; to: -0.01 0.41 0.02; dur: 2500; loop: true; easing: linear;"></a-sphere>
              <a-sphere color="#ffffff" radius="0.008" opacity="0.15" position="0.02 0.26 -0.01" animation="property: position; to: 0.01 0.38 -0.02; dur: 2000; loop: true; easing: linear;"></a-sphere>
              <a-sphere color="#ffffff" radius="0.008" opacity="0.15" position="0 0.28 0" animation="property: position; to: 0 0.44 0.01; dur: 3000; loop: true; easing: linear;"></a-sphere>
            </a-entity>
          </a-entity>
        </a-entity>
      </a-scene>
    `;
    
    // Show AR screen FIRST to ensure container has valid dimensions when A-Frame parses it
    showScreen('ar');
    elements.scanningOverlay.classList.add('active');
    
    // Inject scene wrapper
    elements.arSceneWrapper.innerHTML = sceneHTML;
    
    // Retrieve references to injected elements
    const arScene = document.getElementById('ar-scene');
    const arTarget = document.getElementById('ar-target');
    
    updateDebugConsole('A-Frame DOM injected. Monitoring initialization...', false);

    // Setup Target Event Listeners on the injected element
    if (arTarget) {
      arTarget.addEventListener('targetFound', () => {
        elements.scanningOverlay.classList.remove('active');
        elements.trackingLostOverlay.classList.remove('active');
        elements.ctaButton.classList.add('visible');
        updateDebugConsole('Target Found', false);
      });

      arTarget.addEventListener('targetLost', () => {
        elements.trackingLostOverlay.classList.add('active');
        elements.ctaButton.classList.remove('visible');
        updateDebugConsole('Target Lost', false);
      });
    }

    // Monitor A-Frame loaded state
    if (arScene.hasLoaded) {
      updateDebugConsole('MindAR A-Frame system initialized (cached)', false);
    } else {
      arScene.addEventListener('loaded', () => {
        updateDebugConsole('MindAR A-Frame system initialized (loaded)', false);
      });
    }

    // Capture A-Frame scene errors
    arScene.addEventListener('arError', (event) => {
      console.error('AR System Error event:', event);
      showError(CONFIG.ui.generalError, `AR System Error: ${event.detail.error}`);
    });

  } catch (err) {
    console.error('AR initialization failed:', err);
    showError(CONFIG.ui.generalError, err.message);
  }
}

// ============================================
// Event Listeners
// ============================================
elements.startBtn.addEventListener('click', () => {
  initializeAR();
});

elements.retryBtn.addEventListener('click', () => {
  window.location.reload();
});

// Set Instagram link
elements.ctaButton.href = CONFIG.instagramUrl;

// Prevent pinch-zooming / touch behaviors
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

console.log('Pentimento WebAR A-Frame main script loaded');
