# 🐍 SNAKE — Classic Arcade Edition

Game Snake berbasis web dengan visual neon/cyberpunk, musik retro 8-bit, dan mekanisme terinspirasi Nokia. Dibangun sepenuhnya dengan HTML, CSS, dan JavaScript murni — tanpa framework, tanpa library eksternal.

**[▶ Live Demo](#)** · **[⬇ Download](#cara-deploy)**

---

## Tampilan

```
┌─────────────────────────────┐
│  SCORE   NYAWA   LEVEL  BEST│  ← Stats Bar
├─────────────────────────────┤
│                             │
│   [  area gameplay 20x20  ] │  ← Canvas 400×400px
│                             │
├─────────────────────────────┤
│  ⏸ PAUSE   SPEED:1  🔊  ✕  │  ← Controls Bar
├─────────────────────────────┤
│        ↑                    │
│      ← · →       D-Pad      │  ← Directional Pad
│        ↓                    │
└─────────────────────────────┘
```

---

## Fitur

- 🎮 Gameplay Snake klasik Nokia dengan sistem 5 nyawa
- 🧱 Ular mentok dinding → belok otomatis ke arah random yang valid
- 🍎 Makan apel → tubuh bertambah panjang + skor naik
- 💥 Tabrak diri sendiri → nyawa berkurang 1
- ⚡ Level & kecepatan naik otomatis seiring skor
- 🏆 Best score tersimpan selama sesi
- 🎵 Musik BGM retro 8-bit yang loop otomatis
- 🔊 Efek suara untuk setiap aksi (makan, mati, tombol, pause)
- 🔇 Tombol mute untuk matikan/hidupkan semua audio
- 📱 Responsif — bisa dimainkan di desktop maupun mobile
- ⌨️ Dukungan keyboard (Arrow Keys / WASD)

---

## Cara Deploy

### GitHub Pages (Paling Mudah)

1. Fork atau clone repo ini
2. Pastikan file `index.html` ada di root folder (rename `snake-game.html` jadi `index.html`)
3. Buka **Settings** → **Pages** di repo GitHub kamu
4. Pilih branch `main`, folder `/root`, lalu **Save**
5. Game langsung online di `https://username.github.io/nama-repo`

### Deploy Manual

Cukup buka file `snake-game.html` di browser manapun — tidak perlu server, tidak perlu install apapun.

### Struktur File

```
repo/
├── index.html       ← file utama (rename dari snake-game.html)
└── README.md        ← dokumentasi ini
```

> Seluruh game ada dalam **satu file HTML**. CSS dan JavaScript sudah di-embed langsung di dalamnya.

---

## Cara Main

| Aksi | Kontrol |
|---|---|
| Gerak atas | `↑` / `W` / Tombol ↑ |
| Gerak bawah | `↓` / `S` / Tombol ↓ |
| Gerak kiri | `←` / `A` / Tombol ← |
| Gerak kanan | `→` / `D` / Tombol → |
| Pause / Resume | `Space` / `Esc` / Tombol PAUSE |
| Mute audio | Tombol 🔊 |

**Aturan main:**
- Makan apel merah untuk nambah skor dan panjang badan
- Jangan menabrak diri sendiri — nyawa berkurang 1 setiap kali kena
- Kalau nabrak dinding, ular otomatis belok ke arah lain (tidak mati)
- Game over saat 5 nyawa habis semua

---

## Dokumentasi Teknis

### Teknologi yang Dipakai

| Teknologi | Fungsi |
|---|---|
| HTML5 Canvas API | Render area gameplay |
| Web Audio API | Semua suara dan musik |
| CSS Custom Properties | Sistem warna & tema |
| Google Fonts | Font Orbitron & Share Tech Mono |
| `requestAnimationFrame` | Loop render visual |
| `setTimeout` | Loop logika game (tick) |

---

## Struktur HTML

File ini terdiri dari tiga bagian utama di dalam tag `<body>`:

```
.wrapper
├── .title + .subtitle          ← Judul game
├── .stats-bar                  ← Score, nyawa, level, best
├── .canvas-wrap                ← Area gameplay
│   ├── #gameCanvas             ← Canvas utama (ular, apel, grid)
│   ├── #particleCanvas         ← Canvas partikel (efek ledakan)
│   ├── #menuOverlay            ← Layar menu utama
│   ├── #pauseOverlay           ← Layar pause
│   └── #gameOverOverlay        ← Layar game over
├── .game-controls-bar          ← Tombol pause, mute, keluar
└── .dpad-section               ← Tombol kontrol arah
```

---

## Dokumentasi CSS

### CSS Custom Properties (Variabel Warna)

Semua warna dikelola lewat variabel CSS di `:root`. Kalau mau ganti tema, cukup ubah di sini.

```css
:root {
  --bg:      #0a0e1a;   /* warna background utama (biru tua gelap) */
  --panel:   #0f1628;   /* warna panel/card */
  --border:  #1e2d50;   /* warna border elemen */
  --accent:  #00e5ff;   /* warna aksen cyan (teks, border aktif) */
  --accent2: #39ff14;   /* warna neon hijau (ular kepala, tombol utama) */
  --danger:  #ff2d55;   /* warna merah (bahaya, tombol keluar, apel) */
  --gold:    #ffd700;   /* warna emas (skor, best score) */
  --dim:     #1a2540;   /* warna gelap untuk background tombol D-Pad */
  --text:    #c8deff;   /* warna teks umum */

  /* Preset glow effect untuk text-shadow / box-shadow */
  --glow-green: 0 0 12px #39ff14, 0 0 24px #00c85380;
  --glow-cyan:  0 0 12px #00e5ff, 0 0 24px #00e5ff60;
  --glow-red:   0 0 12px #ff2d55, 0 0 24px #ff2d5560;
}
```

### Komponen CSS Penting

#### `body::before` — Grid Background
Pseudo-element yang membuat efek grid kotak-kotak di background menggunakan `background-image` gradient berlapis. Sepenuhnya dekoratif, `pointer-events: none` supaya tidak mengganggu klik.

#### `@keyframes flicker`
Animasi kedip halus pada judul SNAKE — mensimulasikan lampu neon yang tidak stabil.

```css
@keyframes flicker {
  0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.7}
  94%{opacity:1} 96%{opacity:0.85} 97%{opacity:1}
}
```

#### `.overlay` / `.overlay.active`
Layar overlay (menu, pause, game over) secara default `opacity: 0` dan `pointer-events: none` sehingga tidak terlihat dan tidak bisa diklik. Ketika class `active` ditambahkan, ia menjadi visible dan interaktif.

#### `.dpad-btn.pressed`
State visual saat tombol D-Pad ditekan — ditambahkan via JavaScript pada event `pointerdown` dan dihapus saat `pointerup`.

#### `@keyframes deathFlash`
Animasi flash merah pada canvas saat ular kehilangan nyawa — ditrigger dengan menambah/menghapus class `.flash` pada `.canvas-wrap`.

---

## Dokumentasi JavaScript

### Konstanta Global

```javascript
const COLS = 20;   // jumlah kolom grid
const ROWS = 20;   // jumlah baris grid
const CELL = 20;   // ukuran tiap sel dalam pixel (canvas 400×400)
```

### Variabel State Game

```javascript
let snake;        // array of {x, y} — indeks 0 adalah kepala
let dir;          // arah gerak saat ini {x, y}
let nextDir;      // arah berikutnya (buffered dari input user)
let apple;        // posisi apel {x, y}
let score;        // skor saat ini
let lives;        // nyawa tersisa (mulai dari 5)
let level;        // level saat ini (naik setiap poin tertentu)
let gameRunning;  // boolean — apakah game sedang berjalan
let paused;       // boolean — apakah game sedang dijeda
let animId;       // ID dari requestAnimationFrame (untuk di-cancel)
let tickTimer;    // ID dari setTimeout game tick (untuk di-cancel)
let bestScore;    // best score selama sesi
let particles;    // array partikel efek visual
```

---

## Fungsi-Fungsi JavaScript

### Inisialisasi

#### `initSnake()`
Mereset posisi ular ke tengah grid dengan panjang awal 4 segmen, bergerak ke kanan.

```javascript
function initSnake() {
  const mid = Math.floor(ROWS / 2);
  snake = [
    {x:12, y:mid}, {x:11, y:mid},
    {x:10, y:mid}, {x:9,  y:mid}
  ];
  dir = {x:1, y:0};
  nextDir = {x:1, y:0};
}
```

#### `placeApple()`
Menempatkan apel di posisi acak yang **tidak bertumpuk** dengan badan ular. Menggunakan loop `do...while` untuk memastikan posisi valid.

---

### Kontrol Alur Game

#### `startGame()`
Titik masuk utama saat memulai atau mengulang permainan. Mereset semua state, menyembunyikan overlay, memainkan fanfare, lalu menjalankan `gameTick()` dan `renderLoop()`.

#### `hideAllOverlays()`
Menghapus class `active` dari semua tiga overlay sekaligus (menu, pause, game over).

#### `gameTick()`
**Jantung dari game.** Dipanggil berulang via `setTimeout` dengan interval yang disesuaikan kecepatan. Setiap tick:

1. Terapkan `nextDir` ke `dir`
2. Hitung posisi kepala baru
3. Cek apakah kepala menabrak dinding → belok random
4. Cek apakah kepala menabrak badan sendiri → kurangi nyawa
5. Tambahkan kepala baru ke depan array `snake`
6. Cek apakah kepala ada di posisi apel → tambah skor, spawn partikel, taruh apel baru
7. Kalau tidak makan apel → hapus ekor (`snake.pop()`)
8. Jadwalkan tick berikutnya

```javascript
// Logika wall collision — belok random
const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
if (hitWall) {
  const validDirs = allDirs.filter(d => {
    if (d.x === -dir.x && d.y === -dir.y) return false; // tidak boleh balik
    if (d.x === dir.x  && d.y === dir.y)  return false; // tidak boleh arah sama
    const nx = snake[0].x + d.x;
    const ny = snake[0].y + d.y;
    return nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS; // harus di dalam grid
  });
  // pilih satu secara acak
  const picked = validDirs[Math.floor(Math.random() * validDirs.length)];
  ...
}
```

#### `getSpeed()`
Menghitung interval tick dalam milidetik berdasarkan level. Makin tinggi level, makin cepat.

```javascript
function getSpeed() {
  return Math.max(80, 220 - (level - 1) * 25);
  // Level 1 = 220ms, Level 2 = 195ms, ..., Level 6+ = 80ms (minimum)
}
```

#### `gameOver()`
Dipanggil saat nyawa habis. Menghentikan semua loop, memainkan sfx game over, menampilkan overlay game over dengan skor akhir, dan mengecek apakah ada rekor baru.

#### `togglePause()`
Toggle antara pause dan resume. Saat pause: hentikan `tickTimer` dan BGM, tampilkan overlay pause. Saat resume: jalankan ulang `gameTick()` dan BGM.

#### `quitToMenu()`
Menghentikan game sepenuhnya dan kembali ke layar menu utama.

#### `exitGame()`
Meminta konfirmasi lalu menutup tab dengan `window.close()`.

---

### Rendering

#### `renderLoop()`
Loop visual menggunakan `requestAnimationFrame`. Memanggil `draw()` setiap frame selama game berjalan.

#### `draw()`
Fungsi render utama yang dipanggil tiap frame:
1. Bersihkan canvas dengan `clearRect()`
2. Gambar grid background
3. Gambar apel
4. Gambar ular
5. Gambar partikel (di canvas terpisah)

#### `drawSnake()`
Menggambar setiap segmen ular dengan:
- **Kepala** → warna hijau neon `#39ff14`, glow blur 16px, dua titik mata yang posisinya menyesuaikan arah gerak
- **Badan** → warna di-interpolasi dari hijau terang ke hijau tua seiring jarak dari kepala, menggunakan fungsi `lerpColor()`
- **Setiap segmen** → bentuk rounded rect dengan inner highlight putih transparan

#### `drawApple(ax, ay)`
Menggambar apel dengan:
- Efek pulsing (membesar-mengecil) menggunakan `Math.sin(Date.now())`
- Lingkaran merah dengan glow shadow
- Titik shine putih transparan
- Tangkai hijau dengan kurva `quadraticCurveTo`

#### `idleDraw()`
Loop animasi khusus saat game belum dimulai (di layar menu). Menggambar overlay gelap transparan dengan border yang berpulsa.

---

### Partikel

#### `spawnParticles(gx, gy, color, count)`
Membuat sejumlah partikel di posisi grid `(gx, gy)`. Setiap partikel punya:
- Posisi awal di tengah sel
- Kecepatan ke segala arah (tersebar merata)
- `life` dari 1.0 yang berkurang tiap frame (`decay`)
- Ukuran dan warna

```javascript
particles.push({
  x, y,           // posisi saat ini
  vx, vy,         // kecepatan (pixel per frame)
  life: 1,        // 1.0 = penuh, 0 = hilang
  decay: 0.04,    // seberapa cepat partikel menghilang
  size: 2-5,      // ukuran radius
  color           // warna partikel
});
```

**Dipanggil dengan:**
- Warna emas `#ffd700` saat makan apel (10 partikel)
- Warna merah `#ff2d55` saat kehilangan nyawa (12 partikel)

#### `drawParticles()`
Menggambar dan memperbarui semua partikel aktif di `#particleCanvas` (canvas terpisah di atas game canvas). Partikel yang `life <= 0` otomatis dihapus dari array.

---

### UI Helpers

#### `updateUI()`
Memanggil semua fungsi update UI sekaligus: skor, nyawa, level, best score.

#### `updateScore()`
Memperbarui tampilan skor di stats bar. Juga mengecek dan memperbarui best score jika skor saat ini lebih tinggi.

#### `updateLives()`
Memperbarui tampilan ikon hati (♥). Hati yang sudah hilang mendapat class `.lost` (opacity rendah, tanpa glow).

```javascript
hearts.forEach((h, i) => {
  h.classList.toggle('lost', i >= lives);
  // i=0,1,2,3,4 → jika lives=3, maka i>=3 (index 3 dan 4) dapat class lost
});
```

#### `flashCanvas()`
Memicu animasi flash merah pada border canvas saat ular kehilangan nyawa. Menggunakan trick `void wrap.offsetWidth` untuk me-restart animasi CSS meskipun class yang sama sudah ada.

---

### Kontrol Arah

#### `pressDir(d)` / `releaseDir(d)`
Dipanggil oleh event `pointerdown`/`pointerup` pada tombol D-Pad, dan juga event keyboard. `pressDir` memanggil `sfxDpad()`, `setDir()`, dan menambah class visual `.pressed` pada tombol. `releaseDir` menghapus class `.pressed`.

#### `setDir(d)`
Menerima string arah (`'UP'`, `'DOWN'`, `'LEFT'`, `'RIGHT'`) lalu mengubahnya ke objek vektor `{x, y}`. Satu aturan penting: **tidak bisa balik 180°** — jika ular sedang ke kanan, tidak bisa langsung ke kiri.

```javascript
// Cek arah berlawanan — kalau berlawanan, abaikan input
if (nd.x === -dir.x && nd.y === -dir.y) return;
nextDir = nd;
```

> Perhatikan bahwa input disimpan ke `nextDir`, bukan langsung ke `dir`. Ini mencegah bug di mana pemain menekan dua tombol sebelum satu tick berlangsung.

#### Event Listener Keyboard
Memetakan Arrow Keys dan WASD ke nama arah, lalu memanggil `pressDir()`. `Space` dan `Escape` memanggil `togglePause()`.

---

### Fungsi Utilitas

#### `roundRect(ctx, x, y, w, h, r)`
Fungsi helper untuk menggambar persegi panjang dengan sudut membulat (`border-radius`) di Canvas API — karena Canvas tidak punya method bawaan untuk ini.

```javascript
// Contoh penggunaan:
roundRect(ctx, x+1, y+1, CELL-2, CELL-2, 6);
ctx.fill();
```

#### `lerpColor(c1, c2, t)`
Melakukan interpolasi linear antara dua warna hex. Dipakai untuk gradasi warna badan ular dari hijau terang (kepala) ke hijau tua (ekor).

```javascript
// t = 0.0 → warna c1 penuh
// t = 0.5 → campuran 50/50
// t = 1.0 → warna c2 penuh
lerpColor('#39ff14', '#00703a', i / snake.length)
```

---

## Dokumentasi Audio (Web Audio API)

Seluruh audio dibuat **secara programatik** menggunakan Web Audio API — tidak ada file audio eksternal. Semua suara dihasilkan dari gelombang osilator matematis.

### Inisialisasi Audio

#### `getAudioCtx()`
Membuat `AudioContext` secara lazy (hanya saat pertama kali dipanggil). Ini penting karena browser modern memblokir `AudioContext` yang dibuat sebelum ada interaksi pengguna. Juga me-resume context jika dalam status `suspended`.

```javascript
// Rantai audio:
// OscillatorNode → GainNode (per-suara) → masterGain → AudioContext.destination
```

#### `masterGain`
Node gain global yang mengontrol volume semua suara sekaligus. Volume default `0.35`. Saat mute, di-set ke `0`.

---

### Fungsi Suara Dasar

#### `beep(freq, type, duration, vol, delay, detune)`

Fungsi inti untuk membuat satu nada. Semua SFX dibangun dari kombinasi pemanggilan `beep()`.

| Parameter | Tipe | Keterangan |
|---|---|---|
| `freq` | number | Frekuensi nada dalam Hz |
| `type` | string | Bentuk gelombang: `'square'`, `'sawtooth'`, `'triangle'`, `'sine'` |
| `duration` | number | Durasi suara dalam detik |
| `vol` | number | Volume (0.0 – 1.0) |
| `delay` | number | Jeda sebelum mulai (detik) — opsional, default 0 |
| `detune` | number | Detune dalam cent — opsional, default 0 |

Setiap panggilan `beep()` membuat osilator baru yang otomatis dihancurkan setelah selesai berbunyi.

---

### Sound Effects (SFX)

#### `sfxClick()`
Suara klik pendek untuk tombol menu (MULAI, KELUAR, dll). Dua nada square wave naik cepat.

#### `sfxDpad()`
Tick ringan saat D-Pad ditekan. Lebih pelan dari sfxClick supaya tidak mengganggu saat main.

#### `sfxEat()`
Jingle ascending 4 nada saat ular makan apel. Notasi: C5 → E5 → G5 → C6 (chord mayor naik).

```javascript
const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
notes.forEach((f, i) => beep(f, 'square', 0.10, 0.35, i * 0.06));
// Setiap nada dimulai 60ms setelah nada sebelumnya
```

#### `sfxLoseLife()`
Chord descending sedih menggunakan sawtooth wave (lebih kasar/agresif). 4 nada turun dengan jeda bertingkat — terdengar seperti "uh oh".

```javascript
beep(440, 'sawtooth', 0.25, 0.5);        // nada pertama langsung
beep(349, 'sawtooth', 0.25, 0.5, 0.08);  // 80ms kemudian
beep(277, 'sawtooth', 0.30, 0.5, 0.18);  // 180ms kemudian
beep(220, 'sawtooth', 0.35, 0.5, 0.30);  // 300ms kemudian
```

#### `sfxGameOver()`
Suara dramatik panjang. Osilator sawtooth dengan frekuensi yang di-ramp turun dari 330Hz ke 60Hz selama 1.2 detik, plus dua beep berat di bawahnya.

#### `sfxPauseOn()`
Dua nada turun — menandakan game "berhenti".

#### `sfxPauseOff()`
Tiga nada naik — menandakan game "mulai lagi". Kebalikan dari `sfxPauseOn`.

#### `sfxStart()`
Fanfare ascending 6 nada saat memulai game baru. Rentang C4 sampai D5.

---

### Background Music (BGM)

BGM adalah sistem sequencer sederhana yang menjadwalkan nada-nada ke `AudioContext` timeline di masa depan, lalu me-loop dirinya sendiri.

#### Konstanta BGM

```javascript
const BGM_BPM  = 160;              // tempo (beats per minute)
const BGM_BEAT = 60 / BGM_BPM;    // durasi 1 beat dalam detik = 0.375 detik
```

#### Pola Nada

BGM terdiri dari tiga layer yang berbunyi bersamaan:

| Layer | Instrumen | Tipe Gelombang | Volume | Keterangan |
|---|---|---|---|---|
| `BGM_MELODY` | Melodi utama | `square` | 0.22 | 8 bar, C mayor pentatonik |
| `BGM_BASS` | Bass | `triangle` | 0.18 | 8 bar, satu nada per beat |
| `BGM_ARP` | Arpeggio | `square` | 0.10 | 32 nada, 1/4 beat each |

Setiap pola didefinisikan sebagai array `[frekuensi, jumlah_beat]`:

```javascript
const BGM_MELODY = [
  [N.C5, 0.5], [N.E5, 0.5], [N.G5, 0.5], [N.C6, 0.5], // bar 1
  [N.G5, 0.5], [N.E5, 0.5], [N.C5, 1.0],               // bar 2
  // ... dst
];
```

Objek `N` adalah peta nama nada ke frekuensi (dalam Hz):
```javascript
const N = { C4:261.6, D4:293.7, E4:329.6, ..., C6:1046.5 };
```

#### `schedulePattern(pattern, type, vol, startTime)`
Menjadwalkan semua nada dalam sebuah pola ke `AudioContext` timeline. Setiap nada menggunakan envelope sederhana: volume konstan lalu fade ke 0 di 95% durasi.

#### `startBGM()`
Memulai loop BGM. Menjadwalkan satu siklus penuh, lalu setelah durasi siklus (dikurangi 80ms buffer), memanggil dirinya sendiri lagi untuk siklus berikutnya.

```javascript
function loop() {
  if (!musicPlaying) return;
  // jadwalkan semua layer
  schedulePattern(BGM_MELODY, 'square',   0.22, now);
  schedulePattern(BGM_BASS,   'triangle', 0.18, now);
  schedulePattern(BGM_ARP,    'square',   0.10, now);
  // panggil lagi setelah satu siklus selesai
  bgmTimeout = setTimeout(loop, melodyDur * 1000 - 80);
}
```

#### `stopBGM()`
Menghentikan loop BGM dengan mengeset `musicPlaying = false` dan membatalkan `bgmTimeout`. Nada yang sudah dijadwalkan akan tetap berbunyi hingga selesai secara natural.

---

### `toggleMute()`

Mengatur status mute/unmute:
- **Mute** → `masterGain.gain.value = 0`, stop BGM, icon jadi 🔇
- **Unmute** → `masterGain.gain.value = 0.35`, resume BGM jika game sedang berjalan, icon jadi 🔊

---

## Catatan Pengembangan

**Kenapa dua canvas?**
`#gameCanvas` (grid, ular, apel) dan `#particleCanvas` (efek ledakan) dipisah supaya partikel bisa di-clear dan di-render tanpa mengganggu render game utama.

**Kenapa `nextDir` dan bukan langsung `dir`?**
Buffering input ke `nextDir` mencegah bug di mana pemain menekan dua tombol sangat cepat dalam satu frame dan ularnya bisa "balik badan" secara tidak langsung.

**Kenapa audio tidak pakai file MP3/WAV?**
Supaya game sepenuhnya self-contained dalam satu file HTML. Tidak ada aset eksternal selain font Google. Ini juga memungkinkan game berjalan offline.

**Kenapa `AudioContext` dibuat lazy?**
Browser modern (Chrome, Firefox, dll) menerapkan kebijakan autoplay — `AudioContext` tidak boleh dibuat atau di-resume sebelum ada interaksi pengguna (klik/tap). Dengan membuat `AudioContext` di dalam `getAudioCtx()` yang dipanggil pertama kali saat user menekan tombol, kita memastikan tidak ada error autoplay.

---

## Kompatibilitas Browser

| Browser | Status |
|---|---|
| Chrome / Edge | ✅ Penuh |
| Firefox | ✅ Penuh |
| Safari | ✅ Penuh |
| Mobile Chrome | ✅ Penuh |
| Mobile Safari | ✅ Penuh |

> Web Audio API dan Canvas 2D sudah didukung semua browser modern sejak 2015.

---

## Lisensi

MIT License — bebas dipakai, dimodifikasi, dan didistribusikan.
