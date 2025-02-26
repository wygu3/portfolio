// Footer visibility handler
document.addEventListener('DOMContentLoaded', function() {
    // Initial check for footer visibility
    checkFooterVisibility();
    
    // Add scroll event listener
    window.addEventListener('scroll', debounce(checkFooterVisibility));
    
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

// Optimize event listeners
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
} 