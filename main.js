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
// EMAILJS INIT
// ============================================================
emailjs.init('ouAQx49DFQpgk_Dz6');

// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        emailjs.sendForm('service_fdzbmqo', 'template_32vwhmg', contactForm)
            .then(() => {
                showNotification("Message sent successfully! I'll get back to you soon.", 'success');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                showNotification('Oops! Something went wrong. Please try again.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
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
    
    // Initialize terminal emulator
    initTerminal();

    // Initialize alternating typewriter text
    initAlternatingTypewriter();

    // Initialize projects detail modal overlay
    initProjectsModal();

    // Make terminal draggable within the hero section
    initDraggableTerminal();
});

// ============================================================
// DRAGGABLE TERMINAL
// ============================================================

function initDraggableTerminal() {
    const terminal = document.querySelector('.terminal-window');
    const handle   = document.querySelector('.terminal-header');
    const hero     = document.getElementById('home');

    if (!terminal || !handle || !hero) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;

    handle.style.cursor = 'grab';

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    function getClampedPos(rawX, rawY) {
        const heroRect = hero.getBoundingClientRect();
        const termRect = terminal.getBoundingClientRect();

        // Natural (untransformed) edges
        const natLeft   = termRect.left   - currentX;
        const natRight  = termRect.right  - currentX;
        const natTop    = termRect.top    - currentY;
        const natBottom = termRect.bottom - currentY;

        const minX = heroRect.left   - natLeft;
        const maxX = heroRect.right  - natRight;
        const minY = heroRect.top    - natTop;
        const maxY = heroRect.bottom - natBottom;

        return {
            x: clamp(rawX, minX, maxX),
            y: clamp(rawY, minY, maxY)
        };
    }

    // ── Mouse events ──────────────────────────────────────────
    handle.addEventListener('mousedown', (e) => {
        if (e.target.closest('.terminal-buttons')) return; // don't drag on close/min/max
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
        handle.style.cursor = 'grabbing';
        terminal.style.transition = 'none';
        terminal.style.willChange = 'transform';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const pos = getClampedPos(e.clientX - startX, e.clientY - startY);
        currentX = pos.x;
        currentY = pos.y;
        terminal.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        handle.style.cursor = 'grab';
        terminal.style.willChange = 'auto';
    });

    // ── Touch events (mobile) ─────────────────────────────────
    handle.addEventListener('touchstart', (e) => {
        if (e.target.closest('.terminal-buttons')) return;
        const touch = e.touches[0];
        isDragging = true;
        startX = touch.clientX - currentX;
        startY = touch.clientY - currentY;
        terminal.style.transition = 'none';
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        const pos = getClampedPos(touch.clientX - startX, touch.clientY - startY);
        currentX = pos.x;
        currentY = pos.y;
        terminal.style.transform = `translate(${currentX}px, ${currentY}px)`;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// ============================================================
// INTERACTIVE CLI TERMINAL
// ============================================================

function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalBody = document.getElementById('terminalBody');
    const terminalWindow = document.querySelector('.terminal-window');

    if (!terminalInput || !terminalOutput || !terminalBody || !terminalWindow) return;

    let history = [];
    let historyIndex = -1;

    // Focus input on terminal click
    terminalWindow.addEventListener('click', () => {
        terminalInput.focus();
    });

    // Write a line to the terminal output
    function writeLine(htmlContent, cssClass = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${cssClass}`;
        line.innerHTML = htmlContent;
        terminalOutput.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Scroll helper
    function handleRedirect(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            writeLine(`<span class="term-green">Redirecting to ${sectionId}...</span>`);
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return true;
        }
        return false;
    }

    // Process terminal command
    function processCommand(cmdText) {
        const trimmed = cmdText.trim();
        const args = trimmed.split(/\s+/);
        const command = args[0].toLowerCase();

        if (trimmed === '') {
            writeLine('');
            return;
        }

        // Add to history
        history.push(cmdText);
        historyIndex = history.length;

        // Echo the entered command
        writeLine(`<span class="terminal-prompt">visitor@pejalattrell:~$</span> <span class="term-bold">${cmdText}</span>`);

        switch (command) {
            case 'help':
                writeLine('Available commands:', 'term-bold');
                writeLine('  <span class="term-cyan">about</span>                     - Introduction & scroll to About');
                writeLine('  <span class="term-cyan">skills</span>                    - Technical skillset & scroll to Skills');
                writeLine('  <span class="term-cyan">projects</span>                  - Development work & scroll to Projects');
                writeLine('  <span class="term-cyan">contact</span>                   - Contact info & scroll to Contact');
                writeLine('  <span class="term-cyan">show [section]</span>            - Navigate to section (e.g. show projects)');
                writeLine('  <span class="term-cyan">peja show [section]</span>       - Navigate to section (e.g. peja show projects)');
                writeLine('  <span class="term-cyan">neofetch</span>                  - System information display');
                writeLine('  <span class="term-cyan">clear</span>                     - Clear the terminal screen');
                break;

            case 'about':
                writeLine('<span class="term-purple term-bold">Peja Lattrell Escares</span>');
                writeLine('<span class="term-gray">--------------------</span>');
                writeLine('Computer Science Student at New Era University & Aspiring Data Engineer.');
                writeLine('Dedicated to mastering data structures, backend engineering, ETL pipelines,');
                writeLine('and building scalable data solutions that transform raw data into insights.');
                handleRedirect('about');
                break;

            case 'skills':
                writeLine('<span class="term-yellow term-bold">Technical Skills & Expertise:</span>');
                writeLine('  - <span class="term-green">Programming</span> : Python, Java, JavaScript, SQL');
                writeLine('  - <span class="term-green">Data Tools</span>  : Pandas, NumPy, Data Pipelines, ETL');
                writeLine('  - <span class="term-green">Databases</span>   : PostgreSQL, MySQL, MongoDB');
                writeLine('  - <span class="term-green">Web Dev</span>     : HTML5, CSS3, React, Node.js, Next.js');
                writeLine('  - <span class="term-green">Tools</span>       : Git, Docker, AWS, Linux, CI/CD');
                handleRedirect('skills');
                break;

            case 'projects':
                writeLine('<span class="term-blue term-bold">Featured Projects:</span>');
                writeLine('  - <span class="term-cyan">NEU Library System</span>      : React JS, Node JS, Firebase');
                writeLine('  - <span class="term-cyan">Campus Lost & Found</span>     : Next.js, Supabase, Vercel');
                writeLine('  - <span class="term-cyan">SkyCast Weather App</span>     : React, Weather API, Vercel');
                writeLine('  - <span class="term-cyan">NEU MOA Monitoring</span>      : React JS, Firebase, Node JS');
                handleRedirect('projects');
                break;

            case 'contact':
                writeLine('<span class="term-pink term-bold">Get in Touch:</span>');
                writeLine('  - <span class="term-cyan">Email</span>     : <a href="mailto:lattrellp@gmail.com" class="term-cyan" style="text-decoration:underline;">lattrellp@gmail.com</a>');
                writeLine('  - <span class="term-cyan">Phone</span>     : +63 977 420 4828');
                writeLine('  - <span class="term-cyan">Github</span>    : <a href="https://github.com/PejaLattrell" target="_blank" class="term-cyan" style="text-decoration:underline;">github.com/PejaLattrell</a>');
                writeLine('  - <span class="term-cyan">LinkedIn</span>  : <a href="https://linkedin.com/in/peja-lattrell-escares-779392341" target="_blank" class="term-cyan" style="text-decoration:underline;">peja-lattrell-escares</a>');
                handleRedirect('contact');
                break;

            case 'peja':
                if (args.length > 2 && args[1].toLowerCase() === 'show') {
                    const targetSect = args[2].toLowerCase();
                    if (['about', 'skills', 'projects', 'contact', 'home'].includes(targetSect)) {
                        handleRedirect(targetSect);
                    } else {
                        writeLine(`<span class="term-red">Unknown section: ${args[2]}. Available: about, skills, projects, contact, home</span>`);
                    }
                } else {
                    writeLine('Usage: <span class="term-cyan">peja show [about|skills|projects|contact|home]</span>');
                }
                break;

            case 'show':
                if (args.length > 1) {
                    const targetSect = args[1].toLowerCase();
                    if (['about', 'skills', 'projects', 'contact', 'home'].includes(targetSect)) {
                        handleRedirect(targetSect);
                    } else {
                        writeLine(`<span class="term-red">Unknown section: ${args[1]}. Available: about, skills, projects, contact, home</span>`);
                    }
                } else {
                    writeLine('Usage: <span class="term-cyan">show [about|skills|projects|contact|home]</span>');
                }
                break;

            case 'neofetch':
                executeNeofetch();
                break;

            case 'clear':
                terminalOutput.innerHTML = '';
                break;

            case 'sudo':
                if (args.length > 1 && args[1] === 'rm' && trimmed.includes('-rf')) {
                    writeLine('<span class="term-red">[sudo] password for visitor: *********</span>');
                    writeLine('<span class="term-yellow term-bold">WARNING: System override initiated...</span>');
                    writeLine('Deleting root directory files... 📂');
                    setTimeout(() => {
                        writeLine('<span class="term-red term-bold">Error: Operation aborted. Nice try, kid! 😉</span>');
                    }, 500);
                } else {
                    writeLine('<span class="term-red">Error: visitor is not in the sudoers file. This incident will be reported.</span>');
                }
                break;

            default:
                writeLine(`<span class="term-red">Command not found: ${command}. Type <span class="term-bold">help</span> to see available commands.</span>`);
        }
    }

    function executeNeofetch() {
        const art = [
            '<span class="term-purple"> ____         _       </span>',
            '<span class="term-purple">   / __ \\___    (_)___ _ </span>',
            '<span class="term-purple">  / /_/ / _ \\  / / __ `/ </span>',
            '<span class="term-purple"> / ____/  __/_/ / /_/ /  </span>',
            '<span class="term-purple">/_/    \\___/__/ \\__,_/   </span>',
            '<span class="term-purple">           /___/          </span>',
        ];
        const info = [
            '<span class="term-bold term-cyan">visitor@pejalattrell</span>',
            '--------------------',
            '<span class="term-green">OS</span>      : NOS v2.0',
            '<span class="term-green">Host</span>    : Peja Lattrell',
            '<span class="term-green">Kernel</span>  : Coffee & Code',
            '<span class="term-green">Shell</span>   : zsh 5.8',
            '<span class="term-green">Theme</span>   : Dark Glassmorphic',
            '<span class="term-green">Goal</span>    : AI/ML Engineer',
            '<span class="term-green">CPU</span>     : Intel Core i99',
        ];
        art.forEach(line => writeLine(line));
        writeLine('');
        info.forEach(line => writeLine(line));
    }

    // Keyboard handling
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.value;
            processCommand(cmd);
            terminalInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                terminalInput.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                terminalInput.value = '';
            }
        }
    });

    // Animated boot-up sequence
    const bootSteps = [
        { text: '<span class="term-gray">─────────────────────────────────────────</span>',                                 delay: 0    },
        { text: '<span class="term-gray">[ .... ] Booting terminal environment...</span>',                                  delay: 250  },
        { text: '<span class="term-gray">[ .... ] Loading core modules...</span>',                                           delay: 800  },
        { text: '<span class="term-gray">[ <span class="term-green">OK</span>   ] <span class="term-green">core</span> v1.0.0 — installed</span>',                    delay: 1350 },
        { text: '<span class="term-gray">[ .... ] Fetching portfolio data...</span>',                                        delay: 1800 },
        { text: '<span class="term-gray">[ <span class="term-green">OK</span>   ] <span class="term-green">projects</span> v4.2.1 — installed</span>',                delay: 2300 },
        { text: '<span class="term-gray">[ <span class="term-green">OK</span>   ] <span class="term-green">skills</span> v3.1.0 — installed</span>',                  delay: 2650 },
        { text: '<span class="term-gray">[ <span class="term-green">OK</span>   ] <span class="term-green">contact</span> v2.0.5 — installed</span>',                 delay: 3000 },
        { text: '<span class="term-gray">[ .... ] Initializing shell interface...</span>',                                   delay: 3450 },
        { text: '<span class="term-gray">[ <span class="term-green">OK</span>   ] <span class="term-green">shell</span> ready</span>',                                delay: 4100 },
        { text: '<span class="term-gray">─────────────────────────────────────────</span>',                                 delay: 4350 },
        { text: '',                                                                                                          delay: 4450 },
        { text: '<span class="term-green term-bold">Welcome to Peja Lattrell Escares\' Terminal Portfolio v1.0.0</span>',   delay: 4600 },
        { text: 'Type <span class="term-cyan term-bold">help</span> to list available commands.',                            delay: 4800 },
        { text: '',                                                                                                          delay: 4950 },
    ];

    bootSteps.forEach(({ text, delay }) => {
        setTimeout(() => writeLine(text), delay);
    });

    setTimeout(() => executeNeofetch(), 5100);
}

