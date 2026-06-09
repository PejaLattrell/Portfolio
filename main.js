// ============================================================
// SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});



// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showNotification("Message sent successfully! I'll get back to you soon.", 'success');
        contactForm.reset();
    });
}

// ============================================================
// NOTIFICATION TOAST
// ============================================================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 320);
    }, 3000);
}

// ============================================================
// INTERSECTION OBSERVER — FADE IN ANIMATIONS
// ============================================================
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateEls = document.querySelectorAll(
        '.project-card, .skill-item, .skill-card, .contact-item, .glass-card'
    );
    animateEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
        observer.observe(el);
    });
});

// ============================================================
// HERO TYPEWRITER
// ============================================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i++);
            setTimeout(type, speed);
        }
    }
    type();
}

window.addEventListener('load', () => {
    const badge = document.querySelector('.hero-badge');
    if (badge) {
        const original = badge.textContent.trim();
        typeWriter(badge, original, 45);
    }
});

console.log('Portfolio website loaded successfully! 🚀');
