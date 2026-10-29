document.addEventListener("DOMContentLoaded", () => {
    // ✏️ EDIT THIS: personalise everything here
    const CONFIG = {
        name: "Beautiful",
        skyName: "Iman",   // Taaron Ka Naam wale section mein ye naam likha jayega
        from: "With all my love ❤️",
        countdownFrom: 10,
        cardFront: "Happy Birthday!",
        cardMessage: "Wishing you a day full of laughter, love and everything that makes you smile.",
        letter: "Today is all about you, your smile, your happiness, and all the beautiful things that make you special. May this new year of your life bring you peace, laughter, success, and countless reasons to smile.",
        signature: "With love, always ✨",
        // Apni photos isi folder mein rakho (photo1.jpg ...). Na milen to 📷 placeholder dikhega
        photos: [
            { src: "photo1.jpeg", caption: "Ainda itni dor nahi jana 🌎" },
            { src: "photo2.jpeg", caption: "Meri favourite Cheez is duniya ki 😊" },
            { src: "photo3.jpeg", caption: "Woh pyara din 💕" }
        ],
        timeline: [
            { date: "Pehli mulaqat", text: "Us din mujhe pata nahi tha ke ap itni khaas ban jaen gin." },
            { date: "Pehli baat", text: "Woh apka gussa k apko inform nahi kiya class ka." },
            { date: "Sab se pyari yaad", text: "Sab Wo Din Jab Ap Hansti Hain." },
            { date: "Aaj", text: "Aur aaj Apka din hai, Apki khushi sab se upar." }
        ],
        coupons: ["1 Free Dinner 🍽️", "1 Long Hug 🤗", "1 Movie Night 🎬"],
        lockEnabled: false,                             // true = 8 Nov tak lock, false = timer band (testing ke liye)
        unlockDate: new Date(2026, 10, 8, 0, 0, 0),   // 8 Nov 2026, raat 12 baje (mahina 0 se shuru: 10 = November)
        birthDate: "",                                  // optional, jaise "2002-11-08" (khali chhodo to counter nahi dikhega)
        whatsapp: "",                                   // optional, jaise "923001234567" (wish aap ko WhatsApp par aayegi)
        scratchPrize: "Surprise! Aaj ka din Apka hai, jo chahein maangein 🎁",
        balloons: [
            "Apki smile mere din ki sab se achi cheez hai 😊",
            "Ap bohot alag aur khaas hain 💖",
            "Apke saath har pal yaadgar hai ✨",
            "Ap is duniya ki meri sab se pyari cheez hain 🌍",
            "Aaj sirf Apki khushi ka din hai 🎉",
            "Ap jaisa koi nahi 💕"
        ],
        reasons: [
            "Your smile makes any day better",
            "You care about people so deeply",
            "You make ordinary moments special"
        ]
    };

    const $ = id => document.getElementById(id);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const rand = (a, b) => a + Math.random() * (b - a);

    const bg = $("background-music");
    const clap = $("clapping-sound");
    const video = $("birthday-video");
    const knife = $("knife");
    const cakeTop = document.querySelector(".cake-top");
    const sections = [...document.querySelectorAll(".section")];
    const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

    let started = false, musicOn = true;

    // ---------- Personalise ----------
    document.querySelectorAll("[data-name]").forEach(el => (el.textContent = CONFIG.name));
    $("card-front-text").textContent = CONFIG.cardFront;
    $("card-message").textContent = CONFIG.cardMessage;
    $("card-from").textContent = CONFIG.from;
    $("letter-text").textContent = CONFIG.letter;
    CONFIG.photos.forEach((p, i) => {
        const fig = document.createElement("figure");
        fig.className = "polaroid";
        fig.style.setProperty("--r", [-6, 4, -3, 7][i % 4] + "deg");
        const img = new Image();
        img.alt = p.caption;
        img.src = p.src;
        img.addEventListener("error", () => {
            const ph = document.createElement("div");
            ph.className = "photo-ph";
            ph.textContent = "📷";
            img.replaceWith(ph);
        });
        const cap = document.createElement("figcaption");
        cap.textContent = p.caption;
        fig.append(img, cap);
        fig.addEventListener("click", () => fig.classList.toggle("zoom"));
        $("gallery").appendChild(fig);
    });
    CONFIG.timeline.forEach((t, i) => {
        const li = document.createElement("li"), b = document.createElement("b"), s = document.createElement("span");
        li.style.setProperty("--i", i);
        b.textContent = t.date;
        s.textContent = t.text;
        li.append(b, s);
        $("timeline").appendChild(li);
    });
    function buildCoupons() {
        $("coupons").innerHTML = "";
        CONFIG.coupons.forEach((text, i) => {
            const b = document.createElement("button");
            b.className = "coupon";
            b.style.setProperty("--i", CONFIG.reasons.length + i);
            b.textContent = "🎟️ " + text + " (tap to redeem)";
            b.addEventListener("click", () => {
                b.classList.add("used");
                b.textContent = "✔ " + text + " (redeemed)";
            });
            $("coupons").appendChild(b);
        });
    }
    buildCoupons();
    $("letter-signature").textContent = CONFIG.signature;
    CONFIG.reasons.forEach((text, i) => {
        const li = document.createElement("li");
        li.style.setProperty("--i", i);
        li.textContent = text;
        $("reasons").appendChild(li);
    });

    // ---------- Helpers ----------
    function showSection(id) {
        sections.forEach(s => s.classList.toggle("active", s.id === id));
        window.scrollTo(0, 0);
        if (id === "sky-section") startSky();
        if (id !== "video-section" && video) video.pause();
        if (id === "video-section") bg.pause();
        else if (started) playMusic();
    }

    function playMusic() {
        if (musicOn && bg) bg.play().catch(() => {});
    }

    function fillHearts() {
        const box = $("hearts");
        for (let i = 0; i < 14; i++) {
            const h = document.createElement("span");
            h.textContent = ["💗", "💖", "✨", "💕"][i % 4];
            h.style.cssText = `left:${rand(0, 100)}%;font-size:${rand(14, 28)}px;animation-duration:${rand(9, 18)}s;animation-delay:${-rand(0, 18)}s`;
            box.appendChild(h);
        }
        for (let i = 0; i < 6; i++) {   // udte hue lanterns
            const l = document.createElement("span");
            l.className = "lantern";
            l.textContent = "🏮";
            l.style.cssText = `left:${rand(3, 95)}%;font-size:${rand(26, 40)}px;animation-duration:${rand(20, 32)}s;animation-delay:${-rand(0, 30)}s`;
            box.appendChild(l);
        }
    }

    function clearCelebration() {
        $("confetti-container").innerHTML = "";
        $("fireworks-container").innerHTML = "";
        document.body.classList.remove("celebrating");
    }

    function celebrate() {
        clearCelebration();
        document.body.classList.add("celebrating");

        const confetti = $("confetti-container");
        for (let i = 0; i < 80; i++) {
            const p = document.createElement("span");
            p.className = "confetti";
            p.style.cssText = `left:${rand(0, 100)}%;background:hsl(${rand(300, 360)},100%,${rand(60, 80)}%);--fall-duration:${rand(3, 6)}s;animation-delay:${rand(0, 3)}s`;
            confetti.appendChild(p);
        }

        const fw = $("fireworks-container");
        for (let b = 0; b < 6; b++) {
            const x = rand(10, 90), y = rand(10, 60), delay = b * 0.35;
            for (let i = 0; i < 14; i++) {
                const a = (i / 14) * Math.PI * 2, d = rand(60, 140);
                const p = document.createElement("span");
                p.className = "firework";
                p.style.cssText = `left:${x}%;top:${y}%;color:hsl(${rand(300, 360)},100%,70%);background:currentColor;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;animation-delay:${delay}s`;
                fw.appendChild(p);
            }
        }
    }

    // ---------- Lock: unlockDate tak sirf counter ----------
    // Waqt phone ki ghari se nahi, hosting server ki ghari se liya jata hai (phone ka time badalne se lock nahi khulta)
    let lockTimer, clockBase = Date.now(), clockPerf = performance.now();
    const trueNow = () => clockBase + (performance.now() - clockPerf);
    async function syncClock() {
        try {
            const r = await fetch(location.href.split("#")[0], { method: "HEAD", cache: "no-store" });
            const t = new Date(r.headers.get("Date")).getTime();
            if (t) { clockBase = t; clockPerf = performance.now(); }
        } catch (e) { /* offline ya file:// ho to phone ki ghari use hogi */ }
    }
    function tickLock() {
        const ms = CONFIG.unlockDate.getTime() - trueNow();
        if (!CONFIG.lockEnabled || ms <= 0) {
            $("lock-screen").classList.add("hidden");
            clearInterval(lockTimer);
            return;
        }
        const s = Math.floor(ms / 1000), pad = n => String(n).padStart(2, "0");
        $("lk-d").textContent = Math.floor(s / 86400);
        $("lk-h").textContent = pad(Math.floor((s % 86400) / 3600));
        $("lk-m").textContent = pad(Math.floor((s % 3600) / 60));
        $("lk-s").textContent = pad(s % 60);
    }
    (async () => {
        if (CONFIG.lockEnabled) await syncClock();   // pehle sahi waqt lo, phir lock check karo
        tickLock();
        lockTimer = setInterval(tickLock, 1000);
    })();

    // ---------- Touch trail ----------
    let lastTrail = 0;
    function trail(x, y) {
        const now = Date.now();
        if (now - lastTrail < 45) return;
        lastTrail = now;
        const t = document.createElement("span");
        t.className = "trail";
        t.textContent = ["💖", "✨", "💗", "⭐"][Math.floor(Math.random() * 4)];
        t.style.left = x + "px";
        t.style.top = y + "px";
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 900);
    }
    document.addEventListener("pointermove", e => trail(e.clientX, e.clientY));
    document.addEventListener("touchmove", e => { const t = e.touches[0]; if (t) trail(t.clientX, t.clientY); }, { passive: true });

    function shootingStar() {
        const s = document.createElement("div");
        s.style.cssText = "position:fixed;z-index:500;width:160px;height:3px;border-radius:3px;pointer-events:none;" +
            "background:linear-gradient(90deg,#fff,#ffd1ec 40%,rgba(255,255,255,0));" +
            "box-shadow:0 0 12px #fff,0 0 24px #ff4fa3;";
        const dx = -Math.min(innerWidth * 0.7, 460), dy = -dx * 0.7;   // neeche left ki taraf, screen ke andar hi
        s.style.left = rand(innerWidth * 0.5, innerWidth * 0.95) + "px";
        s.style.top = rand(innerHeight * 0.03, innerHeight * 0.35) + "px";
        document.body.appendChild(s);
        const a = s.animate([
            { transform: "translate(0,0) rotate(-35deg)", opacity: 1 },
            { transform: `translate(${dx}px,${dy}px) rotate(-35deg)`, opacity: 0 }
        ], { duration: 1400, easing: "ease-out" });
        a.onfinish = () => s.remove();
    }

    // Wish jar se taara upar aasman ki taraf udta hai (peeche chamakti trail ke saath)
    function wishStarFly() {
        const j = document.querySelector(".jar").getBoundingClientRect();
        const x0 = j.left + j.width / 2, y0 = j.top + j.height * 0.25;
        const x1 = Math.min(innerWidth - 30, Math.max(30, x0 + rand(-70, 70))), y1 = -60;
        const star = document.createElement("div");
        star.textContent = "⭐";
        star.style.cssText = "position:fixed;left:0;top:0;z-index:500;font-size:38px;line-height:1;pointer-events:none;" +
            "filter:drop-shadow(0 0 10px #ffd166) drop-shadow(0 0 24px #ff4fa3);";
        document.body.appendChild(star);
        const tf = (x, y, sc, rot) => `translate(${x}px,${y}px) translate(-50%,-50%) scale(${sc}) rotate(${rot}deg)`;
        const anim = star.animate([
            { transform: tf(x0, y0, 0.6, 0), opacity: 1 },
            { transform: tf((x0 + x1) / 2 + 40, (y0 + y1) / 2, 1.4, 360), opacity: 1, offset: 0.6 },
            { transform: tf(x1, y1, 0.5, 720), opacity: 0.9 }
        ], { duration: 2400, easing: "ease-in" });
        const trailTimer = setInterval(() => {
            const r = star.getBoundingClientRect();
            trail(r.left + r.width / 2, r.top + r.height / 2);
        }, 50);
        anim.onfinish = () => { clearInterval(trailTimer); star.remove(); };
    }

    // ---------- Candles: mic se phoonk ----------
    const CAKE_HINT = $("cake-instruction").textContent;
    let candlesOut = false;
    function putOutCandles() {
        if (candlesOut) return;
        candlesOut = true;
        document.querySelectorAll(".flame").forEach(f => f.classList.add("out"));
        $("blow-button").classList.add("hidden");
        $("cake-instruction").textContent = "Wish ho gayi! Ab knife par tap karke cake kaato 🎂";
    }
    function resetCandles() {
        candlesOut = false;
        document.querySelectorAll(".flame").forEach(f => f.classList.remove("out"));
        const b = $("blow-button");
        b.classList.remove("hidden");
        b.disabled = false;
        b.textContent = "Phoonk Maaro 🎤";
        $("cake-instruction").textContent = CAKE_HINT;
    }
    async function listenForBlow() {
        const btn = $("blow-button");
        btn.disabled = true;
        btn.textContent = "Ab phoonk maaro... 🎤";
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const an = ctx.createAnalyser();
            an.fftSize = 512;
            ctx.createMediaStreamSource(stream).connect(an);
            const buf = new Uint8Array(an.fftSize);
            let hits = 0;
            const stop = () => { stream.getTracks().forEach(t => t.stop()); ctx.close(); };
            (function loop() {
                if (candlesOut) { stop(); return; }
                an.getByteTimeDomainData(buf);
                let sum = 0;
                for (const v of buf) { const x = (v - 128) / 128; sum += x * x; }
                hits = Math.sqrt(sum / buf.length) > 0.1 ? hits + 1 : Math.max(0, hits - 1);
                if (hits >= 14) { putOutCandles(); stop(); return; }
                requestAnimationFrame(loop);
            })();
        } catch (e) {
            btn.disabled = false;
            btn.textContent = "Phoonk Maaro 🎤";
            $("cake-instruction").textContent = "Mic nahi chala. Candles par tap karke bujha do 🕯️";
        }
    }
    on(document.querySelector(".candles"), "click", putOutCandles);
    on($("blow-button"), "click", listenForBlow);

    // ---------- Balloons ----------
    const BALLOON_COLORS = ["#ff4fa3", "#a855f7", "#ffd166", "#38bdf8", "#34d399", "#fb7185"];
    function buildBalloons() {
        const box = $("balloons");
        box.innerHTML = "";
        let popped = 0;
        $("balloon-msg").textContent = "Har balloon mein ek baat chhupi hai 💌";
        $("balloon-next").classList.add("hidden");
        CONFIG.balloons.forEach((msg, i) => {
            const b = document.createElement("button");
            b.className = "balloon";
            b.setAttribute("aria-label", "Balloon phoro");
            b.style.cssText = `--c:${BALLOON_COLORS[i % 6]};--i:${i}`;
            b.addEventListener("click", () => {
                b.classList.add("pop");
                setTimeout(() => b.classList.add("gone"), 250);
                $("balloon-msg").textContent = msg;
                if (++popped === CONFIG.balloons.length) $("balloon-next").classList.remove("hidden");
            });
            box.appendChild(b);
        });
    }
    buildBalloons();

    // ---------- Scratch card ----------
    const sc = $("scratch-canvas"), sg = sc.getContext("2d");
    let scratching = false;
    function initScratch() {
        $("scratch-prize").textContent = CONFIG.scratchPrize;
        sc.parentElement.classList.remove("done");
        $("scratch-next").classList.add("hidden");
        sg.globalCompositeOperation = "source-over";
        const gr = sg.createLinearGradient(0, 0, 300, 160);
        gr.addColorStop(0, "#c9c9d6"); gr.addColorStop(0.5, "#f4f4fb"); gr.addColorStop(1, "#a8a8b8");
        sg.fillStyle = gr;
        sg.fillRect(0, 0, 300, 160);
        sg.fillStyle = "#6b5b7a";
        sg.font = "600 20px Poppins, sans-serif";
        sg.textAlign = "center";
        sg.textBaseline = "middle";
        sg.fillText("✨ Yahan scratch karo ✨", 150, 80);
    }
    function scratchAt(e) {
        const r = sc.getBoundingClientRect();
        sg.globalCompositeOperation = "destination-out";
        sg.beginPath();
        sg.arc((e.clientX - r.left) * 300 / r.width, (e.clientY - r.top) * 160 / r.height, 18, 0, Math.PI * 2);
        sg.fill();
    }
    function endScratch() {
        if (!scratching) return;
        scratching = false;
        const d = sg.getImageData(0, 0, 300, 160).data;
        let clear = 0, total = 0;
        for (let i = 3; i < d.length; i += 16) { total++; if (d[i] < 60) clear++; }
        if (clear / total > 0.45) {
            sc.parentElement.classList.add("done");
            $("scratch-next").classList.remove("hidden");
            celebrate();
        }
    }
    on(sc, "pointerdown", e => { scratching = true; sc.setPointerCapture(e.pointerId); scratchAt(e); });
    on(sc, "pointermove", e => scratching && scratchAt(e));
    on(sc, "pointerup", endScratch);
    on(sc, "pointercancel", endScratch);
    initScratch();

    // ---------- Wish jar ----------
    function resetJar() {
        $("wish-input").value = "";
        $("wish-input").disabled = false;
        $("jar-paper").classList.remove("drop");
        ["wish-done", "wish-share", "jar-next"].forEach(id => $(id).classList.add("hidden"));
        $("wish-send").classList.remove("hidden");
    }
    on($("wish-send"), "click", async () => {
        const text = $("wish-input").value.trim();
        if (!text) { $("wish-input").focus(); return; }
        $("wish-input").disabled = true;
        $("wish-send").classList.add("hidden");
        $("jar-paper").classList.add("drop");
        await sleep(1100);
        wishStarFly();
        await sleep(2200);
        [0, 400, 800, 1200].forEach(d => setTimeout(shootingStar, d));
        $("wish-done").classList.remove("hidden");
        $("jar-next").classList.remove("hidden");
        if (CONFIG.whatsapp) {
            const a = $("wish-share");
            a.classList.remove("hidden");
            a.onclick = () => window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent("Meri birthday wish: " + text)}`, "_blank");
        }
    });

    // ---------- Night sky: taaron se naam ----------
    let skyPts = null, skyRaf = 0;
    for (let i = 0; i < 60; i++) {
        const st = document.createElement("span");
        st.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;animation-delay:${-rand(0, 3)}s`;
        $("sky-stars").appendChild(st);
    }
    function buildSkyPoints() {
        const W = 600, H = 200, off = document.createElement("canvas");
        off.width = W; off.height = H;
        const o = off.getContext("2d");
        let size = 130;
        const setFont = () => (o.font = `700 ${size}px "Dancing Script", cursive`);
        setFont();
        while (o.measureText(CONFIG.skyName).width > W - 40 && size > 30) { size -= 6; setFont(); }
        o.textAlign = "center";
        o.textBaseline = "middle";
        o.fillText(CONFIG.skyName, W / 2, H / 2);
        const d = o.getImageData(0, 0, W, H).data, pts = [];
        for (let y = 0; y < H; y += 5) for (let x = 0; x < W; x += 5) if (d[(y * W + x) * 4 + 3] > 128) pts.push({ x, y, ph: rand(0, 6.28) });
        return pts;
    }
    async function startSky() {
        cancelAnimationFrame(skyRaf);
        try { await document.fonts.load('700 100px "Dancing Script"'); } catch (e) {}
        if (!skyPts) skyPts = buildSkyPoints();
        const g = $("sky-name").getContext("2d"), t0 = performance.now();
        (function loop(now) {
            if (!$("sky-section").classList.contains("active")) return;
            const t = (now - t0) / 1000;
            g.clearRect(0, 0, 600, 200);
            for (const p of skyPts) {
                if (p.x > t * 260) continue;   // naam left se right likhta jata hai
                g.fillStyle = `rgba(255,${(200 + p.ph * 8) | 0},235,${0.55 + 0.45 * Math.sin(t * 3 + p.ph)})`;
                g.beginPath();
                g.arc(p.x, p.y, 1.8, 0, 6.283);
                g.fill();
            }
            skyRaf = requestAnimationFrame(loop);
        })(t0);
    }
    setInterval(() => { if ($("sky-section").classList.contains("active")) shootingStar(); }, 2200);

    if (CONFIG.birthDate) {   // optional: "kitne din ho gaye" live counter
        const bd = new Date(CONFIG.birthDate), el = $("life-counter");
        el.classList.remove("hidden");
        setInterval(() => {
            const s = Math.max(0, Math.floor((Date.now() - bd) / 1000));
            el.textContent = `Apko is duniya mein aaye hue ${Math.floor(s / 86400)} din, ${Math.floor((s % 86400) / 3600)} ghante, ${Math.floor((s % 3600) / 60)} minute aur ${s % 60} second ho gaye 💖`;
        }, 1000);
    }

    // ---------- Cake & countdown ----------
    async function cutCake() {
        putOutCandles();
        knife.classList.add("knife-cutting");   // knife cake ke beech ke upar aata hai
        await sleep(550);
        knife.classList.add("knife-down");      // seedha neeche cut
        await sleep(350);
        document.querySelector(".cake").classList.add("is-cut");
        await sleep(900);
        knife.classList.remove("knife-down");   // wapas upar
        await sleep(450);
        knife.classList.remove("knife-cutting");
        await sleep(300);
    }

    async function startBirthday() {
        if (started) return;
        started = true;
        $("cut-button").disabled = true;

        bg.volume = 0.45;
        playMusic();
        await cutCake();

        $("countdown-overlay").classList.remove("hidden");
        clap.currentTime = 0;
        clap.volume = 0.8;
        if (musicOn) clap.play().catch(() => {});

        const num = $("countdown-number");
        for (let n = CONFIG.countdownFrom; n >= 1; n--) {
            if (!started) return; // replay pressed
            num.textContent = n;
            num.classList.remove("tick");
            void num.offsetWidth;
            num.classList.add("tick");
            await sleep(1000);
        }

        $("countdown-overlay").classList.add("hidden");
        celebrate();
        $("birthday-finale").classList.remove("hidden");
    }

    // ---------- Navigation ----------
    on($("finale-continue"), "click", () => {
        $("birthday-finale").classList.add("hidden");
        showSection("video-section");
        video.currentTime = 0;
        video.play().catch(e => console.warn("Video playback failed:", e));
    });

    const goCard = () => showSection("card-section");
    on($("skip-video"), "click", goCard);
    on(video, "ended", goCard);
    on(video, "play", () => bg.pause());
    on($("card-next"), "click", () => showSection("gallery-section"));
    on($("gallery-next"), "click", () => showSection("story-section"));
    on($("story-next"), "click", () => showSection("balloon-section"));
    on($("balloon-next"), "click", () => showSection("scratch-section"));
    on($("scratch-next"), "click", () => showSection("letter-section"));
    on($("to-jar"), "click", () => showSection("jar-section"));
    on($("jar-next"), "click", () => showSection("sky-section"));
    on($("letter-next"), "click", () => showSection("wish-section"));

    [knife, cakeTop, $("cut-button")].forEach(el => on(el, "click", startBirthday));
    on(cakeTop, "keydown", e => (e.key === "Enter" || e.key === " ") && startBirthday());

    // ---------- Card ----------
    const card = $("card");
    const flip = () => card.classList.toggle("flipped");
    on(card, "click", flip);
    on(card, "keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });

    // ---------- Letter ----------
    on($("envelope"), "click", async () => {
        const lc = $("letter-card");
        if (!lc.classList.contains("hidden")) return;
        $("envelope").classList.add("opened");
        await sleep(600);
        lc.classList.remove("hidden");   // rolled letter envelope se bahar aata hai
        await sleep(1100);
        lc.classList.add("unrolled");    // phir roll khulta hai
    });

    // ---------- Gift ----------
    on($("gift"), "click", () => {
        $("gift").classList.add("open");
        $("gift-hint").classList.add("hidden");
        $("reasons").classList.remove("hidden");
        $("coupons").classList.remove("hidden");
        celebrate();
    });

    // ---------- Music toggle ----------
    on($("music-toggle"), "click", e => {
        musicOn = !musicOn;
        e.currentTarget.textContent = musicOn ? "🔊" : "🔇";
        e.currentTarget.setAttribute("aria-label", musicOn ? "Mute music" : "Unmute music");
        if (musicOn) { if (started && !$("video-section").classList.contains("active")) playMusic(); }
        else { bg.pause(); clap.pause(); }
    });

    // ---------- Replay ----------
    on($("replay-button"), "click", () => {
        started = false;
        [bg, clap, video].forEach(m => { m.pause(); m.currentTime = 0; });
        $("countdown-overlay").classList.add("hidden");
        $("birthday-finale").classList.add("hidden");
        $("countdown-number").textContent = CONFIG.countdownFrom;
        $("cut-button").disabled = false;
        document.querySelector(".cake").classList.remove("is-cut");
        knife.classList.remove("knife-cutting", "knife-down");
        resetCandles();
        card.classList.remove("flipped");
        $("envelope").classList.remove("opened");
        $("letter-card").classList.add("hidden");
        $("letter-card").classList.remove("unrolled");
        $("gift").classList.remove("open");
        $("gift-hint").classList.remove("hidden");
        $("reasons").classList.add("hidden");
        $("coupons").classList.add("hidden");
        buildCoupons();
        buildBalloons();
        initScratch();
        resetJar();
        clearCelebration();
        showSection("cake-section");
    });

    // Dono sides par hamesha chalne wali fireworks
    function sideFireworks() {
        let c = $("side-fx");
        if (!c) {                       // index.html mein canvas na ho to khud bana lo
            c = document.createElement("canvas");
            c.id = "side-fx";
            c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none";
            document.body.prepend(c);
        }
        const g = c.getContext("2d");
        let W, H, rockets = [], sparks = [], leftNext = true;
        const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
        resize();
        addEventListener("resize", resize);

        function launch() {
            const x = (leftNext ? rand(0.03, 0.18) : rand(0.82, 0.97)) * W;
            leftNext = !leftNext;
            rockets.push({ x, y: H, ty: rand(0.15, 0.5) * H, hue: rand(300, 360) });
        }

        function burst(r) {
            const hues = [340, 0, 280, 45, 190, 130, 25, 310];  // pink, red, purple, gold, cyan, green, orange, magenta
            const n = 22;
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2, sp = rand(1.5, 4.2);
                sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1,
                              hue: hues[Math.floor(Math.random() * hues.length)], size: rand(14, 24) });
            }
        }

        function frame() {
            g.clearRect(0, 0, W, H);
            g.globalCompositeOperation = "lighter";
            g.textAlign = "center";
            g.textBaseline = "middle";
            rockets = rockets.filter(r => {
                r.y -= 7;
                g.fillStyle = `hsl(${r.hue},100%,80%)`;
                g.fillRect(r.x - 1.5, r.y, 3, 12);
                if (r.y <= r.ty) { burst(r); return false; }
                return true;
            });
            sparks = sparks.filter(p => {
                p.x += p.vx; p.y += p.vy; p.vx *= 0.98; p.vy = p.vy * 0.98 + 0.05; p.life -= 0.014;
                if (p.life <= 0) return false;
                g.fillStyle = `hsla(${p.hue},100%,65%,${p.life})`;
                g.font = `${p.size * (0.55 + 0.45 * p.life)}px sans-serif`;
                g.fillText("♥", p.x, p.y);
                return true;
            });
            requestAnimationFrame(frame);
        }

        launch();
        setInterval(() => { if (!document.hidden) launch(); }, 1000);
        frame();
    }

    fillHearts();
    sideFireworks();
    showSection("cake-section");
});