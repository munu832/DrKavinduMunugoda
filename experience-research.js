document.addEventListener('DOMContentLoaded', function() {
    fetch('experience-research.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('experience-research-content').innerHTML = data;
        });
});
