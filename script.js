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

    // Hero image slideshow
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentHeroSlide = 0;

    function showHeroSlide(index) {
        heroSlides[currentHeroSlide].classList.remove('active');
        heroSlides[index].classList.add('active');
        currentHeroSlide = index;
    }

    function nextHeroSlide() {
        showHeroSlide((currentHeroSlide + 1) % heroSlides.length);
    }

    setInterval(nextHeroSlide, 5000);

    // Slideshow for Experience and Consultancy sections
    let slideIndex = {
        'experience': 1,
        'consultancy': 1
    };

    let slideshowIntervals = {};

    function startSlideshow(section) {
        showSlides(section, slideIndex[section]);
        slideshowIntervals[section] = setInterval(() => {
            changeSlide(1, section);
        }, 5000); // Change slide every 5 seconds
    }

    function stopSlideshow(section) {
        clearInterval(slideshowIntervals[section]);
    }

    startSlideshow('experience');
    startSlideshow('consultancy');

    window.changeSlide = function(n, section) {
        stopSlideshow(section);
        showSlides(section, slideIndex[section] += n);
        startSlideshow(section);
    }

    function showSlides(section, n) {
        let i;
        let slides = document.querySelectorAll(`#${section} .slideshow-slide`);
        if (n > slides.length) {slideIndex[section] = 1}
        if (n < 1) {slideIndex[section] = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex[section]-1].style.display = "block";
    }

    // Add click events to slides
    document.querySelectorAll('.slideshow-slide').forEach(slide => {
        slide.addEventListener('click', function() {
            const section = this.closest('section').id;
            changeSlide(1, section);
        });
    });

    // Add mouseover and mouseout events to pause and resume slideshow
    document.querySelectorAll('.slideshow-container').forEach(container => {
        const section = container.closest('section').id;
        container.addEventListener('mouseover', () => stopSlideshow(section));
        container.addEventListener('mouseout', () => startSlideshow(section));
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
});
