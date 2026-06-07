// ══════════════════════════════════════════════
// ── AUDIO ENGINE (Web Audio API) ──
// ══════════════════════════════════════════════
let audioCtx = null;
let musicNodes = {};   // holds ongoing music oscillators
let musicPlaying = false;
let masterGain = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.35;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// ── Generic beep helper ──
function beep(freq, type, duration, vol, delay=0, detune=0) {
  const ac = getAudioCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain); gain.connect(masterGain);
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  const start = ac.currentTime + delay;
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.01);
}

// ── SFX: Button click (short blip) ──
function sfxClick() {
  beep(880, 'square', 0.07, 0.4);
  beep(1100, 'square', 0.05, 0.2, 0.04);
}

// ── SFX: D-pad press (softer tick) ──
function sfxDpad() {
  beep(660, 'square', 0.05, 0.3);
}

// ── SFX: Eat apple (ascending jingle) ──
function sfxEat() {
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((f, i) => beep(f, 'square', 0.10, 0.35, i*0.06));
}

// ── SFX: Lose life (descending sad chord) ──
function sfxLoseLife() {
  beep(440,  'sawtooth', 0.25, 0.5);
  beep(349,  'sawtooth', 0.25, 0.5, 0.08);
  beep(277,  'sawtooth', 0.30, 0.5, 0.18);
  beep(220,  'sawtooth', 0.35, 0.5, 0.30);
}

// ── SFX: Game over (long deep descent) ──
function sfxGameOver() {
  const ac = getAudioCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain); gain.connect(masterGain);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(330, ac.currentTime);
  osc.frequency.linearRampToValueAtTime(60, ac.currentTime + 1.2);
  gain.gain.setValueAtTime(0.5, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 1.4);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 1.5);
  // Noise burst
  beep(180, 'square', 0.3, 0.3, 0.1);
  beep(120, 'square', 0.5, 0.3, 0.2);
}

// ── SFX: Pause on ──
function sfxPauseOn() {
  beep(800, 'square', 0.08, 0.35);
  beep(600, 'square', 0.08, 0.35, 0.09);
}

// ── SFX: Pause off (resume) ──
function sfxPauseOff() {
  beep(600, 'square', 0.08, 0.35);
  beep(800, 'square', 0.08, 0.35, 0.09);
  beep(1000,'square', 0.08, 0.35, 0.18);
}

// ── SFX: Start game fanfare ──
function sfxStart() {
  const melody = [262,330,392,523,659,784];
  melody.forEach((f,i) => beep(f, 'square', 0.12, 0.4, i*0.07));
}

// ══════════════════════════════════════════════
// ── RETRO BGM ──
// A simple looping 8-bit style melody using
// scheduled oscillators with a sequencer loop.
// ══════════════════════════════════════════════

// Melody: C major pentatonic retro tune (note, duration in beats)
const BGM_BPM  = 160;
const BGM_BEAT = 60 / BGM_BPM; // seconds per beat

// Note frequency map
const N = {
  _:0,
  C4:261.6, D4:293.7, E4:329.6, F4:349.2, G4:392, A4:440, B4:493.9,
  C5:523.3, D5:587.3, E5:659.3, F5:698.5, G5:784, A5:880, B5:987.8,
  C6:1046.5
};

// Melody pattern  [freq, beats]
const BGM_MELODY = [
  [N.C5,0.5],[N.E5,0.5],[N.G5,0.5],[N.C6,0.5],
  [N.G5,0.5],[N.E5,0.5],[N.C5,1.0],
  [N.D5,0.5],[N.F5,0.5],[N.A5,0.5],[N.F5,0.5],
  [N.E5,0.5],[N.C5,0.5],[N.D5,1.0],
  [N.E5,0.5],[N.G5,0.5],[N.C6,0.5],[N.G5,0.5],
  [N.E5,0.5],[N.D5,0.5],[N.C5,1.0],
  [N.G4,0.5],[N.A4,0.5],[N.C5,0.5],[N.E5,0.5],
  [N.D5,0.5],[N.C5,0.5],[N.G4,1.0],
];

