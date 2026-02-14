// Main JavaScript - Dr. Kavindu Munugoda Website
console.log('=== Script Loading Started ===');
console.log('ECharts available:', typeof echarts !== 'undefined');
console.log('Anime available:', typeof anime !== 'undefined');

// Global chart variable
let myChart = null;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM Content Loaded ===');
    
    // 1. DARK MODE
    console.log('Initializing dark mode...');
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
        console.log('Dark mode toggle initialized');
    }

    // 2. MOBILE MENU
    console.log('Initializing mobile menu...');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('show');
            if(isOpen) {
                mobileMenu.classList.remove('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileMenuBtn.querySelector('i');
                if(icon) icon.classList.replace('fa-times', 'fa-bars');
            } else {
                mobileMenu.classList.add('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                const icon = mobileMenuBtn.querySelector('i');
                if(icon) icon.classList.replace('fa-bars', 'fa-times');
            }
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileMenuBtn.querySelector('i');
                if(icon) icon.classList.replace('fa-times', 'fa-bars');
            });
        });

        document.addEventListener('click', (e) => {
            if(!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                if(mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    const icon = mobileMenuBtn.querySelector('i');
                    if(icon) icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
        console.log('Mobile menu initialized');
    }

    // 3. BACK TO TOP BUTTON
    console.log('Initializing back to top...');
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
        console.log('Back to top initialized');
    }

    // 4. ECHARTS RADAR CHART
    console.log('Initializing ECharts...');
    const chartDom = document.getElementById('skills-chart');
    console.log('Chart DOM found:', chartDom !== null);
    
    function initChart() {
        if (!chartDom) {
            console.error('Chart DOM not found');
            return;
        }
        
        if(typeof echarts === 'undefined') {
            console.error('ECharts library not loaded');
            return;
        }
        
        console.log('Creating chart...');
        const isDark = html.classList.contains('dark');
        const mainColor = isDark ? '#9CAF88' : '#0D4F4C';
        const labelColor = isDark ? '#e2e8f0' : '#2C2C2C';
        
        try {
            myChart = echarts.init(chartDom);
            console.log('Chart instance created');
            
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
            console.log('✓ Chart initialized successfully');
        } catch(error) {
            console.error('Error initializing chart:', error);
        }
    }
    
    // Initialize chart immediately
    if(typeof echarts !== 'undefined') {
        initChart();
    } else {
        console.error('ECharts not loaded, waiting...');
        setTimeout(initChart, 500);
    }
    
    // Responsive resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if(myChart) {
                myChart.resize();
                console.log('Chart resized');
            }
        }, 250);
    });

    // 5. PARTICLE SYSTEM
    console.log('Initializing particles...');
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
        console.log('Particles initialized');
        
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

    // 6. COUNTER ANIMATIONS
    console.log('Initializing counters...');
    const counters = document.querySelectorAll('.counter');
    console.log('Counters found:', counters.length);
    
    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out function
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOutProgress);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end;
                console.log('Counter animated to:', end);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    if(counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.dataset.target);
                    console.log('Animating counter to:', target);
                    animateValue(entry.target, 0, target, 2000);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px'
        });
        
        counters.forEach(c => {
            counterObserver.observe(c);
            console.log('Observing counter with target:', c.dataset.target);
        });
    }

    // 7. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if(href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if(target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 8. LAZY LOAD IMAGES
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

    // 9. NAV HIGHLIGHTING
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

    console.log('=== Initialization Complete ===');
    
    // Easter egg
    console.log('%c👋 Hi there, fellow developer!', 'color: #0D4F4C; font-size: 20px; font-weight: bold;');
    console.log('%cEmail: kdmunugoda@gmail.com', 'color: #9CAF88; font-size: 12px;');
});
