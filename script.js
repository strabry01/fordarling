// Detect if device is mobile or tablet
function isMobileOrTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isTablet = /ipad|android(?!.*mobi)/.test(userAgent);
    return isMobile || isTablet;
}

// Lock orientation to landscape for mobile/tablet devices
function lockLandscapeOrientation() {
    if (!isMobileOrTablet()) return;
    
    try {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(err => {
                console.log('Primary landscape lock failed, trying landscape-primary');
                if (screen.orientation.lock) {
                    screen.orientation.lock('landscape-primary').catch(err2 => {
                        console.log('Orientation lock failed:', err2);
                    });
                }
            });
        } else if (screen.lockOrientation) {
            screen.lockOrientation('landscape');
        }
    } catch (e) {
        console.log('Orientation API not available');
    }
}

// Block portrait mode
function blockPortraitMode() {
    if (!isMobileOrTablet()) return;
    
    const checkOrientation = () => {
        const isPortrait = window.innerHeight > window.innerWidth;
        const body = document.body;
        const firstScreen = document.getElementById('firstScreen');
        const secondScreen = document.getElementById('secondScreen');
        
        if (isPortrait) {
            // Portrait mode detected - hide everything
            if (body) body.style.display = 'none';
            if (firstScreen) firstScreen.style.display = 'none';
            if (secondScreen) secondScreen.style.display = 'none';
        } else {
            // Landscape mode - show content
            if (body) body.style.display = 'block';
            if (firstScreen) firstScreen.style.display = 'flex';
        }
    };
    
    // Check immediately
    checkOrientation();
    
    // Check on orientation change
    window.addEventListener('orientationchange', checkOrientation);
    
    // Check on resize
    window.addEventListener('resize', checkOrientation);
    
    // Retry locking every 2 seconds
    setInterval(lockLandscapeOrientation, 2000);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    lockLandscapeOrientation();
    blockPortraitMode();
});

// Try to lock orientation on first user interaction
document.addEventListener('touchstart', lockLandscapeOrientation, { once: true });
document.addEventListener('click', lockLandscapeOrientation, { once: true });

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