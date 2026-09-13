/**
 * Mercedes-Benz S-Class Flagship Experience
 * 4K Ultra HD Automatic Cinematic Reel (18 FPS Master)
 */

(() => {
  'use strict';

  const TOTAL_FRAMES = 237;
  const FRAME_DIR = 'mm';
  const FRAME_EXT = '.jpg';
  const TARGET_FPS = 18;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  // DOM Elements
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const canvas = document.getElementById('cinemaCanvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const storyPanels = document.querySelectorAll('.story-panel');
  const heroSection = document.getElementById('hero');

  // Image Storage & State
  const images = [];
  let loadedCount = 0;
  let isLoaded = false;

  // Cinematic Playback State
  let currentFrame = 0;
  let lastRenderedFrame = -1;
  let isPlaying = false;
  let isCompleted = false;
  let lastTimestamp = 0;
  let animationId = null;

  /* --------------------------------------------------------------------------
     1. Preloader (Loads all 237 frames into memory)
     -------------------------------------------------------------------------- */
  function preloadImages() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedNum = String(i).padStart(4, '0');
      img.src = `${FRAME_DIR}/${paddedNum}${FRAME_EXT}`;

      if (img.complete && img.naturalWidth > 0) {
        onImageLoaded();
      } else {
        img.onload = () => onImageLoaded();
        img.onerror = () => {
          console.warn(`Frame ${paddedNum} load error`);
          onImageLoaded();
        };
      }

      images.push(img);
    }
  }

  function onImageLoaded() {
    loadedCount++;
    const percent = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
    
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${percent}%`;

    if (loadedCount >= TOTAL_FRAMES && !isLoaded) {
      isLoaded = true;
      setTimeout(onPreloadComplete, 300);
    }
  }

  function onPreloadComplete() {
    if (preloader) preloader.classList.add('fade-out');
    document.body.classList.remove('loading');

    resizeCanvas();
    renderFrame(0);
    // Automatically launch the 4K cinematic reel!
    startCinemaReel();
  }

  /* --------------------------------------------------------------------------
     2. 4K Ultra HD Responsive Canvas Rendering
     -------------------------------------------------------------------------- */
  function resizeCanvas() {
    const screenDpr = Math.max(window.devicePixelRatio || 1, 2);
    canvas.width = Math.min(3840, Math.round(window.innerWidth * screenDpr));
    canvas.height = Math.min(2160, Math.round(window.innerHeight * screenDpr));

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    const safeIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrame)));
    if (images[safeIdx]) {
      drawCarImage(images[safeIdx]);
    }
  }

  function drawCarImage(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;

    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const renderW = imgWidth * scale;
    const renderH = imgHeight * scale;
    const offsetX = (canvasWidth - renderW) / 2;
    const offsetY = (canvasHeight - renderH) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }

  function renderFrame(index) {
    const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    const img = images[safeIndex];
    if (img) {
      drawCarImage(img);
      lastRenderedFrame = safeIndex;
    }
  }

  /* --------------------------------------------------------------------------
     3. Automatic Cinema Playback Engine (Runs at 18 FPS)
     -------------------------------------------------------------------------- */
  function startCinemaReel() {
    if (animationId) cancelAnimationFrame(animationId);
    currentFrame = 0;
    isPlaying = true;
    isCompleted = false;
    lastTimestamp = 0;

    renderFrame(0);
    updateStoryPanels(0);
    animationId = requestAnimationFrame(cinemaTick);
  }

  function cinemaTick(timestamp) {
    if (!isPlaying) return;

    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;

    if (elapsed >= FRAME_INTERVAL) {
      currentFrame++;

      if (currentFrame >= TOTAL_FRAMES - 1) {
        currentFrame = TOTAL_FRAMES - 1;
        renderFrame(currentFrame);
        updateStoryPanels(1.0);
        isPlaying = false;
        isCompleted = true;
        return;
      }

      renderFrame(currentFrame);
      const progress = currentFrame / (TOTAL_FRAMES - 1);
      updateStoryPanels(progress);

      lastTimestamp = timestamp - (elapsed % FRAME_INTERVAL);
    }

    animationId = requestAnimationFrame(cinemaTick);
  }

  function updateStoryPanels(progress) {
    storyPanels.forEach(panel => {
      const range = panel.getAttribute('data-range');
      if (!range) return;

      const [min, max] = range.split(',').map(Number);
      if (progress >= min && progress <= max) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  // Click on hero background to replay cinema reel when finished
  if (heroSection) {
    heroSection.addEventListener('click', (e) => {
      if (e.target.closest('a, button, input, select')) return;
      if (isCompleted || !isPlaying) {
        startCinemaReel();
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. User's Atmosphere Console & VIP Form Handlers (From code.html)
     -------------------------------------------------------------------------- */
  window.setAtmosphere = function(mode) {
    const name = document.getElementById('atmosphere-name');
    const temp = document.getElementById('atmosphere-temp');
    const icon = document.getElementById('atmosphere-icon');
    const colorName = document.getElementById('atmosphere-color-name');
    const acoustic = document.getElementById('atmosphere-acoustic');
    const air = document.getElementById('atmosphere-air');
    const lightStrip = document.getElementById('light-strip');

    const btnCarmine = document.getElementById('btn-carmine');
    const btnSilver = document.getElementById('btn-silver');
    const btnObsidian = document.getElementById('btn-obsidian');

    [btnCarmine, btnSilver, btnObsidian].forEach(btn => {
      if (btn) {
        btn.className = 'px-space-md py-2 rounded-full font-label-caps text-label-caps uppercase tracking-wider transition-all bg-surface-container-high text-secondary-fixed hover:text-white flex items-center gap-2';
      }
    });

    if (mode === 'carmine') {
      if (btnCarmine) btnCarmine.className = 'px-space-md py-2 rounded-full font-label-caps text-label-caps uppercase tracking-wider transition-all bg-primary-container text-white shadow-lg flex items-center gap-2';
      if (name) name.innerText = 'Carmine Dusk Protocol';
      if (temp) temp.innerText = '2700K Warmth · Fragrance #04';
      if (icon) icon.innerText = 'wb_twilight';
      if (colorName) colorName.innerText = 'Deep Rubellite & Ruby';
      if (acoustic) acoustic.innerText = 'Spatial 4D Orchestral';
      if (air) air.innerText = 'Forest Wood & Amber';
      if (lightStrip) lightStrip.className = 'h-full w-full bg-gradient-to-r from-[#9b111e] via-[#ffb3af] to-[#9b111e] animate-pulse duration-1000';
    } else if (mode === 'silver') {
      if (btnSilver) btnSilver.className = 'px-space-md py-2 rounded-full font-label-caps text-label-caps uppercase tracking-wider transition-all bg-secondary-container text-white shadow-lg flex items-center gap-2';
      if (name) name.innerText = 'Starlight Silver Sanctuary';
      if (temp) temp.innerText = '4500K Crystalline · Fragrance #02';
      if (icon) icon.innerText = 'flare';
      if (colorName) colorName.innerText = 'Platinum Ice & White Specular';
      if (acoustic) acoustic.innerText = 'Studio Acoustic Natural';
      if (air) air.innerText = 'Alpine Crisp Citrus & Linen';
      if (lightStrip) lightStrip.className = 'h-full w-full bg-gradient-to-r from-[#dfe3e6] via-[#ffffff] to-[#dfe3e6] animate-pulse duration-1000';
    } else if (mode === 'obsidian') {
      if (btnObsidian) btnObsidian.className = 'px-space-md py-2 rounded-full font-label-caps text-label-caps uppercase tracking-wider transition-all bg-[#2a2a2c] text-white shadow-lg flex items-center gap-2';
      if (name) name.innerText = 'Obsidian Midnight Glow';
      if (temp) temp.innerText = '1800K Low Emittance · Silent Ion';
      if (icon) icon.innerText = 'dark_mode';
      if (colorName) colorName.innerText = 'Subdued Smoked Charcoal';
      if (acoustic) acoustic.innerText = 'Active Noise Cancellation Zenith';
      if (air) air.innerText = 'Bamboo Purified Negative Ions';
      if (lightStrip) lightStrip.className = 'h-full w-full bg-gradient-to-r from-[#353437] via-[#5a403f] to-[#353437] animate-pulse duration-1000';
    }
  };

  window.handleInquirySubmit = function() {
    const btn = document.getElementById('submit-btn');
    if (btn) {
      btn.innerText = 'Invitation Request Transmitted';
      btn.classList.add('bg-primary-container', 'text-white');
      setTimeout(() => {
        btn.innerText = 'Concierge Follow-up Scheduled';
      }, 1500);
    }
  };

  /* --------------------------------------------------------------------------
     5. Event Listeners & Boot
     -------------------------------------------------------------------------- */
  window.addEventListener('resize', resizeCanvas);
  preloadImages();

})();
