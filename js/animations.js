//
document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // SCROLL REVEAL ANIMATION
    // ========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve after revealing to improve performance
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ========================================
    // PARALLAX EFFECT ON SCROLL
    // ========================================
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // ========================================
    // STAGGER ANIMATION ON SCROLL
    // ========================================
    const staggerContainers = document.querySelectorAll('[data-stagger]');

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.stagger-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    staggerContainers.forEach(container => {
        staggerObserver.observe(container);
    });

    // ========================================
    // HERO TEXT ANIMATION
    // ========================================
    const heroTitle = document.querySelector('.hero h1');

    if (heroTitle && !sessionStorage.getItem('heroAnimated')) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';

        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            } else {
                sessionStorage.setItem('heroAnimated', 'true');
            }
        };

        setTimeout(typeWriter, 500);
    }

    // ========================================
    // SCROLL PROGRESS INDICATOR
    // ========================================
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 4px;
      background: linear-gradient(90deg, #F4A460, #FFB84D);
      z-index: 10000;
      transition: width 0.1s ease;
    `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    };

    // Uncomment to enable scroll progress bar
    // createScrollProgress();

    // ========================================
    // SMOOTH CARD HOVER EFFECT
    // ========================================
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function (e) {
            this.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ========================================
    // CURSOR TRAIL EFFECT (Optional Premium Touch)
    // ========================================
    const createCursorTrail = () => {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(244, 164, 96, 0.3);
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
      display: none;
    `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
        });
    };

    // Uncomment to enable custom cursor
    // createCursorTrail();

    console.log('Cofomo Tech - Animations Initialized');
});
