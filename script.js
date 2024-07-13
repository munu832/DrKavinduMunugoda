document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Initialize Altmetric badges
    if (typeof _altmetric_embed_init === 'function') {
        _altmetric_embed_init();
    }

    // Skills chart
    const ctx = document.getElementById('skillsChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Pharmacognosy', 'Phytochemistry', 'Ethnobotany', 'Chemical Ecology', 'Food Science', 'Citizen Science'],
            datasets: [{
                label: 'Skills',
                data: [90, 85, 80, 75, 70, 65],
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderColor: 'rgba(76, 175, 80, 1)',
                pointBackgroundColor: 'rgba(76, 175, 80, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(76, 175, 80, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.2)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.2)'
                    },
                    pointLabels: {
                        color: 'rgba(0, 0, 0, 0.7)'
                    },
                    ticks: {
                        backdropColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'rgba(0, 0, 0, 0.7)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to handle scroll animations
    function handleScrollAnimations() {
        document.querySelectorAll('.fade-in').forEach((element) => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }

    // Add fade-in class to sections
    document.querySelectorAll('section').forEach((section) => {
        section.classList.add('fade-in');
    });

    // Initial check for elements in viewport
    handleScrollAnimations();

    // Listen for scroll events
    window.addEventListener('scroll', handleScrollAnimations);

    // Hero image slideshow
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? 1 : 0;
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 5000); // Change slide every 5 seconds
    showSlide(currentSlide); // Show initial slide

    // Initialize TimelineJS for Experience
    new TL.Timeline('timeline-embed', 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQk3cMHpWAr7qvvYtaNkfwRCZ2pgoIrl6_7u4QmDnXOsEZczjWxgJKLj3DFqgEReRBvv1xvG1P4ex9u/pubhtml');

    // Initialize TimelineJS for Consultancy
    new TL.Timeline('consultancy-timeline-embed', 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ7fHMOKu88GKTrQ14jG__3t_btU_8JWYuAQd-CQJGNlgMr-I2aAouN3dMBbW9NKxh7Y6oy5x346ZY/pubhtml');
});
