// ===== PARTICLE ANIMATION =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Animation speed

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;

                const updateCount = () => {
                    const increment = target / speed;

                    if (count < target) {
                        count += increment;
                        counter.textContent = Math.ceil(count);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe feature items
    document.querySelectorAll('.feature-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// ===== SMOOTH SCROLL =====
function scrollToProjects() {
    const projectsSection = document.getElementById('projects');
    projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== WHATSAPP INTEGRATION =====
function openWhatsApp(projectType = '') {
    // Replace with your actual WhatsApp number (include country code without + or -)
    const phoneNumber = '919876543210'; // Example: 919876543210 for India

    let message = 'Hi CodeArcade! I am interested in getting a project done.';

    if (projectType) {
        message = `Hi CodeArcade! I am interested in ${projectType}. Can you provide more details?`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
}

// ===== VIDEO DEMO PLACEHOLDER =====
function playDemo() {
    const videoPlaceholder = document.querySelector('.video-placeholder');

    // Create a simple animation effect
    videoPlaceholder.style.transform = 'scale(0.95)';
    setTimeout(() => {
        videoPlaceholder.style.transform = 'scale(1)';
    }, 200);

    // Show alert (replace with actual video player or modal)
    alert('🎬 Video demo coming soon! Contact us on WhatsApp to see our portfolio and previous projects.');

    // Alternative: Open YouTube channel or portfolio
    // window.open('https://www.youtube.com/channel/UC6McNBm7VIaLlwAjKOP5_VA', '_blank');
}

// ===== MOUSE TRAIL EFFECT =====
function initMouseTrail() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        // Update gradient orb positions slightly based on mouse
        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.01;
            const x = (cursorX - window.innerWidth / 2) * speed;
            const y = (cursorY - window.innerHeight / 2) * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ===== FLOATING CARDS INTERACTION =====
function initFloatingCards() {
    const floatingCards = document.querySelectorAll('.float-card');

    floatingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.1) translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
}

// ===== PROJECT CARD HOVER EFFECTS =====
function initProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            }
        });

        card.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.project-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
}

// ===== TESTIMONIAL ROTATION =====
function initTestimonialRotation() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    // Add highlight to first testimonial
    if (testimonials.length > 0) {
        testimonials[0].style.borderColor = 'rgba(102, 126, 234, 0.5)';
    }

    // Rotate highlight every 5 seconds
    setInterval(() => {
        testimonials[currentIndex].style.borderColor = '';
        currentIndex = (currentIndex + 1) % testimonials.length;
        testimonials[currentIndex].style.borderColor = 'rgba(102, 126, 234, 0.5)';
    }, 5000);
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        // Parallax for floating elements
        const floatingElements = document.querySelector('.floating-elements');
        if (floatingElements) {
            floatingElements.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        // Parallax for gradient orbs
        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.1;
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// ===== BUTTON RIPPLE EFFECT =====
function initButtonRipple() {
    const buttons = document.querySelectorAll('.btn, .btn-card');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== LAZY LOADING IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== NAVBAR SCROLL EFFECT (if you add a navbar later) =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== TYPING EFFECT FOR HERO SUBTITLE =====
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const originalText = subtitle.innerHTML;
    subtitle.innerHTML = '';
    subtitle.style.opacity = '1';

    let charIndex = 0;
    const typingSpeed = 30;

    function type() {
        if (charIndex < originalText.length) {
            subtitle.innerHTML += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        }
    }

    // Start typing after hero title animation
    setTimeout(type, 1000);
}

// ===== PRICE HIGHLIGHT ANIMATION =====
function initPriceAnimation() {
    const priceHighlights = document.querySelectorAll('.price-highlight, .price-tag strong');

    priceHighlights.forEach(price => {
        setInterval(() => {
            price.style.transform = 'scale(1.1)';
            setTimeout(() => {
                price.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    });
}

// ===== INITIALIZE ALL FUNCTIONS =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 CodeArcade Promo Page Loaded!');

    // Initialize all features
    createParticles();
    animateCounters();
    initScrollAnimations();
    initMouseTrail();
    initFloatingCards();
    initProjectCardEffects();
    initTestimonialRotation();
    initParallax();
    initButtonRipple();
    initLazyLoading();
    initNavbarScroll();
    // initTypingEffect(); // Uncomment if you want typing effect
    initPriceAnimation();

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Log analytics (replace with actual analytics code)
    console.log('📊 Page view tracked');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(() => {
    // Any additional scroll-based logic
}, 10));

// ===== EASTER EGG =====
let clickCount = 0;
document.querySelector('.hero-title')?.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        alert('🎉 You found the easter egg! Use code "CODEARCADE50" for 50 rupees off your first project!');
        clickCount = 0;
    }
});

// ===== EXPORT FUNCTIONS FOR INLINE USE =====
window.scrollToProjects = scrollToProjects;
window.openWhatsApp = openWhatsApp;
window.playDemo = playDemo;
