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

    // Function to load YouTube video
    window.loadVideo = function(videoId) {
        const videoContainer = document.getElementById('video-container');
        if (videoContainer) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.width = '560';
            iframe.height = '315';
            iframe.allowFullscreen = true;
            videoContainer.innerHTML = ''; // Clear any existing content
            videoContainer.appendChild(iframe);
            
          // Tab functionality
    const tabContainer = document.querySelector('.tab-container');
    const tabDetails = document.getElementById('tab-details');
    const tabTitle = document.getElementById('tab-title');
    const tabVideo = document.getElementById('tab-video');

    let isScrolling = false;
    let scrollAmount = 0;
    const scrollStep = 2;

    function autoScroll() {
        if (!isScrolling) return;

        scrollAmount += scrollStep;
        tabContainer.scrollLeft = scrollAmount;

        if (scrollAmount >= tabContainer.scrollWidth - tabContainer.clientWidth) {
            scrollAmount = 0;
        }

        requestAnimationFrame(autoScroll);
    }

    tabContainer.addEventListener('mouseenter', () => {
        isScrolling = false;
    });

    tabContainer.addEventListener('mouseleave', () => {
        isScrolling = true;
        autoScroll();
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('mouseenter', () => {
            const title = tab.dataset.title;
            const video = tab.dataset.video;
            tabTitle.textContent = title;
            tabVideo.innerHTML = `<video width="100%" height="100%" controls>
                                    <source src="${video}" type="video/mp4">
                                    Your browser does not support the video tag.
                                  </video>`;
            tabDetails.style.display = 'block';
        });

        tab.addEventListener('click', () => {
            const link = tab.dataset.link;
            if (link) {
                window.location.href = link;
            }
        });
    });

    // Start auto-scrolling
    isScrolling = true;
    autoScroll();
});
        }
    };
});
