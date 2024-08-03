// Function to toggle the navigation menu in mobile view
function toggleMenu() {
    const nav = document.getElementById('main-nav');
    nav.classList.toggle('show');
}

// Function to switch between light and dark themes
function switchTheme() {
    const body = document.body;
    body.classList.toggle('darkmode');
}

// Function to handle fade-in effect for elements
function fadeInElements() {
    const elements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;
    elements.forEach(element => {
        const position = element.getBoundingClientRect().top;
        if (position - windowHeight <= 0) {
            element.classList.add('visible');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fadeInElements();
    window.addEventListener('scroll', fadeInElements);
});
