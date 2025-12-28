// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Don't prevent default for external links or links without hash
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Initialize Altmetric badges
    if (typeof _altmetric_embed_init === 'function') {
        _altmetric_embed_init();
    }

    // Initialize Dimensions badges
    if (typeof __dimensions_embed === 'object' && __dimensions_embed.addBadges) {
        __dimensions_embed.addBadges();
    }

    // Skills chart
    const ctx = document.getElementById('skillsChart');
    if (ctx) {
        createSkillsChart(ctx);
    }

    // Initialize loading screen fade out
    window.addEventListener('load', function() {
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    });

    // Fade-in effect
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Initial check on page load

    // Active navbar item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((navItem, i) => {
        navItem.addEventListener("click", () => {
            navItems.forEach((item, j) => {
                item.className = "nav-item";
            });
            navItem.className = "nav-item active";
        });
    });

    // Initialize carousel
    initCarousel();

    // Initialize mobile menu toggle
    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('click', toggleMenu);
    }
});

// ===== DARK MODE TOGGLE =====
function switchTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    body.classList.toggle("darkmode");
    
    if (body.classList.contains("darkmode")) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
    
    // Update chart colors if it exists
    const chart = Chart.getChart("skillsChart");
    if (chart) {
        const isDarkMode = body.classList.contains("darkmode");
        chart.data.datasets[0].backgroundColor = isDarkMode ? 'rgba(185, 129, 250, 0.2)' : 'rgba(52, 152, 219, 0.2)';
        chart.data.datasets[0].borderColor = isDarkMode ? 'rgba(185, 129, 250, 1)' : 'rgba(52, 152, 219, 1)';
        chart.data.datasets[0].pointBackgroundColor = isDarkMode ? 'rgba(185, 129, 250, 1)' : 'rgba(52, 152, 219, 1)';
        chart.data.datasets[0].pointHoverBorderColor = isDarkMode ? 'rgba(185, 129, 250, 1)' : 'rgba(52, 152, 219, 1)';
        chart.options.scales.r.angleLines.color = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
        chart.options.scales.r.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
        chart.options.scales.r.pointLabels.color = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        chart.options.scales.r.ticks.backdropColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        chart.options.scales.r.ticks.color = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        chart.update();
    }
}

// ===== SKILLS CHART CREATION =====
function createSkillsChart(ctx) {
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Pharmacognosy', 'Phytochemistry', 'Ethnobotany', 'Molecular\nVirology', 'Chemical\nEcology'],
            datasets: [{
                label: 'Skills',
                data: [90, 85, 80, 75, 65],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.2)' },
                    grid: { color: 'rgba(0, 0, 0, 0.2)' },
                    pointLabels: { 
                        color: 'rgba(0, 0, 0, 0.7)', 
                        font: { 
                            size: 12,
                            family: "'Supreme', sans-serif"
                        } 
                    },
                    ticks: { 
                        display: false,
                        beginAtZero: true,
                        max: 100
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
}

// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
    var nav = document.getElementById("main-nav");
    nav.classList.toggle("show");
}

// ===== HERO CAROUSEL FUNCTIONALITY =====
function initCarousel() {
    const cards = document.querySelectorAll(".card");
    const dots = document.querySelectorAll(".dot");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");
    
    // Check if carousel elements exist
    if (!cards.length || !leftArrow || !rightArrow) return;
    
    let currentIndex = 0;
    let isAnimating = false;
    let autoPlayInterval;
    let isAutoPlayActive = true;
    const AUTO_PLAY_DURATION = 4000; // 4 seconds

    // Initialize auto-play
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        
        autoPlayInterval = setInterval(() => {
            if (!isAnimating) {
                updateCarousel(currentIndex + 1);
            }
        }, AUTO_PLAY_DURATION);
    }

    // Update carousel
    function updateCarousel(newIndex) {
        if (isAnimating) return;
        isAnimating = true;
        
        currentIndex = (newIndex + cards.length) % cards.length;
        
        cards.forEach((card, i) => {
            const offset = (i - currentIndex + cards.length) % cards.length;
            
            card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");
            
            if (offset === 0) {
                card.classList.add("center");
            } else if (offset === 1) {
                card.classList.add("right-1");
            } else if (offset === 2) {
                card.classList.add("right-2");
            } else if (offset === cards.length - 1) {
                card.classList.add("left-1");
            } else if (offset === cards.length - 2) {
                card.classList.add("left-2");
            } else {
                card.classList.add("hidden");
            }
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
        
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Event Listeners for carousel
    leftArrow.addEventListener("click", () => {
        updateCarousel(currentIndex - 1);
        // Reset auto-play timer on manual interaction
        if (isAutoPlayActive) {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    });

    rightArrow.addEventListener("click", () => {
        updateCarousel(currentIndex + 1);
        // Reset auto-play timer on manual interaction
        if (isAutoPlayActive) {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            updateCarousel(i);
            // Reset auto-play timer on manual interaction
            if (isAutoPlayActive) {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
        });
    });

    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            updateCarousel(i);
            // Reset auto-play timer on manual interaction
            if (isAutoPlayActive) {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
        });
    });

    // Keyboard navigation for carousel
    document.addEventListener("keydown", (e) => {
        // Only handle carousel keys if we're not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        
        if (e.key === "ArrowLeft") {
            updateCarousel(currentIndex - 1);
            if (isAutoPlayActive) {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
        } else if (e.key === "ArrowRight") {
            updateCarousel(currentIndex + 1);
            if (isAutoPlayActive) {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
        }
    });

    // Touch/swipe handling for carousel
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 50;

    const carouselTrack = document.querySelector('.carousel-track');
    if (carouselTrack) {
        carouselTrack.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselTrack.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) {
                // Swipe left - next image
                updateCarousel(currentIndex + 1);
            } else {
                // Swipe right - previous image
                updateCarousel(currentIndex - 1);
            }
            
            // Reset auto-play timer on swipe
            if (isAutoPlayActive) {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
        }
    }

    // Pause auto-play when page is not visible
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && isAutoPlayActive) {
            clearInterval(autoPlayInterval);
        } else if (!document.hidden && isAutoPlayActive) {
            startAutoPlay();
        }
    });

    // Initialize carousel
    updateCarousel(0);
    startAutoPlay();
}

// ===== FALLBACK FOR DYNAMIC LOADING =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Functions are already called in the main DOMContentLoaded
    });
} else {
    // If DOM is already loaded, initialize everything
    document.addEventListener('DOMContentLoaded', function() {
        // This ensures the carousel initializes even if the page loads dynamically
        setTimeout(initCarousel, 100);
    });
}

// ===== WINDOW LOAD EVENT =====
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    // Ensure carousel is initialized after everything loads
    setTimeout(initCarousel, 100);
});