// Bass pattern [freq, beats]
const BGM_BASS = [
  [N.C4,1],[N.C4,1],[N.D4,1],[N.D4,1],
  [N.E4,1],[N.E4,1],[N.C4,1],[N.C4,1],
];

// Arpeggio pattern [freq, beats]
const BGM_ARP = [
  [N.C5,0.25],[N.E5,0.25],[N.G5,0.25],[N.E5,0.25],
  [N.C5,0.25],[N.G4,0.25],[N.E4,0.25],[N.G4,0.25],
  [N.D5,0.25],[N.F5,0.25],[N.A5,0.25],[N.F5,0.25],
  [N.D5,0.25],[N.A4,0.25],[N.F4,0.25],[N.A4,0.25],
  [N.E5,0.25],[N.G5,0.25],[N.C6,0.25],[N.G5,0.25],
  [N.E5,0.25],[N.C5,0.25],[N.G4,0.25],[N.C5,0.25],
  [N.G4,0.25],[N.B4,0.25],[N.D5,0.25],[N.B4,0.25],
  [N.G4,0.25],[N.D4,0.25],[N.B3,0.25],[N.D4,0.25],
];

let bgmTimeout = null;

function schedulePattern(pattern, type, vol, startTime, loopDuration) {
  const ac = getAudioCtx();
  let t = startTime;
  for (const [freq, beats] of pattern) {
    const dur = beats * BGM_BEAT;
    if (freq > 0) {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain); gain.connect(masterGain);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.setValueAtTime(vol * 0.7, t + dur * 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95);
      osc.start(t);
      osc.stop(t + dur);
    }
    t += dur;
  }
  return t - startTime; // actual duration used
}

function startBGM() {
  if (musicPlaying) return;
  if (muted) return;
  musicPlaying = true;
  getAudioCtx();

  function loop() {
    if (!musicPlaying) return;
    const ac = getAudioCtx();
    const now = ac.currentTime;
    const melodyDur = BGM_MELODY.reduce((s,[,b])=>s+b*BGM_BEAT, 0);
    schedulePattern(BGM_MELODY, 'square',   0.22, now);
    schedulePattern(BGM_BASS,   'triangle', 0.18, now);
    schedulePattern(BGM_ARP,    'square',   0.10, now);
    bgmTimeout = setTimeout(loop, melodyDur * 1000 - 80);
  }
  loop();
}

function stopBGM() {
  musicPlaying = false;
  if (bgmTimeout) { clearTimeout(bgmTimeout); bgmTimeout = null; }
}

// ══════════════════════════════════════════════
// ── CONFIG ──
const COLS = 20, ROWS = 20;
const CELL = 20; // px on canvas (400x400)

// ── STATE ──
let snake, dir, nextDir, apple, score, lives, gameRunning, paused, animId, tickTimer;
let bestScore = 0;
let level = 1;
let particles = [];

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pCanvas = document.getElementById('particleCanvas');
const pCtx = pCanvas.getContext('2d');

// ── INIT ──
function initSnake() {
  const mid = Math.floor(ROWS/2);
  snake = [
    {x:12, y:mid},
    {x:11, y:mid},
    {x:10, y:mid},
    {x:9,  y:mid},
  ];
  dir = {x:1, y:0};
  nextDir = {x:1, y:0};
}

function placeApple() {
  let pos;
  do {
    pos = {x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS)};
  } while (snake.some(s => s.x===pos.x && s.y===pos.y));
  apple = pos;
}

function startGame() {
  score = 0; lives = 5; level = 1;
  particles = [];
  initSnake();
  placeApple();
  gameRunning = true;
  paused = false;
  updateUI();
  hideAllOverlays();
  document.getElementById('pauseBtn').textContent = '⏸ PAUSE';
  document.getElementById('pauseBtn').classList.remove('paused');
  document.getElementById('speedDisplay').textContent = 'SPEED: 1';
  clearTimeout(tickTimer);
  cancelAnimationFrame(animId);
  sfxStart();
  stopBGM();
  setTimeout(() => startBGM(), 550);
  gameTick();
  renderLoop();
}

