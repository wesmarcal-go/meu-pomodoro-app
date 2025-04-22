class PomodoroTimer {
    constructor(duration = 25 * 60) {
        this.duration = duration;
        this.timeLeft = duration;
        this.isRunning = false;
        this.timer = null;
        this.lastUpdate = Date.now();
        this.lastMinute = Math.floor(this.timeLeft / 60);
        
        this.timerDisplay = document.getElementById('timer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.tomateImage = document.querySelector('.tomate-rotate');
        
        this.playPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.updateDisplay();
        
        // Solicitar permissão para notificações
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastUpdate = Date.now();
            this.updatePlayPauseButton(true);
            
            this.timer = requestAnimationFrame(() => this.update());
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.updatePlayPauseButton(false);
            cancelAnimationFrame(this.timer);
        }
    }

    reset() {
        this.pause();
        this.timeLeft = this.duration;
        this.updateDisplay();
    }

    wiggleTomate() {
        this.tomateImage.classList.add('tomate-wiggle');
        this.tomateImage.addEventListener('animationend', () => {
            this.tomateImage.classList.remove('tomate-wiggle');
        }, { once: true });
    }

    update() {
        if (!this.isRunning) return;

        const now = Date.now();
        const delta = (now - this.lastUpdate) / 1000; // Converter para segundos
        this.lastUpdate = now;

        this.timeLeft = Math.max(0, this.timeLeft - delta);
        this.updateDisplay();

        // Verificar se mudou o minuto
        const currentMinute = Math.floor(this.timeLeft / 60);
        if (currentMinute < this.lastMinute) {
            this.lastMinute = currentMinute;
            this.wiggleTomate();
        }

        if (this.timeLeft <= 0) {
            this.complete();
        } else {
            this.timer = requestAnimationFrame(() => this.update());
        }
    }

    complete() {
        this.pause();
        this.timeLeft = this.duration;
        this.updateDisplay();
        this.wiggleTomate();
        
        // Notificar o usuário
        if (Notification.permission === "granted") {
            new Notification("Pomodoro Completo!", {
                body: "Hora de fazer uma pausa!",
                icon: "https://em-content.zobj.net/source/apple/354/tomato_1f345.png"
            });
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = Math.floor(this.timeLeft % 60);
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updatePlayPauseButton(isPlaying) {
        const icon = isPlaying ? 'pause' : 'play_circle';
        this.playPauseBtn.querySelector('.material-symbols-outlined').textContent = icon;
    }
}

// Inicializar o timer
const pomodoro = new PomodoroTimer(); 