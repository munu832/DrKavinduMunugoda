@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Merriweather:wght@300;400;700&display=swap');

:root {
    --bg-color-1: #071739;
    --bg-color-2: #a3a3a3;
    --bg-color-3: #4b6382;
    --bg-color-4: #cdd5db;
    --text-color-dark: #333333;
    --text-color-light: #e0e0e0;
    --accent-color: #9ca430;
    --accent-color1: #a56328;
    --accent-color2: #3c3d1e;
    --secondary-bg: #a68868;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Roboto', sans-serif;
    line-height: 1.6;
    color: var(--text-color-dark);
}

header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: rgba(26, 26, 26, 0.9);
    padding: 1rem;
    z-index: 1000;
}

nav ul {
    display: flex;
    justify-content: flex-end;
    list-style-type: none;
}

nav ul li {
    margin-left: 2rem;
}

nav ul li a {
    color: var(--text-color-light);
    text-decoration: none;
    transition: color 0.3s ease;
}

nav ul li a:hover {
    color: var(--accent-color);
}

main {
    padding-top: 4rem;
}

section {
    padding: 4rem 2rem;
}

h1, h2, h3 {
    font-family: 'Merriweather', serif;
    margin-bottom: 1rem;
}

h1 {
    font-size: 3.5rem;
    color: var(--accent-color1);
    font-weight: 700;
}

h2 {
    font-size: 2.5rem;
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 0.5rem;
    margin-bottom: 2rem;
}

.asymmetric-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

#hero {
    background-color: var(--bg-color-1);
    color: var(--text-color-light);
    position: relative;
    height: 100vh;
    overflow: hidden;
}

.hero-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 1s ease-in-out;
}

.hero-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 1;
}

#about {
    background-color: var(--bg-color-2);
}

#education {
    background-color: var(--bg-color-3);
}

.education-item {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 1.5rem;
    transition: transform 0.3s ease;
}

.education-item:hover {
    transform: translateY(-5px);
}

#experience {
    background-color: var(--bg-color-4);
}

#consultancy {
    background-color: var(--bg-color-2);
}

#research {
    background-color: var(--bg-color-3);
}

.research-item {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.research-item:hover {
    transform: translateY(-5px);
}

#publications {
    background-color: var(--bg-color-4);
}

.publication {
    background-color: #f8f8f8;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    transition: transform 0.3s ease;
}

.publication:hover {
    transform: translateY(-5px);
}

#contact {
    background-color: var(--bg-color-2);
}

.social-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
}

.social-links a {
    color: var(--accent-color2);
    text-decoration: none;
    transition: color 0.3s ease;
}

.social-links a:hover {
    color: var(--text-color-dark);
}

footer {
    text-align: center;
    padding: 2rem;
    background-color: var(--secondary-bg);
    color: var(--text-color-light);
}

.fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}

#timeline-embed,
#consultancy-timeline-embed {
    margin-top: 20px;
    margin-bottom: 20px;
}

.tl-timeline {
    font-family: 'Roboto', sans-serif;
}

.tl-timeline h1,
.tl-timeline h2,
.tl-timeline h3 {
    font-family: 'Merriweather', serif;
}

@media (max-width: 768px) {
    header {
        position: static;
        background-color: rgba(26, 26, 26, 1);
    }

    nav ul {
        flex-direction: column;
        align-items: center;
    }

    nav ul li {
        margin: 0.5rem 0;
    }

    main {
        padding-top: 0;
    }

    h1 {
        font-size: 2.5rem;
    }

    h2 {
        font-size: 2rem;
    }

    .hero-content {
        padding: 1rem;
    }
}
