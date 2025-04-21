class PomodoroTimer {
    constructor(duration = 25 * 60) { // 25 minutos em segundos
        this.duration = duration;
        this.timeLeft = duration;
        this.isRunning = false;
        this.timer = null;
        
        this.timerDisplay = document.getElementById('timer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        
        this.playPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.updateDisplay();
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
            this.updatePlayPauseButton(true);
            
            this.timer = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                
                if (this.timeLeft <= 0) {
                    this.complete();
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.updatePlayPauseButton(false);
            clearInterval(this.timer);
        }
    }

    reset() {
        this.pause();
        this.timeLeft = this.duration;
        this.updateDisplay();
    }

    complete() {
        this.pause();
        this.timeLeft = this.duration;
        this.updateDisplay();
        
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
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updatePlayPauseButton(isPlaying) {
        const icon = isPlaying ? 
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m-9-6h14"></path>' :
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>';
        
        this.playPauseBtn.querySelector('svg').innerHTML = icon;
    }
}

// Solicitar permissão para notificações
(Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
}

// Inicializar o timer
const pomodoro = new PomodoroTimer(); 