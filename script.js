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
            screen.orientation.lock('landscape').catch(() => {
                if (screen.orientation.lock) {
                    screen.orientation.lock('landscape-primary').catch(() => {});
                }
            });
        } else if (screen.lockOrientation) {
            screen.lockOrientation('landscape');
        }
    } catch (e) {
        // Orientation API not available or rejected
    }
}

// Create or return rotate overlay element
function getRotateOverlay() {
    let overlay = document.getElementById('rotateOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'rotateOverlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.95)',
            color: '#333',
            zIndex: 99999,
            textAlign: 'center',
            padding: '20px',
            fontSize: '18px'
        });
        overlay.innerHTML = '<div>Please rotate your device to landscape for the intended experience.</div>';
        document.body.appendChild(overlay);
    }
    return overlay;
}

// Apply responsive layout helpers (add compact class on small viewports)
function applyResponsiveLayout() {
    const compact = window.innerWidth <= 1024;
    if (compact) document.body.classList.add('compact'); else document.body.classList.remove('compact');
}

// Handle portrait/landscape: show overlay in portrait on mobile/tablet instead of hiding body
function blockPortraitMode() {
    if (!isMobileOrTablet()) return;

    const overlay = getRotateOverlay();
    const firstScreen = document.getElementById('firstScreen');
    const secondScreen = document.getElementById('secondScreen');

    const check = () => {
        const isPortrait = window.innerHeight > window.innerWidth;
        if (isPortrait) {
            overlay.style.display = 'flex';
            if (firstScreen) firstScreen.style.visibility = 'hidden';
            if (secondScreen) secondScreen.style.visibility = 'hidden';
        } else {
            overlay.style.display = 'none';
            if (firstScreen) firstScreen.style.visibility = 'visible';
            if (secondScreen) secondScreen.style.visibility = 'visible';
        }
    };

    check();
    window.addEventListener('orientationchange', check);
    window.addEventListener('resize', () => { check(); applyResponsiveLayout(); });

    // keep trying to lock orientation for PWAs where possible
    setInterval(lockLandscapeOrientation, 2000);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    applyResponsiveLayout();
    lockLandscapeOrientation();
    blockPortraitMode();

    // ensure second screen is scrollable and reset when activated
    const okayBtn = document.getElementById('okayBtn');
    const firstScreen = document.getElementById('firstScreen');
    const secondScreen = document.getElementById('secondScreen');

    if (okayBtn) {
        okayBtn.addEventListener('click', () => {
            if (firstScreen) firstScreen.style.display = 'none';
            if (secondScreen) {
                secondScreen.classList.add('active');
                // ensure second screen scroll starts at top
                secondScreen.scrollTop = 0;
                // if cake-stage exists, scroll it into view (center)
                const cakeStage = document.querySelector('.cake-stage');
                if (cakeStage) {
                    // smooth scroll the cake stage to center of viewport
                    cakeStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
});

// Try to lock orientation on first user interaction
document.addEventListener('touchstart', lockLandscapeOrientation, { once: true });
document.addEventListener('click', lockLandscapeOrientation, { once: true });

// Keep responsive layout updated
window.addEventListener('resize', applyResponsiveLayout);
window.addEventListener('orientationchange', applyResponsiveLayout);