// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // 1. Dark Mode Logic
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check saved preference or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    if(themeToggle){
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
            
            // Reinitialize chart with new theme
            if(myChart) {
                myChart.dispose();
                initChart();
            }
        });
    }

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('show');
            
            if(isOpen) {
                mobileMenu.classList.remove('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            } else {
                mobileMenu.classList.add('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                mobileMenuBtn.querySelector('i').classList.replace('fa-bars', 'fa-times');
            }
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if(!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                if(mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
                }
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Optimized ECharts Radar Chart
    let myChart = null;
    const chartDom = document.getElementById('skills-chart');
    
    function initChart() {
        if (!chartDom) return;
        
        // Wait for echarts to be available
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
                            { 
                                color: isDark ? 'rgba(156, 175, 136, 0.5)' : 'rgba(13, 79, 76, 0.5)', 
                                offset: 0 
                            },
                            { 
                                color: 'rgba(255,255,255, 0.05)', 
                                offset: 1 
                            }
                        ])
                    }
                }]
            }]
        };
        myChart.setOption(option);
        console.log('Chart initialized');
    }
    
    // Initialize chart when echarts is ready
    if(typeof echarts !== 'undefined') {
        initChart();
    } else {
        // Wait for echarts to load
        window.addEventListener('load', () => {
            setTimeout(initChart, 100);
        });
    }
    
    // Responsive chart resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if(myChart) {
                myChart.resize();
            }
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
            
            // Draw connections (Molecular Bonds)
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
        
        // Handle window resize
        let particleResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(particleResizeTimeout);
            particleResizeTimeout = setTimeout(() => {
                resize();
                initParticles();
            }, 250);
        });

        // Pause animation when page is not visible (performance optimization)
        document.addEventListener('visibilitychange', () => {
            if(document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate();
            }
        });
    }

    // 6. Number Counters - Simple and Reliable
    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        let current = 0;
        const increment = target / 60; // 60 frames for smooth animation
        const duration = 2000; // 2 seconds
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
        // Use IntersectionObserver for better performance
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
            
            // Don't prevent default for # only links
            if(href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if(target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 8. Lazy load images (if any)
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

    // 9. Add active state to navigation based on scroll position
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

    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(highlightNavigation, 50);
    });

    // 10. Console Easter Egg for developers
    console.log(
        '%c👋 Hi there, fellow developer!',
        'color: #0D4F4C; font-size: 20px; font-weight: bold;'
    );
    console.log(
        '%cInterested in my research or collaboration? Let\'s connect!',
        'color: #B87333; font-size: 14px;'
    );
    console.log(
        '%cEmail: kdmunugoda@gmail.com',
        'color: #9CAF88; font-size: 12px;'
    );

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
            // Wrap around
            if(index >= slides.length) {
                currentSlide = 0;
            } else if(index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }
            
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            });
            
            // Remove active state from all dots
            dots.forEach(dot => {
                dot.classList.remove('bg-white');
                dot.classList.add('bg-white/50');
            });
            
            // Show current slide
            slides[currentSlide].classList.add('active');
            slides[currentSlide].style.opacity = '1';
            
            // Highlight current dot
            if(dots[currentSlide]) {
                dots[currentSlide].classList.remove('bg-white/50');
                dots[currentSlide].classList.add('bg-white');
            }
        }
        
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            showSlide(currentSlide - 1);
        }
        
        function startAutoPlay() {
            slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }
        
        function stopAutoPlay() {
            clearInterval(slideInterval);
        }
        
        // Next/Previous buttons
        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoPlay();
                startAutoPlay(); // Restart autoplay after manual navigation
            });
        }
        
        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoPlay();
                startAutoPlay(); // Restart autoplay after manual navigation
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoPlay();
                startAutoPlay(); // Restart autoplay after manual navigation
            });
        });
        
        // Pause on hover
        slideshowContainer.addEventListener('mouseenter', stopAutoPlay);
        slideshowContainer.addEventListener('mouseleave', startAutoPlay);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoPlay();
                startAutoPlay();
            } else if(e.key === 'ArrowRight') {
                nextSlide();
                stopAutoPlay();
                startAutoPlay();
            }
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        slideshowContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slideshowContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if(touchEndX < touchStartX - 50) {
                // Swipe left - next slide
                nextSlide();
                stopAutoPlay();
                startAutoPlay();
            }
            if(touchEndX > touchStartX + 50) {
                // Swipe right - previous slide
                prevSlide();
                stopAutoPlay();
                startAutoPlay();
            }
        }
        
        // Initialize
        showSlide(0);
        startAutoPlay();
        
        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            if(document.hidden) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });
    }
});
