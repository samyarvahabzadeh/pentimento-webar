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
  arScene: document.getElementById('ar-scene'),
  arTarget: document.getElementById('ar-target'),
  
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

  // 3. Configure A-Frame Scene with target path
  try {
    updateDebugConsole('Initializing MindAR scene parameters...', false);
    const targetPath = CONFIG.targetPath;
    
    // Set dynamic properties on the a-scene element
    elements.arScene.setAttribute('mindar-image', 
      `imageTargetSrc: ${targetPath}; autoStart: false; uiLoading: no; uiScanning: no;`
    );

    // Show AR overlay screens
    showScreen('ar');
    elements.scanningOverlay.classList.add('active');
    
    updateDebugConsole('Starting A-Frame AR System...', false);
    
    // Make sure a-scene is loaded
    if (elements.arScene.hasLoaded) {
      startARSystem();
    } else {
      elements.arScene.addEventListener('loaded', startARSystem);
    }

  } catch (err) {
    console.error('AR initialization failed:', err);
    showError(CONFIG.ui.generalError, err.message);
  }
}

function startARSystem() {
  try {
    const arSystem = elements.arScene.systems['mindar-image-system'];
    if (!arSystem) {
      throw new Error('mindar-image-system not found on a-scene');
    }
    
    arSystem.start();
    updateDebugConsole('MindAR engine started successfully', false);

    // Setup Target Event Listeners
    if (elements.arTarget) {
      elements.arTarget.addEventListener('targetFound', () => {
        elements.scanningOverlay.classList.remove('active');
        elements.trackingLostOverlay.classList.remove('active');
        elements.ctaButton.classList.add('visible');
        updateDebugConsole('Target Found', false);
      });

      elements.arTarget.addEventListener('targetLost', () => {
        elements.trackingLostOverlay.classList.add('active');
        elements.ctaButton.classList.remove('visible');
        updateDebugConsole('Target Lost', false);
      });
    }

  } catch (err) {
    console.error('Failed to start MindAR system:', err);
    showError(CONFIG.ui.generalError, `System start failure: ${err.message}`);
  }
}

// ============================================
// Event Listeners
// ============================================
elements.startBtn.addEventListener('click', () => {
  initializeAR();
});

elements.retryBtn.addEventListener('click', () => {
  // Reload the page to reset all systems completely
  window.location.reload();
});

// Set Instagram link
elements.ctaButton.href = CONFIG.instagramUrl;

// Prevent pinch-zooming / touch behaviors
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

console.log('Pentimento WebAR A-Frame main script loaded');
