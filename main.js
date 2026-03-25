// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // 1. Dark Mode Logic
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    if(themeToggle){
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
            if(myChart) {
                myChart.dispose();
                initChart();
            }
        });
    }

    // 2. Mobile Menu Toggle — FIXED
    // Root cause: CSS uses max-height/show for animation, but JS was only toggling
    // Tailwind's `hidden` (display:none). When `hidden` was removed, the CSS
    // `max-height: 0` still collapsed the menu to zero height — nothing visible.
    // Fix: remove `hidden` permanently from the element and rely solely on the
    // `.show` class (which sets max-height: 500px) to open/close.
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if(mobileMenuBtn && mobileMenu) {
        // Remove Tailwind's `hidden` so CSS max-height transition can work
        mobileMenu.classList.remove('hidden');

        function openMenu() {
            mobileMenu.classList.add('show');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            mobileMenuBtn.querySelector('i').classList.replace('fa-bars', 'fa-times');
        }

        function closeMenu() {
            mobileMenu.classList.remove('show');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }

        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.contains('show') ? closeMenu() : openMenu();
        });

        // Close when a nav link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if(mobileMenu.classList.contains('show') &&
               !mobileMenu.contains(e.target) &&
               !mobileMenuBtn.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // 3. Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    
    if(backToTop) {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Optimized ECharts Radar Chart
    let myChart = null;
    const chartDom = document.getElementById('skills-chart');
    
    function initChart() {
        if (!chartDom) return;
        if(typeof echarts === 'undefined') {
            console.error('ECharts not loaded');
            return;
        }
        
        const isDark = html.classList.contains('dark');
        const mainColor = isDark ? '#9CAF88' : '#0D4F4C'; 
        const labelColor = isDark ? '#e2e8f0' : '#2C2C2C';
        
        myChart = echarts.init(chartDom);
        const option = {
            backgroundColor: 'transparent',
            radar: {
                indicator: [
                    { name: 'Drug Discovery\n(AutoDock/PyRx)', max: 100 },
                    { name: 'Virology\n(Cell Culture)', max: 100 },
                    { name: 'Phytochemistry\n(GC-MS)', max: 100 },
                    { name: 'Data Analysis\n(Python/R)', max: 100 },
                    { name: 'Mol. Biology\n(Cloning/PCR)', max: 100 }
                ],
                shape: 'circle',
                splitNumber: 4,
                axisName: {
                    color: labelColor,
                    fontWeight: 'bold',
                    fontSize: window.innerWidth < 768 ? 9 : 11
                },
                splitLine: {
                    lineStyle: {
                        color: isDark 
                            ? ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)'] 
                            : ['rgba(13, 79, 76, 0.1)', 'rgba(13, 79, 76, 0.2)'].reverse()
                    }
                },
                splitArea: { show: false },
                axisLine: { 
                    lineStyle: { 
                        color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(13, 79, 76, 0.3)' 
                    } 
                }
            },
            series: [{
                name: 'Skills',
                type: 'radar',
                data: [{
                    value: [90, 85, 95, 80, 85],
                    name: 'Expertise',
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: mainColor },
                    lineStyle: { width: 2, color: mainColor },
                    areaStyle: {
                        color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                            { color: isDark ? 'rgba(156, 175, 136, 0.5)' : 'rgba(13, 79, 76, 0.5)', offset: 0 },
                            { color: 'rgba(255,255,255, 0.05)', offset: 1 }
                        ])
                    }
                }]
            }]
        };
        myChart.setOption(option);
        console.log('Chart initialized');
    }
    
    if(typeof echarts !== 'undefined') {
        initChart();
    } else {
        window.addEventListener('load', () => {
            setTimeout(initChart, 100);
        });
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if(myChart) myChart.resize();
        }, 250);
    });

    // 5. Lightweight "Molecular" Particle System
    const canvasContainer = document.getElementById('particles-js');
    if (canvasContainer) {
        const canvas = document.createElement('canvas');
        canvasContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 30 : 50; 
        let animationFrameId;
        
        function resize() {
            width = canvas.width = canvasContainer.offsetWidth;
            height = canvas.height = canvasContainer.offsetHeight;
        }
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 3 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }
            draw(isDark) {
                ctx.fillStyle = isDark ? '#9CAF88' : '#0D4F4C';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            const isDark = html.classList.contains('dark');
            
            particles.forEach(p => {
                p.update();
                p.draw(isDark);
            });
            
            ctx.strokeStyle = isDark ? 'rgba(156, 175, 136, 0.15)' : 'rgba(13, 79, 76, 0.1)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        }
        
        resize();
        initParticles();
        animate();
        
        let particleResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(particleResizeTimeout);
            particleResizeTimeout = setTimeout(() => {
                resize();
                initParticles();
            }, 250);
        });

        document.addEventListener('visibilitychange', () => {
            if(document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate();
            }
        });
    }

    // 6. Number Counters
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        let current = 0;
        const increment = target / 60;
        const duration = 2000;
        const stepTime = duration / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if(current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }
    
    const counters = document.querySelectorAll('.counter');
    if(counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counters.forEach(c => counterObserver.observe(c));
    }

    // 7. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if(href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if(target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // 8. Lazy load images
    if('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const img = entry.target;
                    if(img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 9. Active nav highlight on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        let scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if(scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-primary', 'dark:text-accent');
                    if(link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('text-primary', 'dark:text-accent');
                    }
                });
            }
        });
    }

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(highlightNavigation, 50);
    });

    // 10. Console Easter Egg
    console.log('%c👋 Hi there, fellow developer!', 'color: #0D4F4C; font-size: 20px; font-weight: bold;');
    console.log('%cInterested in my research or collaboration? Let\'s connect!', 'color: #B87333; font-size: 14px;');
    console.log('%cEmail: kdmunugoda@gmail.com', 'color: #9CAF88; font-size: 12px;');

    // 11. Image Slideshow
    const slideshowContainer = document.querySelector('.slideshow-container');
    
    if(slideshowContainer) {
        const slides = slideshowContainer.querySelectorAll('.slide');
        const dots = slideshowContainer.querySelectorAll('.slideshow-dot');
        const prevBtn = slideshowContainer.querySelector('.slideshow-prev');
        const nextBtn = slideshowContainer.querySelector('.slideshow-next');
        let currentSlide = 0;
        let slideInterval;
        
        function showSlide(index) {
            if(index >= slides.length) {
                currentSlide = 0;
            } else if(index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            });
            dots.forEach(dot => {
                dot.classList.remove('bg-white');
                dot.classList.add('bg-white/50');
            });
            slides[currentSlide].classList.add('active');
            slides[currentSlide].style.opacity = '1';
            if(dots[currentSlide]) {
                dots[currentSlide].classList.remove('bg-white/50');
                dots[currentSlide].classList.add('bg-white');
            }
        }
        
        function nextSlide() { showSlide(currentSlide + 1); }
        function prevSlide() { showSlide(currentSlide - 1); }
        function startAutoPlay() { slideInterval = setInterval(nextSlide, 5000); }
        function stopAutoPlay() { clearInterval(slideInterval); }
        
        if(nextBtn) {
            nextBtn.addEventListener('click', () => { nextSlide(); stopAutoPlay(); startAutoPlay(); });
        }
        if(prevBtn) {
            prevBtn.addEventListener('click', () => { prevSlide(); stopAutoPlay(); startAutoPlay(); });
        }
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { showSlide(index); stopAutoPlay(); startAutoPlay(); });
        });
        
        slideshowContainer.addEventListener('mouseenter', stopAutoPlay);
        slideshowContainer.addEventListener('mouseleave', startAutoPlay);
        
        document.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowLeft') { prevSlide(); stopAutoPlay(); startAutoPlay(); }
            else if(e.key === 'ArrowRight') { nextSlide(); stopAutoPlay(); startAutoPlay(); }
        });
        
        let touchStartX = 0;
        let touchEndX = 0;
        slideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        slideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if(touchEndX < touchStartX - 50) { nextSlide(); stopAutoPlay(); startAutoPlay(); }
            if(touchEndX > touchStartX + 50) { prevSlide(); stopAutoPlay(); startAutoPlay(); }
        });
        
        showSlide(0);
        startAutoPlay();
        
        document.addEventListener('visibilitychange', () => {
            if(document.hidden) { stopAutoPlay(); } else { startAutoPlay(); }
        });
    }
});
