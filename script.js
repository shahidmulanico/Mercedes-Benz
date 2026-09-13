/**
 * Mercedes-Benz S-Class Flagship Experience
 * 4K Ultra HD Automatic Cinematic Reel (18 FPS Master)
 * + Mercedes Acoustic Sound Experience & Lenis Smooth Scroll Engine
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
  const preloaderEntry = document.getElementById('preloaderEntry');
  const enterExperienceBtn = document.getElementById('enterExperienceBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundStatusText = document.getElementById('soundStatusText');
  const canvas = document.getElementById('cinemaCanvas');
  const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null;
  const storyPanels = document.querySelectorAll('.story-panel');
  const heroSection = document.getElementById('hero');

  // Image Storage & State
  const images = [];
  let loadedCount = 0;
  let isPreloaded = false;
  let hasEntered = false;

  // Cinematic Playback State
  let currentFrame = 0;
  let lastRenderedFrame = -1;
  let isPlaying = false;
  let isCompleted = false;
  let lastTimestamp = 0;
  let animationId = null;

  /* --------------------------------------------------------------------------
     1. Luxury Momentum Smooth Scroll (Lenis Engine)
     -------------------------------------------------------------------------- */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.2,
        infinite: false,
      });

      function lenisRaf(time) {
        lenis.raf(time);
        requestAnimationFrame(lenisRaf);
      }
      requestAnimationFrame(lenisRaf);
    } catch (e) {
      console.warn('Lenis smooth scroll fallback to native:', e);
    }
  }

  /* --------------------------------------------------------------------------
     2. Mercedes-Benz Sound Experience Engine (Web Audio API)
     -------------------------------------------------------------------------- */
  class MercedesSoundEngine {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.isMuted = false;
      this.isPlaying = false;
      this.initialized = false;

      this.engineGain = null;
      this.osc1 = null;
      this.osc2 = null;
      this.noiseNode = null;
      this.filter = null;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.42, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.initialized = true;
      } catch (err) {
        console.warn('Web Audio initialization error:', err);
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Iconic Mercedes Signature 3-Note Chime + Harmonic Bell Resonance
    playWelcomeChime() {
      if (!this.initialized || this.isMuted) return;
      this.resume();
      const t = this.ctx.currentTime;

      // Pure tuned harmonic chord notes: E5 (659Hz) -> G#5 (830Hz) -> B5 (987Hz) + 220Hz sub body
      const chimeNotes = [
        { freq: 220.00, start: 0.00, dur: 2.5, gain: 0.12 },
        { freq: 659.25, start: 0.04, dur: 1.8, gain: 0.22 },
        { freq: 830.61, start: 0.16, dur: 2.0, gain: 0.20 },
        { freq: 987.77, start: 0.32, dur: 2.6, gain: 0.24 },
        { freq: 1318.5, start: 0.44, dur: 2.0, gain: 0.08 }
      ];

      chimeNotes.forEach(({ freq, start, dur, gain }) => {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + start);

        noteGain.gain.setValueAtTime(0.0001, t + start);
        noteGain.gain.exponentialRampToValueAtTime(gain, t + start + 0.03);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(t + start);
        osc.stop(t + start + dur + 0.1);
      });
    }

    // Mercedes S-Class 4.0L Biturbo V8 Engine Ignition & Smooth Cabin Purr
    startEngine() {
      if (!this.initialized || this.isMuted || this.isPlaying) return;
      this.resume();
      const t = this.ctx.currentTime;
      this.isPlaying = true;

      // Master Engine Bus
      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.0001, t);
      this.engineGain.gain.linearRampToValueAtTime(0.28, t + 0.8);
      this.engineGain.connect(this.masterGain);

      // Starter Crank Sweep
      const starter = this.ctx.createOscillator();
      const starterGain = this.ctx.createGain();
      starter.type = 'sawtooth';
      starter.frequency.setValueAtTime(140, t);
      starter.frequency.exponentialRampToValueAtTime(280, t + 0.3);
      starter.frequency.exponentialRampToValueAtTime(75, t + 0.6);
      starterGain.gain.setValueAtTime(0.12, t);
      starterGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
      starter.connect(starterGain);
      starterGain.connect(this.engineGain);
      starter.start(t);
      starter.stop(t + 0.7);

      // Sub-Bass V8 Cylinder Pulse (Osc 1 - 42Hz base)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(38, t);
      this.osc1.frequency.linearRampToValueAtTime(68, t + 0.6); // ignition burst
      this.osc1.frequency.exponentialRampToValueAtTime(44, t + 1.2); // settles into smooth idle

      // Octave Harmonic Texture (Osc 2 - 88Hz)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(76, t);
      this.osc2.frequency.linearRampToValueAtTime(136, t + 0.6);
      this.osc2.frequency.exponentialRampToValueAtTime(88, t + 1.2);

      // Acoustic Muffling Lowpass Filter (S-Class acoustic insulated cabin)
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(260, t);
      this.filter.Q.setValueAtTime(3.2, t);

      // Soft Exhaust Airflow
      const bufferLength = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferLength, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferLength; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(150, t);
      noiseFilter.Q.setValueAtTime(2.0, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, t);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.engineGain);

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.engineGain);

      this.osc1.start(t + 0.15);
      this.osc2.start(t + 0.15);
      this.noiseNode.start(t + 0.15);
    }

    // Modulates engine pitch and exhaust presence with 4K animation progress
    setEngineRPM(progress) {
      if (!this.initialized || !this.isPlaying || !this.osc1 || !this.ctx) return;
      const t = this.ctx.currentTime;
      const targetFreq = 44 + (progress * 26);
      this.osc1.frequency.setTargetAtTime(targetFreq, t, 0.1);
      if (this.osc2) this.osc2.frequency.setTargetAtTime(targetFreq * 2.0, t, 0.1);
      if (this.filter) this.filter.frequency.setTargetAtTime(260 + (progress * 140), t, 0.1);
    }

    fadeEngineToIdle(duration = 1.2) {
      if (!this.engineGain || !this.ctx) return;
      const t = this.ctx.currentTime;
      this.engineGain.gain.linearRampToValueAtTime(0.07, t + duration);
    }

    revEngine() {
      if (!this.initialized || !this.isPlaying || !this.osc1 || !this.ctx) return;
      const t = this.ctx.currentTime;
      if (this.engineGain) {
        this.engineGain.gain.setValueAtTime(0.28, t);
      }
      this.osc1.frequency.setValueAtTime(44, t);
      this.osc1.frequency.linearRampToValueAtTime(70, t + 0.4);
      this.osc1.frequency.exponentialRampToValueAtTime(44, t + 1.2);
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      if (this.masterGain && this.ctx) {
        const t = this.ctx.currentTime;
        this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0001 : 0.42, t + 0.2);
      }
      return !this.isMuted;
    }
  }

  const soundEngine = new MercedesSoundEngine();

  /* --------------------------------------------------------------------------
     3. Preloader & Automatic Entry Orchestrator
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

    if (loadedCount >= TOTAL_FRAMES && !isPreloaded) {
      isPreloaded = true;
      onPreloadComplete();
    }
  }

  function onPreloadComplete() {
    resizeCanvas();
    renderFrame(0);

    // Reveal the "Enter Immersive Experience" prompt with sound indicator
    if (preloaderEntry) {
      preloaderEntry.classList.add('ready');
    }

    // Enable launch from either the button or tapping anywhere on preloader
    if (enterExperienceBtn) {
      enterExperienceBtn.addEventListener('click', enterExperience);
    }
    if (preloader) {
      preloader.addEventListener('click', enterExperience);
    }
  }

  function enterExperience(e) {
    if (e) e.stopPropagation();
    if (hasEntered) return;
    hasEntered = true;

    // Start Mercedes Sound Experience
    soundEngine.init();
    soundEngine.playWelcomeChime();
    soundEngine.startEngine();
    updateSoundUI(true);

    // Fade out preloader
    if (preloader) {
      preloader.classList.add('fade-out');
    }
    document.body.classList.remove('loading');

    // Automatically launch the 4K cinematic reel!
    startCinemaReel();
  }

  /* --------------------------------------------------------------------------
     4. Sound Toggle Header Controls
     -------------------------------------------------------------------------- */
  function updateSoundUI(isActive) {
    if (soundToggleBtn) {
      if (isActive) {
        soundToggleBtn.classList.add('sound-playing');
        soundToggleBtn.classList.remove('sound-muted');
        if (soundStatusText) soundStatusText.textContent = 'SOUND ON';
      } else {
        soundToggleBtn.classList.remove('sound-playing');
        soundToggleBtn.classList.add('sound-muted');
        if (soundStatusText) soundStatusText.textContent = 'SOUND OFF';
      }
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEngine.init();
      const isSoundOn = soundEngine.toggleMute();
      updateSoundUI(isSoundOn);
    });
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
        soundEngine.setEngineRPM(1.0);
        soundEngine.fadeEngineToIdle(1.5);
        isPlaying = false;
        isCompleted = true;
        return;
      }

      renderFrame(currentFrame);
      const progress = currentFrame / (TOTAL_FRAMES - 1);
      updateStoryPanels(progress);
      soundEngine.setEngineRPM(progress);

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
      soundEngine.resume();
      soundEngine.revEngine();
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
