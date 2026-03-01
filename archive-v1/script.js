document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            }
        });
    }

    // --- Typing Effect ---
    const textElement = document.querySelector('.typing-text');
    const words = ["Premium Web Solutions", "College Major Projects", "Business Automation", "Modern UI/UX Designs"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (textElement) type();

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const interactiveElements = document.querySelectorAll('a, button, .feature-card, .tech-badge, .why-list li');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                cursorOutline.style.border = 'none';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '35px';
                cursorOutline.style.height = '35px';
                cursorOutline.style.backgroundColor = 'transparent';
                cursorOutline.style.border = '1.5px solid rgba(255, 255, 255, 0.5)';
            });
        });
    }

    // --- Social Links & Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // --- Firebase Contact Form ---
    const firebaseConfig = {
        apiKey: "AIzaSyCsjxNH635wAGTvtpQHa_2OwX9VUnnrQfI",
        authDomain: "portfolio-e8813.firebaseapp.com",
        projectId: "portfolio-e8813",
        storageBucket: "portfolio-e8813.firebasestorage.app",
        messagingSenderId: "316441822058",
        appId: "1:316441822058:web:353e617e1ccb3636d2db13"
    };

    // --- Promo Popup Logic ---
    const promoPopup = document.getElementById('promo-popup');
    if (promoPopup) {
        // Show after 15 seconds
        setTimeout(() => {
            promoPopup.classList.add('show');

            // Hide after 5 seconds of being shown
            setTimeout(() => {
                promoPopup.classList.remove('show');
            }, 5000);

        }, 15000);
    }

    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        const contactForm = document.getElementById('contact-form');
        const formStatus = document.getElementById('form-status');
        const submitBtn = document.getElementById('submit-btn');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                submitBtn.disabled = true;
                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    await db.collection('messages').add(formData);
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } catch (error) {
                    formStatus.textContent = 'Error sending message. Please try again.';
                    formStatus.className = 'form-status error';
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                }
            });
        }
    }
});
