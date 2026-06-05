// Detect if device is mobile or tablet
function isMobileOrTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isTablet = /ipad|android(?!.*mobi)/.test(userAgent);
    return isMobile || isTablet;
}

// Lock orientation to landscape for mobile/tablet devices
function lockLandscapeOrientation() {
    // Only lock if device is mobile or tablet
    if (!isMobileOrTablet()) return;
    
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(err => {
            console.log('Orientation lock not supported on this device');
        });
    } else if (screen.lockOrientation) {
        // Fallback for older browsers
        screen.lockOrientation('landscape');
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    lockLandscapeOrientation();
});

// Try to lock orientation on user interaction
document.addEventListener('touchstart', () => {
    lockLandscapeOrientation();
}, { once: true });

// Okay button functionality
document.addEventListener('DOMContentLoaded', () => {
    const okayBtn = document.getElementById('okayBtn');
    const firstScreen = document.getElementById('firstScreen');
    const secondScreen = document.getElementById('secondScreen');
    
    if (okayBtn) {
        okayBtn.addEventListener('click', () => {
            if (firstScreen) firstScreen.style.display = 'none';
            if (secondScreen) secondScreen.classList.add('active');
        });
    }
});