function hideAllOverlays() {
  ['menuOverlay','pauseOverlay','gameOverOverlay'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
}

// ── GAME LOOP ──
function getSpeed() {
  // speed increases every 5 apples
  return Math.max(80, 220 - (level-1)*25);
}

function gameTick() {
  if (!gameRunning || paused) return;

  dir = nextDir;
  let head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

  // Wall collision → auto-turn random (not backward)
  const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
  if (hitWall) {
    // All 4 possible directions
    const allDirs = [
      {x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}
    ];
    // Filter: not backward, and not the wall-hitting direction itself
    const validDirs = allDirs.filter(d => {
      // Not reverse of current
      if (d.x === -dir.x && d.y === -dir.y) return false;
      // Not the same wall-hitting direction
      if (d.x === dir.x && d.y === dir.y) return false;
      // The resulting cell must be inside the grid
      const nx = snake[0].x + d.x;
      const ny = snake[0].y + d.y;
      return nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS;
    });

    if (validDirs.length > 0) {
      // Pick a random valid direction
      const picked = validDirs[Math.floor(Math.random() * validDirs.length)];
      dir = picked;
      nextDir = picked;
      head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    } else {
      // Nowhere to go — treat as self-hit (extremely rare corner case)
      lives--;
      updateLives();
      flashCanvas();
      sfxLoseLife();
      spawnParticles(snake[0].x, snake[0].y, '#ff2d55', 12);
      if (lives <= 0) { gameOver(); return; }
      initSnake();
      tickTimer = setTimeout(gameTick, getSpeed());
      return;
    }
  }

  // Self collision check
  const hitSelf = snake.some(s => s.x===head.x && s.y===head.y);
  if (hitSelf) {
    lives--;
    updateLives();
    flashCanvas();
    sfxLoseLife();
    spawnParticles(snake[0].x, snake[0].y, '#ff2d55', 12);
    if (lives <= 0) {
      gameOver();
      return;
    }
    // Reset snake position after losing life
    initSnake();
    tickTimer = setTimeout(gameTick, getSpeed());
    return;
  }

  snake.unshift(head);

  // Eat apple
  if (head.x === apple.x && head.y === apple.y) {
    score += 10 * level;
    updateScore();
    sfxEat();
    spawnParticles(apple.x, apple.y, '#ffd700', 10);
    // Level up every 5 apples
    const totalApples = Math.floor(score / (10 * level));
    if (score > 0 && score % (50) === 0) {
      level = Math.min(level + 1, 8);
      document.getElementById('levelDisplay').textContent = level;
      document.getElementById('speedDisplay').textContent = `SPEED: ${level}`;
    }
    placeApple();
  } else {
    snake.pop();
  }

  tickTimer = setTimeout(gameTick, getSpeed());
}

function gameOver() {
  gameRunning = false;
  cancelAnimationFrame(animId);
  stopBGM();
  sfxGameOver();
  if (score > bestScore) {
    bestScore = score;
    document.getElementById('newBestRow').style.display = 'flex';
  } else {
    document.getElementById('newBestRow').style.display = 'none';
  }
  document.getElementById('finalScore').textContent = score;
  document.getElementById('gameOverSub').textContent = 'NYAWA HABIS';
  document.getElementById('bestDisplay').textContent = bestScore;
  setTimeout(() => {
    document.getElementById('gameOverOverlay').classList.add('active');
  }, 600);
  // Final render
  draw();
}

function togglePause() {
  if (!gameRunning) return;
  paused = !paused;
  const btn = document.getElementById('pauseBtn');
  if (paused) {
    sfxPauseOn();
    stopBGM();
    btn.textContent = '▶ PLAY';
    btn.classList.add('paused');
    document.getElementById('pauseOverlay').classList.add('active');
    clearTimeout(tickTimer);
  } else {
    sfxPauseOff();
    startBGM();
    btn.textContent = '⏸ PAUSE';
    btn.classList.remove('paused');
    document.getElementById('pauseOverlay').classList.remove('active');
    gameTick();
  }
}

function quitToMenu() {
  gameRunning = false; paused = false;
  clearTimeout(tickTimer);
  cancelAnimationFrame(animId);
  stopBGM();
  sfxClick();
  hideAllOverlays();
  document.getElementById('menuOverlay').classList.add('active');
  document.getElementById('pauseBtn').textContent = '⏸ PAUSE';
  document.getElementById('pauseBtn').classList.remove('paused');
}

function exitGame() {
  // Close tab or show message
  const confirmed = confirm('Keluar dari game?');
  if (confirmed) window.close();
}

// ── MUTE ──
let muted = false;
function toggleMute() {
  muted = !muted;
  const btn = document.getElementById('muteBtn');
  if (muted) {
    if (masterGain) masterGain.gain.value = 0;
    btn.textContent = '🔇';
    btn.classList.add('muted');
    stopBGM();
  } else {
    if (masterGain) masterGain.gain.value = 0.35;
    btn.textContent = '🔊';
    btn.classList.remove('muted');
    if (gameRunning && !paused) startBGM();
  }
}

// ── RENDER ──
function renderLoop() {
  if (!gameRunning) return;
  draw();
  animId = requestAnimationFrame(renderLoop);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background grid
  ctx.strokeStyle = 'rgba(30,45,80,0.5)';
  ctx.lineWidth = 0.5;
  for (let x=0; x<=COLS; x++) {
    ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,canvas.height); ctx.stroke();
  }
  for (let y=0; y<=ROWS; y++) {
    ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(canvas.width,y*CELL); ctx.stroke();
  }

  // Apple
  drawApple(apple.x, apple.y);

  // Snake
  drawSnake();

  // Particles
  drawParticles();
}

