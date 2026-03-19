document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation (Observer)
    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    sections.forEach(sec => observer.observe(sec));

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mouse Glow Effect for Interactive Cards
    const interactiveCards = document.querySelectorAll('.interactive-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Contact Form Handling
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const loader = submitBtn.querySelector('.loader');
    const formResponse = document.getElementById('formResponse');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Setup UI for Loading state
            btnText.textContent = 'Sending...';
            if (btnIcon) btnIcon.classList.add('hidden');
            loader.classList.remove('hidden');
            submitBtn.disabled = true;
            formResponse.className = 'form-response';
            formResponse.textContent = '';

            const formData = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value
            };

            try {
                // Post to API Endpoint
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    formResponse.textContent = result.success || 'Message sent successfully!';
                    formResponse.classList.add('success-msg');
                    form.reset();
                } else {
                    formResponse.textContent = result.error || 'Failed to send message.';
                    formResponse.classList.add('error-msg');
                }
            } catch (error) {
                formResponse.textContent = 'Server is currently disconnected. Make sure backend is running.';
                formResponse.classList.add('error-msg');
                console.error('Error:', error);
            } finally {
                // Revert UI
                btnText.textContent = 'Blast Off';
                if (btnIcon) btnIcon.classList.remove('hidden');
                loader.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    }
});
