// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Script Loader Helper
async function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    if(window.innerWidth > 768) {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.1 });
    }
});

const addCursorHover = () => {
    document.querySelectorAll('a, button, .gallery-img').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if(cursor) cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            if(cursor) cursor.classList.remove('hover');
        });
    });
};

// Background Music
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let isPlaying = false;

if(musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '🎵 Play';
        } else {
            bgMusic.play().catch(() => {});
            musicToggle.innerHTML = '🎵 Pause';
        }
        isPlaying = !isPlaying;
    });
}

// Hover Sound
const hoverSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=pop-39222.mp3');
const playHoverSound = () => {
    hoverSound.currentTime = 0;
    hoverSound.volume = 0.2;
    hoverSound.play().catch(() => {});
};

const addHoverSounds = () => {
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', playHoverSound);
    });
};

// SPA Router
document.addEventListener('click', async (e) => {
    const link = e.target.closest('a');
    if (link && link.origin === window.location.origin && !link.hash) {
        e.preventDefault();
        const url = link.href;
        
        // Transition Out
        await gsap.to('.transition-overlay', {
            scaleY: 1,
            transformOrigin: 'bottom',
            duration: 0.5,
            ease: 'power4.inOut'
        });

        try {
            // Fetch new page
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const newContent = doc.querySelector('#content').innerHTML;
            const newPage = doc.querySelector('#content').dataset.page;
            
            document.querySelector('#content').innerHTML = newContent;
            document.querySelector('#content').dataset.page = newPage;
            
            window.history.pushState({}, '', url);
            
            // Re-initialize scripts
            initPage();
            
            // Transition In
            gsap.to('.transition-overlay', {
                scaleY: 0,
                transformOrigin: 'top',
                duration: 0.5,
                ease: 'power4.inOut'
            });
        } catch (err) {
            console.error('Navigation error:', err);
            window.location.href = url; // fallback
        }
    }
});

window.addEventListener('popstate', () => {
    location.reload();
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if(preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    }
});

// Page Initialization
function initPage() {
    addCursorHover();
    addHoverSounds();
    
    // Refresh ScrollTrigger
    ScrollTrigger.getAll().forEach(t => t.kill());
    
    const page = document.querySelector('#content').dataset.page;
    
    if (page === 'index') initIndex();
    if (page === 'memories') initMemories();
    if (page === 'story') initStory();
    if (page === 'surprise') initSurprise();
}

// Index Page Logic
function initIndex() {
    const text = "Happy Birthday My Dear Sister ❤️";
    const typingEl = document.querySelector('.typing-text');
    if(typingEl) {
        typingEl.innerHTML = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                typingEl.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        setTimeout(typeWriter, 500);
    }

    const particlesContainer = document.getElementById('particles');
    if(particlesContainer) {
        particlesContainer.innerHTML = '';
        const particleCount = window.innerWidth > 768 ? 30 : 10;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 15 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particlesContainer.appendChild(particle);
        }
    }

    gsap.from('.hero-content', { y: 50, opacity: 0, duration: 1, delay: 0.5 });
}

// Memories Page Logic
function initMemories() {
    gsap.from('.section-title', { y: -30, opacity: 0, duration: 1 });
    gsap.from('.gallery-container', { scale: 0.9, opacity: 0, duration: 1, delay: 0.3 });
    
    const galleryImgs = document.querySelectorAll('.gallery-img');
    if(galleryImgs.length > 0) {
        gsap.from(galleryImgs, { 
            y: 50, opacity: 0, duration: 0.8, stagger: 0.2, delay: 0.5,
            scrollTrigger: {
                trigger: '.grid-gallery',
                start: 'top 80%'
            }
        });
    }

    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if(slider && slides.length > 0) {
        let currentIndex = 0;
        let slideInterval;

        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        };

        nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3000);
        };
        
        slideInterval = setInterval(nextSlide, 3000);
    }

    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-content img');
    const closeLightbox = document.querySelector('.close-lightbox');

    if(lightbox) {
        document.querySelectorAll('.gallery-img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });

        closeLightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox) lightbox.classList.remove('active');
        });
    }
}

// Story Page Logic
function initStory() {
    gsap.from('.section-title', { y: -30, opacity: 0, duration: 1 });
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        gsap.to(item, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
            }
        });
    });
}

