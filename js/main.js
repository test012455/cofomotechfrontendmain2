
document.addEventListener('DOMContentLoaded', function () {

    // Set your backend URL here (change if different host/port)
    const BACKEND_URL = 'http://localhost:5000';

    
    // NAVBAR SCROLL EFFECT
    
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    
    // MOBILE MENU TOGGLE
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
            this.classList.toggle('active');

            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
        });
    }

    
    // DROPDOWN MENU (Mobile)
    
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        if (toggle && window.innerWidth <= 968) {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

   
    // ACTIVE PAGE HIGHLIGHTING
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-menu a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

 
    // SMOOTH SCROLL TO SECTIONS
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    
    // FORM SUBMISSION LOGIC
    // contact-form -> POST JSON to /contact
    // apply-form -> POST multipart/form-data to /apply (for resume upload)

    const contactForm = document.getElementById('contact-form');
    const applyForm = document.getElementById('apply-form');

    function showMessage(el, text, success = true) {
        const msg = document.createElement('div');
        msg.classList.add(success ? 'success-message' : 'error-message--server');
        msg.textContent = text;
        msg.style.cssText = success ?
            'background:#27ae60;color:white;padding:0.8rem;border-radius:6px;margin-top:8px;text-align:center;'
            : 'background:#e74c3c;color:white;padding:0.8rem;border-radius:6px;margin-top:8px;text-align:center;';
        el.appendChild(msg);
        setTimeout(() => msg.remove(), success ? 4000 : 6000);
    }

    if (contactForm) {
        const serviceSelect = contactForm.querySelector('#service_interest');
        const otherGroup = contactForm.querySelector('#other-service-group');
        const otherInput = contactForm.querySelector('#other_service_text');

        // show/hide extra field
        if (serviceSelect) {
            serviceSelect.addEventListener('change', () => {
                if (serviceSelect.value === 'Other') {
                    otherGroup.style.display = 'block';
                    otherInput.required = true;
                } else {
                    otherGroup.style.display = 'none';
                    otherInput.required = false;
                    otherInput.value = '';
                }
            });
        }

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const jsonData = Object.fromEntries(formData);

            try {
                const response = await fetch(`${BACKEND_URL}/contact`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });

                const result = await response.json().catch(() => ({}));
                if (response.ok) {
                    showMessage(contactForm, 'Message sent successfully.');
                    contactForm.reset();
                    otherGroup.style.display = 'none';
                } else {
                    const errText = result.error || response.statusText || 'Unknown error';
                    showMessage(contactForm, 'Error: ' + errText, false);
                }
            } catch (err) {
                console.error('Contact form network error:', err);
                showMessage(contactForm, 'Server not connected.', false);
            }
        });
    }

    if (applyForm) {
        applyForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            try {
                const response = await fetch(`${BACKEND_URL}/apply`, {
                    method: 'POST',
                    mode: 'cors',
                    body: formData
                });
                const result = await response.json().catch(() => ({}));
                if (response.ok) {
                    showMessage(applyForm, 'Application submitted successfully.');
                    applyForm.reset();
                } else {
                    const errText = result.error || response.statusText || 'Unknown error';
                    showMessage(applyForm, 'Error: ' + errText, false);
                }
            } catch (err) {
                console.error('Apply form network error:', err);
                showMessage(applyForm, 'Server not connected.', false);
            }
        });
    }

    
    // COUNTER ANIMATION FOR STATS
    
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    // Trigger counter animation when in viewport
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));

    
    // CLOSE MOBILE MENU ON OUTSIDE CLICK
    
    document.addEventListener('click', function (e) {
        if (navbarMenu && navbarMenu.classList.contains('active')) {
            if (!navbarMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navbarMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');

                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
        }
    });
    // LAZY LOADING IMAGES
    const lazyImages = document.querySelectorAll('img[data-src]');

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

    lazyImages.forEach(img => imageObserver.observe(img));

    function setupJobCardPagination() {
        const cardsContainer = document.getElementById('job-cards');
        const paginationContainer = document.getElementById('job-pagination');
        if (!cardsContainer || !paginationContainer) return;

        const cards = Array.from(cardsContainer.querySelectorAll('.card'));
        const cardsPerPage = Math.max(1, Number(cardsContainer.dataset.pageSize) || 3);
        const totalPages = Math.ceil(cards.length / cardsPerPage);

        const renderPage = (page) => {
            const start = (page - 1) * cardsPerPage;
            const end = page * cardsPerPage;
            cards.forEach((card, i) => {
                card.style.display = (i >= start && i < end) ? 'block' : 'none';
            });

            paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
                btn.classList.toggle('active', Number(btn.dataset.page) === page);
            });

            const jobsSection = cardsContainer.closest('section');
            if (jobsSection) {
                jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        paginationContainer.innerHTML = '';
        for (let page = 1; page <= totalPages; page += 1) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'page-btn';
            button.textContent = String(page);
            button.dataset.page = String(page);
            button.addEventListener('click', () => renderPage(page));
            paginationContainer.appendChild(button);
        }

        if (totalPages > 0) {
            renderPage(1);
        }
    }

    setupJobCardPagination();

    console.log('Cofomo Tech - Website Loaded Successfully');
});
   