// ============================================
// CONFIGURATION
// ============================================
const PASSWORD = "10012026";
const CONTENT = "Gặp được em là điều may mắn nhất. Em là cô gái dịu dàng và đáng yêu nhất mà anh từng gặp. Mùa đông này có em chắc chắn sẽ rất ấm áp. Anh hứa sẽ luôn ở bên và yêu thương em! Làm người yêu anh nhé? 💕";
const YOUTUBE_ID = "9wKGx4NqsZY";

// ============================================
// GLOBAL VARIABLES
// ============================================
let player;
let isOpened = false;
let typingComplete = false;

// ============================================
// CREATE FLOATING HEARTS
// ============================================
function createHearts() {
    const container = document.getElementById('hearts-container');
    const heartCount = 20; // Tăng số lượng tim
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('i');
        heart.className = 'fa-solid fa-heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 12) + 'px';
        heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
        heart.style.animationDelay = Math.random() * 6 + 's';
        container.appendChild(heart);
    }
}

// ============================================
// YOUTUBE PLAYER INITIALIZATION
// ============================================
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_ID,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': YOUTUBE_ID,
            'enablejsapi': 1,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Player ready
    console.log('YouTube player ready');
}

function onPlayerStateChange(event) {
    // Handle state changes if needed
}

// ============================================
// PASSWORD HANDLING
// ============================================
function initPasswordCheck() {
    const lockScreen = document.getElementById('lock-screen');
    const passwordInput = document.getElementById('password-input');

    passwordInput.addEventListener('input', (e) => {
        if (e.target.value === PASSWORD) {
            // Fade out lock screen
            lockScreen.classList.add('hidden');
            
            // Small delay for smooth transition
            setTimeout(() => {
                // Focus body for audio interaction (some browsers require user interaction)
                document.body.focus();
            }, 800);
        }
    });

    // Allow Enter key to submit
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.value === PASSWORD) {
            lockScreen.classList.add('hidden');
        }
    });
}

// ============================================
// ENVELOPE OPENING
// ============================================
function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const instruction = document.getElementById('instruction');

    envelope.addEventListener('click', () => {
        if (isOpened) return;
        
        isOpened = true;
        envelope.classList.add('open');
        instruction.classList.add('hide');

        // Play music
        if (player && player.playVideo) {
            player.playVideo();
            player.setVolume(30);
        }

        // Play background audio
        const backgroundAudio = document.getElementById('background-audio');
        if (backgroundAudio) {
            backgroundAudio.volume = 0.3; // Volume 30%
            backgroundAudio.play().catch(e => {
                console.log('Audio autoplay blocked:', e);
                // Một số trình duyệt chặn autoplay, sẽ phát khi user tương tác
            });
        }

        // Show decorations (nến và hoa)
        setTimeout(() => {
            document.getElementById('decorations').classList.add('show');
        }, 600);

        // Start typing effect
        setTimeout(() => {
            startTyping();
        }, 800);
    });
}

// ============================================
// TYPING EFFECT
// ============================================
function startTyping() {
    const typingText = document.getElementById('typing-text');
    const buttons = document.getElementById('buttons');
    
    typingText.textContent = '';
    let i = 0;

    function type() {
        if (i < CONTENT.length) {
            typingText.textContent += CONTENT.charAt(i);
            i++;
            setTimeout(type, 50);
        } else {
            typingComplete = true;
            // Show buttons with fade in
            setTimeout(() => {
                buttons.classList.add('show');
                // Increase music volume
                if (player) {
                    player.setVolume(50);
                }
            }, 500);
        }
    }

    type();
}

// ============================================
// BUTTON HANDLERS
// ============================================
function initButtons() {
    // Yes button - Confetti
    const btnYes = document.getElementById('btn-yes');
    btnYes.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Show alert
        alert("Anh biết em sẽ đồng ý mà! Yêu em nhiều 😘");
        
        // Confetti explosion
        const duration = 4000;
        const end = Date.now() + duration;
        const colors = ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1', '#ff5e78'];

        (function frame() {
            // Left side
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            
            // Right side
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Big explosion from center
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: colors
            });
        }, 500);

        // Increase music volume
        if (player) {
            player.setVolume(70);
        }
    });

    // No button - Run away
    const btnNo = document.getElementById('btn-no');
    
    function moveButton() {
        if (!typingComplete) return;
        
        btnNo.classList.add('moving');
        
        // Calculate random position within viewport
        const btnRect = btnNo.getBoundingClientRect();
        const btnWidth = btnRect.width || 140;
        const btnHeight = btnRect.height || 40;
        
        const maxX = Math.max(20, window.innerWidth - btnWidth - 20);
        const maxY = Math.max(20, window.innerHeight - btnHeight - 20);
        
        const randomX = Math.max(20, Math.random() * maxX);
        const randomY = Math.max(20, Math.random() * maxY);
        
        // Move button
        btnNo.style.position = 'fixed';
        btnNo.style.left = randomX + 'px';
        btnNo.style.top = randomY + 'px';
        btnNo.style.transform = 'translate(0, 0)';
        btnNo.style.zIndex = '1000';
        
        setTimeout(() => {
            btnNo.classList.remove('moving');
        }, 300);
    }

    // Mouse hover
    btnNo.addEventListener('mouseenter', moveButton);
    
    // Touch events
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });

    // Click event - move immediately
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        moveButton();
        
        // Shake animation
        btnNo.style.animation = 'shake 0.5s';
        setTimeout(() => {
            btnNo.style.animation = '';
        }, 500);
    });
}

// ============================================
// SHAKE ANIMATION (Dynamic CSS)
// ============================================
function addShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-10px, -10px) rotate(-5deg); }
            50% { transform: translate(10px, 10px) rotate(5deg); }
            75% { transform: translate(-10px, 10px) rotate(-5deg); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createHearts();
    initPasswordCheck();
    initEnvelope();
    initButtons();
    addShakeAnimation();
});