function drawSnake() {
  snake.forEach((seg, i) => {
    const x = seg.x * CELL, y = seg.y * CELL;
    const r = i === 0 ? 6 : 4;
    const color = i === 0 ? '#39ff14' : lerpColor('#39ff14', '#00703a', i / snake.length);

    // Glow
    if (i === 0) {
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#39ff14';
    } else {
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00c853';
    }

    ctx.fillStyle = color;
    roundRect(ctx, x+1, y+1, CELL-2, CELL-2, r);
    ctx.fill();

    // Inner highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    roundRect(ctx, x+3, y+3, CELL-8, CELL-8, 3);
    ctx.fill();

    // Head eyes
    if (i === 0) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#060c1a';
      const ex = dir.x===0 ? 4 : (dir.x>0 ? CELL-6 : 3);
      const ey = dir.y===0 ? 4 : (dir.y>0 ? CELL-6 : 3);
      const ex2 = dir.x===0 ? CELL-7 : ex;
      const ey2 = dir.y===0 ? CELL-7 : ey;
      ctx.beginPath(); ctx.arc(x+ex, y+ey, 2.5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x+ex2, y+ey2, 2.5, 0, Math.PI*2); ctx.fill();
    }
  });
  ctx.shadowBlur = 0;
}

function drawApple(ax, ay) {
  const x = ax*CELL + CELL/2, y = ay*CELL + CELL/2;
  const t = Date.now() / 300;
  const pulse = 1 + 0.1*Math.sin(t);

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pulse, pulse);

  // Glow
  ctx.shadowBlur = 18;
  ctx.shadowColor = '#ff2d55';

  // Body
  ctx.fillStyle = '#ff2d55';
  ctx.beginPath();
  ctx.arc(0, 1, CELL/2 - 3, 0, Math.PI*2);
  ctx.fill();

  // Shine
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.arc(-2, -2, 3, 0, Math.PI*2);
  ctx.fill();

  // Stem
  ctx.strokeStyle = '#00c853';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 6; ctx.shadowColor = '#39ff14';
  ctx.beginPath();
  ctx.moveTo(0, -CELL/2+3);
  ctx.quadraticCurveTo(4, -CELL/2-2, 4, -CELL/2+4);
  ctx.stroke();

  ctx.restore();
}

// ── PARTICLES ──
function spawnParticles(gx, gy, color, count) {
  const cx = gx*CELL + CELL/2;
  const cy = gy*CELL + CELL/2;
  for (let i=0; i<count; i++) {
    const angle = (Math.PI*2/count)*i + Math.random()*0.5;
    const speed = 1.5 + Math.random()*2.5;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      life: 1, decay: 0.04 + Math.random()*0.03,
      size: 2 + Math.random()*3,
      color
    });
  }
}

function drawParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    pCtx.save();
    pCtx.globalAlpha = p.life;
    pCtx.fillStyle = p.color;
    pCtx.shadowBlur = 8;
    pCtx.shadowColor = p.color;
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
    pCtx.fill();
    pCtx.restore();
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= p.decay;
  }
}

// ── UI HELPERS ──
function updateUI() {
  updateScore();
  updateLives();
  document.getElementById('levelDisplay').textContent = level;
  document.getElementById('bestDisplay').textContent = bestScore;
}

function updateScore() {
  document.getElementById('scoreDisplay').textContent = score;
  if (score > bestScore) bestScore = score;
  document.getElementById('bestDisplay').textContent = bestScore;
}

function updateLives() {
  const hearts = document.querySelectorAll('#livesDisplay .heart');
  hearts.forEach((h, i) => {
    h.classList.toggle('lost', i >= lives);
  });
}

function flashCanvas() {
  const wrap = document.getElementById('canvasWrap');
  wrap.classList.remove('flash');
  void wrap.offsetWidth;
  wrap.classList.add('flash');
  setTimeout(() => wrap.classList.remove('flash'), 400);
}

// ── DIRECTION ──
function pressDir(d) {
  if (!gameRunning || paused) return;
  sfxDpad();
  setDir(d);
  const el = document.getElementById(`btn-${d.toLowerCase()}`);
  if (el) el.classList.add('pressed');
}
function releaseDir(d) {
  const el = document.getElementById(`btn-${d.toLowerCase()}`);
  if (el) el.classList.remove('pressed');
}

function setDir(d) {
  const map = {
    UP:    {x:0,  y:-1},
    DOWN:  {x:0,  y:1},
    LEFT:  {x:-1, y:0},
    RIGHT: {x:1,  y:0},
  };
  const nd = map[d];
  // Prevent 180° reversal
  if (nd.x === -dir.x && nd.y === -dir.y) return;
  nextDir = nd;
}

// Keyboard
document.addEventListener('keydown', e => {
  const map = {
    ArrowUp:'UP', ArrowDown:'DOWN', ArrowLeft:'LEFT', ArrowRight:'RIGHT',
    w:'UP', s:'DOWN', a:'LEFT', d:'RIGHT',
    W:'UP', S:'DOWN', A:'LEFT', D:'RIGHT',
  };
  if (map[e.key]) {
    e.preventDefault();
    pressDir(map[e.key]);
  }
  if (e.key === ' ' || e.key === 'Escape') { sfxClick(); togglePause(); }
});
document.addEventListener('keyup', e => {
  const map = {
    ArrowUp:'UP', ArrowDown:'DOWN', ArrowLeft:'LEFT', ArrowRight:'RIGHT',
    w:'UP', s:'DOWN', a:'LEFT', d:'RIGHT',
    W:'UP', S:'DOWN', A:'LEFT', D:'RIGHT',
  };
  if (map[e.key]) releaseDir(map[e.key]);
});

// ── UTILS ──
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function lerpColor(c1, c2, t) {
  const h2d = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const [r1,g1,b1] = h2d(c1), [r2,g2,b2] = h2d(c2);
  const r = Math.round(r1+(r2-r1)*t);
  const g = Math.round(g1+(g2-g1)*t);
  const b = Math.round(b1+(b2-b1)*t);
  return `rgb(${r},${g},${b})`;
}

// ── IDLE ANIMATION ──
function idleDraw() {
  if (gameRunning) return;
  draw();

  ctx.save();
  // Draw a static snake preview
  ctx.fillStyle = 'rgba(6,12,26,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pulsing border
  const t = Date.now()/1000;
  ctx.strokeStyle = `rgba(0,229,255,${0.3+0.2*Math.sin(t*2)})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, canvas.width-4, canvas.height-4);
  ctx.restore();

  animId = requestAnimationFrame(idleDraw);
}

// Start idle
idleDraw();