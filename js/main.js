// Footer visibility handler
document.addEventListener('DOMContentLoaded', function() {
    // Initial check for footer visibility
    checkFooterVisibility();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkFooterVisibility);
    
    // Also check on window resize
    window.addEventListener('resize', checkFooterVisibility);
});

function checkFooterVisibility() {
    const footer = document.querySelector('.footer');
    if (!footer) return; // Safety check
    
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollPosition >= documentHeight - 10) {
        footer.classList.add('visible');
    } else {
        footer.classList.remove('visible');
    }
} 