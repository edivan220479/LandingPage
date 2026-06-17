// Executado imediatamente assim que o script carrega para remover a tela de bloqueio se houver erro grave
function removeOverlay() {
    const overlay = document.getElementById('fallback-overlay');
    if (overlay) overlay.style.opacity = '0';
    setTimeout(() => { if(overlay) overlay.remove(); }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    // Forçar a remoção da tela de carregamento após a renderização inicial
    removeOverlay();

    // Iniciar funcionalidades independentes
    initTheme();
    initParticles();
    initTyping();
    initProjectFilter();
    initScrollObserver();
    initContactForm();
});

// Tratamento global de erros para nunca quebrar ou congelar o navegador
window.onerror = function() {
    removeOverlay();
    return false;
};

/* ==========================================================================
   1. Alternador de Tema
   ========================================================================== */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') document.body.classList.add('light-theme');

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    });
}

/* ==========================================================================
   2. Fundo de Partículas Hidratado via Canvas
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: null, y: null, radius: 100 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 2 + 0.8;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.alpha = Math.random() * 0.4 + 0.15;
            this.alphaSpeed = (Math.random() - 0.5) * 0.008;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Twinkle effect (fluctuating opacity)
            this.alpha += this.alphaSpeed;
            if (this.alpha < 0.1 || this.alpha > 0.55) {
                this.alphaSpeed *= -1;
            }
        }
        draw() {
            const isLight = document.body.classList.contains('light-theme');
            const color = isLight ? '180, 135, 40' : '212, 175, 55';
            ctx.fillStyle = `rgba(${color}, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function setup() {
        resize();
        particles = [];
        const count = window.innerWidth < 768 ? 25 : 60;
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    setup();
    loop();
}

/* ==========================================================================
   3. Efeito de Digitação Tradicional
   ========================================================================== */
function initTyping() {
    const target = document.getElementById('typing-text');
    if (!target) return;

    const terms = ["Sistemas Escaláveis", "Aplicações Web Modernas", "Arquiteturas Elegantes"];
    let termIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const current = terms[termIdx];
        target.textContent = isDeleting ? current.substring(0, charIdx - 1) : current.substring(0, charIdx + 1);
        charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

        let delay = isDeleting ? 40 : 100;
        if (!isDeleting && charIdx === current.length) { delay = 2000; isDeleting = true; }
        else if (isDeleting && charIdx === 0) { isDeleting = false; termIdx = (termIdx + 1) % terms.length; delay = 500; }

        setTimeout(type, delay);
    }
    type();
}

/* ==========================================================================
   4. Filtro Isomórfico de Projetos
   ========================================================================== */
function initProjectFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cat = card.getAttribute('data-category');
                card.classList.toggle('hidden', filter !== 'all' && cat !== filter);
            });
        });
    });
}

/* ==========================================================================
   5. Monitor e Observador de Rolagem (Scroll Reveal)
   ========================================================================== */
function initScrollObserver() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.05 });
    elements.forEach(el => obs.observe(el));
}

/* ==========================================================================
   6. Validador do Formulário de Contato
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        form.querySelectorAll('input, textarea').forEach(field => {
            const group = field.parentElement;
            const isEmpty = !field.value.trim();
            group.classList.toggle('invalid', isEmpty);
            if (isEmpty) valid = false;
        });

        if (!valid) return;

        const btnText = form.querySelector('.btn-text');
        if (btnText) btnText.textContent = "Mensagem Enviada com Sucesso!";
        form.reset();
    });
}