// ============================================================
// ALTERNATING TYPEWRITER EFFECT
// ============================================================

function initAlternatingTypewriter() {
    const el = document.getElementById('alternatingText');
    if (!el) return;

    const words = [
        "Full-Stack Developer",
        "Data Engineer"
    ];
    let wordIndex = 0;
    let charIndex = words[wordIndex].length;
    let isDeleting = true; // start deleting the default text

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove a char
            el.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add a char
            el.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        // Determine next state & delay
        let delay = 100; // default typing speed

        if (isDeleting) {
            delay /= 2; // delete faster
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // Fully typed, pause before deleting
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Fully deleted, move to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 500; // brief pause before starting typing
        }

        setTimeout(type, delay);
    }

    // Start the loop (initially it deletes "Full-Stack Developer")
    setTimeout(type, 1500);
}

// ============================================================
// PROJECTS MODAL OVERLAY
// ============================================================

function initProjectsModal() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;

    const modalTitle = document.getElementById('modalTitle');
    const modalTags = document.getElementById('modalTags');
    const modalDescription = document.getElementById('modalDescription');
    const modalLiveLink = document.getElementById('modalLiveLink');
    const modalGithubLink = document.getElementById('modalGithubLink');

    if (!modal || projectCards.length === 0) return;

    projectCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // If clicked on links, open link normally
            if (e.target.closest('.project-link')) {
                return;
            }

            // Get project data
            const title = card.querySelector('h3').textContent;
            const shortDesc = card.querySelector('p').textContent;
            const longDesc = card.getAttribute('data-details') || shortDesc;
            const tagsHTML = card.querySelector('.project-tags').innerHTML;
            
            const liveBtn = card.querySelector('.link-primary');
            const githubBtn = card.querySelector('.link-secondary');
            
            const liveHref = liveBtn ? liveBtn.getAttribute('href') : '';
            const githubHref = githubBtn ? githubBtn.getAttribute('href') : '';

            // Populate modal
            modalTitle.textContent = title;
            modalTags.innerHTML = tagsHTML;
            modalDescription.textContent = longDesc;

            if (liveHref) {
                modalLiveLink.setAttribute('href', liveHref);
                modalLiveLink.style.display = 'inline-flex';
            } else {
                modalLiveLink.style.display = 'none';
            }

            if (githubHref) {
                modalGithubLink.setAttribute('href', githubHref);
                modalGithubLink.style.display = 'inline-flex';
            } else {
                modalGithubLink.style.display = 'none';
            }

            // Show modal
            modal.classList.add('modal-active');
            document.body.style.overflow = 'hidden'; // prevent page scroll
        });
    });

    function closeModal() {
        modal.classList.remove('modal-active');
        document.body.style.overflow = ''; // restore page scroll
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-active')) {
            closeModal();
        }
    });
}

console.log('Portfolio website loaded successfully! 🚀');
