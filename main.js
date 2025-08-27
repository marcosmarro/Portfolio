// Aggressive scroll to top for mobile - must be first
(function() {
    // Immediate scroll reset
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Additional mobile-specific fixes
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Force scroll reset for mobile browsers
        history.scrollRestoration = 'manual';
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 0);
    }
})();

// Enhanced beforeunload handler
window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
});

// Additional page show handler for mobile back/forward navigation
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page was loaded from cache (mobile back button)
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 0);
    }
});

// --- STARFIELD ---
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let comets = [];
const numStars = 800;
const starSpeed = 0.15;
const cometSpawnChance = 0.001;

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
class Star {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width - canvas.width / 2;
        this.y = Math.random() * canvas.height - canvas.height / 2;
        this.z = Math.random() * canvas.width;
        this.originalZ = this.z;
    }
    update() {
        this.z -= starSpeed;
        if (this.z <= 0) this.reset();
    }
    draw() {
        const x = this.x / this.z * canvas.width + canvas.width / 2;
        const y = this.y / this.z * canvas.height + canvas.height / 2;
        const size = 1 + (1 - this.z / this.originalZ) * 3;
        const length = size * 2;
        ctx.fillStyle = `rgba(255,255,255,${0.4 + (1 - this.z / this.originalZ) * 0.6})`;
        ctx.fillRect(x, y, size, length);
    }
}
class Comet {
    constructor() { this.reset(); }
    reset() {
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) {
            this.x = Math.random() * canvas.width; this.y = -50;
            this.vx = (Math.random() - 0.5) * 5; this.vy = 2 + Math.random() * 3;
        } else if (edge === 1) {
            this.x = canvas.width + 50; this.y = Math.random() * canvas.height;
            this.vx = -2 - Math.random() * 3; this.vy = (Math.random() - 0.5) * 5;
        } else if (edge === 2) {
            this.x = Math.random() * canvas.width; this.y = canvas.height + 50;
            this.vx = (Math.random() - 0.5) * 5; this.vy = -2 - Math.random() * 3;
        } else {
            this.x = -50; this.y = Math.random() * canvas.height;
            this.vx = 2 + Math.random() * 3; this.vy = (Math.random() - 0.5) * 5;
        }
        this.length = 30 + Math.random() * 40;
        this.speed = 5 + Math.random() * 7;
        this.angle = Math.atan2(this.vy, this.vx);
        this.color = `hsl(${Math.random()*360},70%,70%)`;
        this.alpha = 1;
    }
    update() {
        this.x += this.vx; this.y += this.vy; this.alpha -= 0.005;
        if (this.x < -100 || this.x > canvas.width+100 || this.y < -100 || this.y > canvas.height+100 || this.alpha <= 0) return true;
        return false;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.fill();
        const gradient = ctx.createLinearGradient(0, 0, -this.length, 0);
        gradient.addColorStop(0, `rgba(255,255,255,${this.alpha*0.8})`);
        gradient.addColorStop(0.2, `rgba(255,255,255,${this.alpha*0.6})`);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.length, 0);
        ctx.lineWidth = 3;
        ctx.strokeStyle = gradient;
        ctx.stroke();
        ctx.restore();
    }
}
function initStars() {
    setCanvasSize();
    stars = [];
    for (let i = 0; i < numStars; i++) stars.push(new Star());
}
function animateStars() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#0b0f1a';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    stars.forEach(star=>{ star.update(); star.draw(); });
    for(let i=comets.length-1; i>=0; i--) {
        const comet = comets[i];
        if(comet.update()) comets.splice(i,1); else comet.draw();
    }
    if(Math.random()<cometSpawnChance) comets.push(new Comet());
    requestAnimationFrame(animateStars);
}
window.addEventListener('resize', ()=>{ setCanvasSize(); initStars(); });
window.addEventListener('load', ()=>{
    // Ensure we're at top even after load
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 0);
    
    initStars();
    animateStars();
    fadeInSections();
});

// --- FADE UP ON SCROLL ---
let lastScrollY = window.scrollY;
const heroSection = document.getElementById('hero-content');
const sectionsSeen = new Set();

function fadeInSections() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;

    const sections = document.querySelectorAll('.fade-up:not(#hero-content)');
    const navbarHeight = document.querySelector('.navbar-height')?.offsetHeight || 64;

    sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const isPartiallyInView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
        const isFullyAboveViewport = rect.bottom < navbarHeight;
        const isFullyBelowViewport = rect.top > window.innerHeight;

        if (isPartiallyInView) {
            sec.classList.add('visible');
            sectionsSeen.add(sec.id);
        } else if (scrollingDown) {
            if (sectionsSeen.has(sec.id)) sec.classList.add('visible');
        } else if (!scrollingDown) {
            if (isFullyAboveViewport) {
                sec.classList.remove('visible');
                sectionsSeen.delete(sec.id);
            }
        }
    });
}
window.addEventListener('scroll', fadeInSections);
setTimeout(() => { heroSection?.classList.add('visible'); }, 200);
window.addEventListener('load', () => { fadeInSections(); });

// --- SMOOTH SCROLL for nav links ---
document.querySelectorAll('a[data-scroll]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        let target;
        if (href === "#") {
            target = document.body; // scroll to top
        } else if (href && href.startsWith('#')) {
            target = document.getElementById(href.slice(1));
        }
        if (target) {
            e.preventDefault();
            const navHeight = document.querySelector('.navbar-height')?.offsetHeight || 0;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});