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
    const ctx = document.getElementById('skillsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Pharmacognosy', 'Phytochemistry', 'Ethnobotany', 'Chemical Ecology', 'Food Science', 'Citizen Science'],
                datasets: [{
                    label: 'Skills',
                    data: [90, 85, 80, 75, 70, 65],
                    backgroundColor: 'rgba(185, 129, 250, 0.2)',
                    borderColor: 'rgba(185, 129, 250, 1)',
                    pointBackgroundColor: 'rgba(185, 129, 250, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(185, 129, 250, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                        grid: { color: 'rgba(255, 255, 255, 0.2)' },
                        pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 9 } },
                        ticks: { backdropColor: 'rgba(255, 255, 255, 0.8)', color: 'rgba(255, 255, 255, 0.7)', font: { size: 8 }, maxTicksLimit: 8 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

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
});

// Dark mode toggle
function switchTheme() {
    document.body.classList.toggle("darkmode");
    
    // Update chart colors if it exists
    const chart = Chart.getChart("skillsChart");
    if (chart) {
        const isDarkMode = document.body.classList.contains("darkmode");
        chart.data.datasets[0].backgroundColor = isDarkMode ? 'rgba(185, 129, 250, 0.2)' : 'rgba(194, 33, 105, 0.2)';
        chart.data.datasets[0].borderColor = isDarkMode ? 'rgba(185, 129, 250, 1)' : 'rgba(194, 33, 105, 1)';
        chart.data.datasets[0].pointBackgroundColor = isDarkMode ? 'rgba(185, 129, 250, 1)' : 'rgba(194, 33, 105, 1)';
        chart.data.datasets[0].pointHoverBorderColor = isDarkMode ? 'rgba(185, 129, 250, 1)' : 'rgba(194, 33, 105, 1)';
        chart.options.scales.r.angleLines.color = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
        chart.options.scales.r.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
        chart.options.scales.r.pointLabels.color = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        chart.options.scales.r.ticks.backdropColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        chart.options.scales.r.ticks.color = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
        chart.update();
    }
}
