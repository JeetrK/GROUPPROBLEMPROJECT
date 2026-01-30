// Smooth scrolling for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add entrance animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loading state
    document.body.classList.add('loading');
    
    // Remove loading state after animations
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 800);

    // Add hover animations to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button, index) => {
        button.style.animationDelay = `${0.4 + index * 0.1}s`;
    });
});
