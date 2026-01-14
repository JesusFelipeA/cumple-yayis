// Abrir sobre de bienvenida
function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    const overlay = document.getElementById('envelopeOverlay');
    const mainContainer = document.getElementById('mainContainer');
    const audio = document.getElementById('birthdayAudio');
    
    // Agregar clase para animar la apertura del sobre
    envelope.classList.add('opened');
    
    // Reproducir audio inmediatamente
    audio.muted = false;
    audio.play().catch(error => {
        console.log('Error al reproducir audio:', error);
    });
    
    // Después de un tiempo, mostrar el contenido principal
    setTimeout(() => {
        overlay.classList.add('opened');
        mainContainer.classList.add('visible');
        
        // Activar todas las animaciones
        activateDanceMode();
        setTimeout(createConfetti, 500);
    }, 600);
}

// Crear confeti al cargar la página
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const confettiCount = 100;
    const colors = ['#FF1744', '#F57C00', '#FFEB3B', '#00E676', '#00B0FF', '#E91E63', '#9C27B0'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
        
        // Remover confeti después de la animación
        setTimeout(() => {
            confetti.remove();
        }, 3500);
    }
}

// Activar modo fiesta automáticamente
function activateDanceMode() {
    document.body.classList.add('dance-mode');
}

// Mostrar sorpresa
function showSurprise() {
    const surprise = document.getElementById('surprise');
    surprise.classList.add('active');
    createConfetti();
    playSound('surprise');
}

// Cerrar sorpresa
function closeSurprise() {
    const surprise = document.getElementById('surprise');
    surprise.classList.remove('active');
}

// Apagar velas
function extinguishCandle(candleElement) {
    if (!candleElement.classList.contains('blown')) {
        candleElement.classList.add('blown');
        playSound('blow');
        createConfetti();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const candles = document.querySelectorAll('.candle');
    candles.forEach(candle => {
        candle.style.cursor = 'pointer';
    });
});

// Modo danza (cambiar colores de fondo)
function danceMode() {
    document.body.classList.toggle('dance-mode');
    playSound('party');
    createConfetti();
}

// Reproducir sonidos
function playSound(type) {
    // Crear sonidos simples con Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    switch(type) {
        case 'blow':
            playBlowSound(audioContext);
            break;
        case 'surprise':
            playSurpriseSound(audioContext);
            break;
        case 'party':
            playPartySound(audioContext);
            break;
        case 'music':
            playBirthdayMusic(audioContext);
            break;
    }
}

function playBlowSound(audioContext) {
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
}

function playSurpriseSound(audioContext) {
    const now = audioContext.currentTime;
    const frequencies = [523, 659, 784, 1047]; // Notas musicales
    
    frequencies.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2, now + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.2);
        
        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.2);
    });
}

function playPartySound(audioContext) {
    const now = audioContext.currentTime;
    const frequencies = [262, 330, 392, 523]; // Notas aleatorias
    
    for (let i = 0; i < 8; i++) {
        const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.15, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
        
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.15);
    }
}

function playBirthdayMusic(audioContext) {
    // Melodía simple de "Feliz Cumpleaños"
    const notes = [
        { freq: 262, duration: 0.3 }, // Do
        { freq: 262, duration: 0.3 }, // Do
        { freq: 294, duration: 0.6 }, // Re
        { freq: 262, duration: 0.6 }, // Do
        { freq: 349, duration: 0.6 }, // Mi
        { freq: 330, duration: 1.2 }, // Re
    ];
    
    let currentTime = audioContext.currentTime;
    
    notes.forEach(note => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(note.freq, currentTime);
        gain.gain.setValueAtTime(0.3, currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
        
        osc.start(currentTime);
        osc.stop(currentTime + note.duration);
        
        currentTime += note.duration;
    });
}

// Toggle música
function toggleMusic() {
    playSound('music');
    createConfetti();
}

// Control de audio del archivo
function toggleAudio() {
    const audio = document.getElementById('birthdayAudio');
    if (audio.paused) {
        audio.muted = false;
        audio.play().catch(error => {
            console.log('Error al reproducir:', error);
        });
    } else {
        audio.pause();
    }
}

// Reproducir audio al hacer clic en la imagen
function playAudioOnClick() {
    const audio = document.getElementById('birthdayAudio');
    audio.muted = false;
    audio.play().catch(error => {
        console.log('Error al reproducir:', error);
    });
}

// Crear confeti inicial al cargar
window.addEventListener('load', () => {
    // El modo fiesta se activará cuando se abra el sobre
    // Por ahora solo preparamos la página
});

// Reproducir música cuando el usuario interactúa
let audioStarted = false;
document.addEventListener('click', () => {
    if (!audioStarted) {
        const audio = document.getElementById('birthdayAudio');
        audio.play().catch(error => {
            console.log('Error al reproducir audio:', error);
        });
        audioStarted = true;
    }
});

// También intentar reproducir cuando se carga
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const audio = document.getElementById('birthdayAudio');
        audio.play().catch(error => {
            console.log('Autoplay bloqueado, haz clic en la página para reproducir música');
        });
    }, 1000);
});

// Crear confeti en intervalos
setInterval(() => {
    if (Math.random() < 0.1) {
        createConfetti();
    }
}, 5000);

// Agregar interactividad al hacer clic en cualquier lado
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BODY' || e.target.className === 'content') {
        createConfeti();
    }
});