// Surprise Page Logic
function initSurprise() {
    gsap.from('.cake-container', { scale: 0, rotation: 360, duration: 1.5, ease: 'elastic.out(1, 0.3)' });
    gsap.from('.final-message', { y: 50, opacity: 0, duration: 1, delay: 0.5 });
    gsap.from('#camera-instruction', { y: 50, opacity: 0, duration: 1, delay: 1 });

    const surpriseBtn = document.getElementById('surprise-btn');
    const popup = document.querySelector('.popup-message');
    const closePopup = document.getElementById('close-popup');
    const flame = document.getElementById('candle-flame');
    const instruction = document.getElementById('camera-instruction');
    const cameraContainer = document.querySelector('.camera-container');
    const videoElement = document.getElementById('webcam');

    let isSurpriseTriggered = false;
    let cameraInstance = null;

    const triggerSurprise = () => {
        if (isSurpriseTriggered) return;
        isSurpriseTriggered = true;
        
        // Extinguish flame
        if (flame) {
            flame.style.animation = 'none';
            flame.classList.add('extinguished');
        }

        // Hide instruction & camera
        if (instruction) gsap.to(instruction, { opacity: 0, duration: 0.5 });
        if (cameraContainer) gsap.to(cameraContainer, { scale: 0, opacity: 0, duration: 0.5 });

        // Show popup
        if (popup) {
            popup.classList.remove('hidden');
            setTimeout(() => {
                popup.classList.add('active');
                fireConfetti();
                fireBalloons();
            }, 500);
        }

        // Stop camera
        if (cameraInstance) {
            cameraInstance.stop();
        }
        if (videoElement && videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    if(surpriseBtn) {
        surpriseBtn.addEventListener('click', triggerSurprise);
    }

    if(closePopup) {
        closePopup.addEventListener('click', () => {
            popup.classList.remove('active');
            setTimeout(() => popup.classList.add('hidden'), 500);
        });
    }

    // Camera logic
    const setupCamera = async () => {
        try {
            if (instruction) instruction.innerText = "Loading camera... 📸";
            
            await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
            await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');

            const hands = new Hands({locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }});

            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 0, // 0 is faster for mobile
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            hands.onResults((results) => {
                if (isSurpriseTriggered) return;

                if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                    const landmarks = results.multiHandLandmarks[0];

                    // Check for peace sign (Index and Middle up, Ring and Pinky down)
                    // Y coordinates go from 0 (top) to 1 (bottom)
                    const isIndexUp = landmarks[8].y < landmarks[6].y;
                    const isMiddleUp = landmarks[12].y < landmarks[10].y;
                    const isRingDown = landmarks[16].y > landmarks[14].y;
                    const isPinkyDown = landmarks[20].y > landmarks[18].y;

                    if (isIndexUp && isMiddleUp && isRingDown && isPinkyDown) {
                        triggerSurprise();
                    }
                }
            });

            cameraInstance = new Camera(videoElement, {
                onFrame: async () => {
                    if (!isSurpriseTriggered) {
                        await hands.send({image: videoElement});
                    }
                },
                width: 320,
                height: 240
            });

            await cameraInstance.start();
            if (cameraContainer) cameraContainer.classList.add('active');
            if (instruction) instruction.innerText = "Pose with a Peace Sign ✌️ to make a wish!";

        } catch (err) {
            console.warn('Camera access denied or error:', err);
            // Fallback to button
            if (instruction) instruction.innerText = "Click the button to make a wish!";
            if (surpriseBtn) surpriseBtn.classList.remove('hidden');
        }
    };

    // Start camera setup after animation
    setTimeout(setupCamera, 1500);
}

function fireBalloons() {
    const colors = ['#ff7eb3', '#ffd700', '#ff758c', '#a29bfe', '#74b9ff'];
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.setProperty('--balloon-color', colors[Math.floor(Math.random() * colors.length)]);
        balloon.style.left = `${Math.random() * 90}%`;
        balloon.style.animationDuration = `${Math.random() * 4 + 6}s`;
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(balloon);
        
        // Remove balloon after animation
        setTimeout(() => {
            balloon.remove();
        }, 10000);
    }
}

function fireConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 4000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, { particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    initPage();
});
