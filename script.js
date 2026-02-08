/* ============================================================
   SHREK SCREEN UI ENGINE
   Cinematic Ogre UI • Swamp FX • Smooth Animation • Fun Mode
   ============================================================ */

// -----------------------------
// CONFIG
// -----------------------------

const CONFIG = {
    fpsTarget: 360,
    debug: true,
    shrekMode: true,
    swampFog: true,
    parallax: true,
    floatingOnions: true,
    voiceLines: true
};

// -----------------------------
// GLOBAL STATE
// -----------------------------

const STATE = {
    width: window.innerWidth,
    height: window.innerHeight,
    frame: 0,
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    fps: 0,
    time: Date.now(),
    ogreMood: "happy"
};

// -----------------------------
// UTILITY
// -----------------------------

const Utils = {
    rand(min, max) {
        return Math.random() * (max - min) + min;
    },
    clamp(v, min, max) {
        return Math.min(Math.max(v, min), max);
    },
    lerp(a, b, t) {
        return a + (b - a) * t;
    },
    log(...msg) {
        if (CONFIG.debug) console.log("[SHREK]", ...msg);
    }
};

// -----------------------------
// CANVAS ENGINE
// -----------------------------

const Canvas = {
    el: null,
    ctx: null,

    init() {
        this.el = document.createElement("canvas");
        document.body.appendChild(this.el);
        this.ctx = this.el.getContext("2d");
        this.resize();

        window.addEventListener("resize", () => this.resize());
    },

    resize() {
        this.el.width = window.innerWidth;
        this.el.height = window.innerHeight;
        STATE.width = this.el.width;
        STATE.height = this.el.height;
    },

    clear() {
        this.ctx.fillStyle = "#0f2a16"; // swamp green
        this.ctx.fillRect(0, 0, this.el.width, this.el.height);
    }
};

// -----------------------------
// SHREK THEME ENGINE
// -----------------------------

const ShrekTheme = {
    apply() {
        document.documentElement.style.setProperty("--bg", "#0f2a16");
        document.documentElement.style.setProperty("--accent", "#6aff6a");
        document.documentElement.style.setProperty("--text", "#ffffff");

        document.body.style.margin = 0;
        document.body.style.background = "#0f2a16";
        document.body.style.overflow = "hidden";
        document.body.style.fontFamily = "Impact, Arial";
    }
};

// -----------------------------
// PERFORMANCE MONITOR
// -----------------------------

const Performance = {
    frames: 0,
    last: performance.now(),

    update() {
        this.frames++;
        const now = performance.now();
        if (now - this.last >= 1000) {
            STATE.fps = this.frames;
            this.frames = 0;
            this.last = now;
        }
    }
};

// -----------------------------
// SHREK CHARACTER SPRITE
// -----------------------------

const Shrek = {
    x: STATE.width / 2,
    y: STATE.height / 2,
    scale: 1,
    bounce: 0,

    update() {
        this.x = Utils.lerp(this.x, STATE.mouse.x - 100, 0.05);
        this.y = Utils.lerp(this.y, STATE.mouse.y - 120, 0.05);
        this.bounce = Math.sin(STATE.frame * 0.05) * 10;
    },

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y + this.bounce);
        ctx.scale(this.scale, this.scale);

        // Head
        ctx.fillStyle = "#6aff6a";
        ctx.beginPath();
        ctx.arc(100, 100, 70, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = "#5bd65b";
        ctx.fillRect(10, 80, 40, 30);
        ctx.fillRect(150, 80, 40, 30);

        // Eyes
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(80, 90, 12, 0, Math.PI * 2);
        ctx.arc(120, 90, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(80, 90, 5, 0, Math.PI * 2);
        ctx.arc(120, 90, 5, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(100, 120, 30, 0, Math.PI);
        ctx.stroke();

        ctx.restore();
    }
};

// -----------------------------
// FLOATING ONIONS 🍃
// -----------------------------

const Onions = Array.from({ length: 40 }).map(() => ({
    x: Utils.rand(0, window.innerWidth),
    y: Utils.rand(0, window.innerHeight),
    size: Utils.rand(6, 16),
    speed: Utils.rand(0.3, 1.2)
}));

function drawOnions(ctx) {
    ctx.fillStyle = "#b7ffb7";
    Onions.forEach(o => {
        o.y -= o.speed;
        if (o.y < -20) o.y = STATE.height + 20;

        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// -----------------------------
// SWAMP FOG EFFECT
// -----------------------------

function drawFog(ctx) {
    const gradient = ctx.createRadialGradient(
        STATE.width / 2,
        STATE.height / 2,
        100,
        STATE.width / 2,
        STATE.height / 2,
        STATE.width
    );

    gradient.addColorStop(0, "rgba(30,80,40,0.0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.6)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, STATE.width, STATE.height);
}

// -----------------------------
// TEXT UI
// -----------------------------

function drawHUD(ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Impact";
    ctx.fillText("🟢 SHREK MODE ACTIVE", 20, 40);
    ctx.fillText(`FPS: ${STATE.fps}`, 20, 70);
    ctx.fillText("Layers are like onions.", 20, 100);
}

// -----------------------------
// VOICE LINES (OPTIONAL)
// -----------------------------

const ShrekQuotes = [
    "What are you doing in my swamp?",
    "Ogres have layers!",
    "Better out than in!",
    "This is the part where you run."
];

function playShrekQuote() {
    if (!CONFIG.voiceLines) return;
    const msg = new SpeechSynthesisUtterance(
        ShrekQuotes[Math.floor(Math.random() * ShrekQuotes.length)]
    );
    msg.pitch = 0.6;
    msg.rate = 0.9;
    speechSynthesis.speak(msg);
}

// -----------------------------
// INPUT HANDLING (DESKTOP + MOBILE)
// -----------------------------

function updateMousePosition(x, y) {
    STATE.mouse.x = x;
    STATE.mouse.y = y;
}

// Mouse
window.addEventListener("mousemove", e => {
    updateMousePosition(e.clientX, e.clientY);
});

// Click / Tap
window.addEventListener("click", playShrekQuote);
window.addEventListener("touchstart", playShrekQuote);

// Touch
window.addEventListener("touchmove", e => {
    const touch = e.touches[0];
    if (touch) updateMousePosition(touch.clientX, touch.clientY);
});

// -----------------------------
// MAIN LOOP
// -----------------------------

function loop() {
    STATE.frame++;
    Performance.update();

    Canvas.clear();

    if (CONFIG.floatingOnions) drawOnions(Canvas.ctx);

    Shrek.update();
    Shrek.draw(Canvas.ctx);

    if (CONFIG.swampFog) drawFog(Canvas.ctx);

    drawHUD(Canvas.ctx);

    requestAnimationFrame(loop);
}

// -----------------------------
// INIT
// -----------------------------

function init() {
    Canvas.init();
    ShrekTheme.apply();
    loop();
}

init();
