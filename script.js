// Background image rotation
const allImages = [
    'IMG_4761.jpg',
    'ai-generated-smiling-male-teacher-in-classroom-with-elementary-school-students-learning-in-the-background-photo.jpg',
    'images.jpg',
    'istockphoto-1484760781-612x612.jpg',
    'istockphoto-515264642-612x612.jpg',
    'marlboro-high-school-marlboro-nj-3-schoolphoto.avif',
    'student-teacher-classroom-26272062.webp'
];

let currentImageIndex = 0;

function rotateBackgroundImages() {
    const bgImages = document.querySelectorAll('.bg-img');
    bgImages.forEach((img, index) => {
        const imageIndex = (currentImageIndex + index) % allImages.length;
        img.src = `imgs/${allImages[imageIndex]}`;
    });
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial rotation
    rotateBackgroundImages();
    
    // Rotate images every 3 seconds
    setInterval(rotateBackgroundImages, 3000);
});

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
