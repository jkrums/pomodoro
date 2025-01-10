const timer = document.getElementById('timer');
const pauseButton = document.getElementById('pause');
const workButton = document.querySelector('.work-mode');
const breakButton = document.querySelector('.break-mode');
const resetButton = document.getElementById('reset');
const progressRing = document.querySelector('.progress-ring-circle');
const themeToggle = document.getElementById('theme-switch');

const RADIUS = 120;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * RADIUS;

let workTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let timeLeft = workTime;
let isRunning = false;
let isPaused = false;
let isWorkMode = true;
let countdown;

// Initialize progress ring
progressRing.style.strokeDasharray = `${CIRCLE_CIRCUMFERENCE} ${CIRCLE_CIRCUMFERENCE}`;
progressRing.style.strokeDashoffset = CIRCLE_CIRCUMFERENCE;

console.log('Pause button found:', pauseButton); // Should not be null

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    timer.textContent = displayTime;
    document.title = `${displayTime} - Pomodoro Timer`;
    
    // Update progress ring
    const totalTime = isWorkMode ? workTime : breakTime;
    const progress = 1 - (timeLeft / totalTime);
    const offset = CIRCLE_CIRCUMFERENCE - (progress * CIRCLE_CIRCUMFERENCE);
    progressRing.style.strokeDashoffset = offset;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        isPaused = false;
        countdown = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft === 0) {
                clearInterval(countdown);
                isRunning = false;
                timeLeft = isWorkMode ? breakTime : workTime;
                isWorkMode = !isWorkMode;
                updateTimer();
            }
        }, 1000);
        pauseButton.textContent = 'Pause';
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(countdown);
        isRunning = false;
        isPaused = true;
        pauseButton.textContent = 'Resume';
    } else if (isPaused) {
        startTimer();
    } else {
        startTimer();
    }
}

function resetTimer() {
    clearInterval(countdown);
    timeLeft = isWorkMode ? workTime : breakTime;
    isRunning = false;
    isPaused = false;
    updateTimer();
    pauseButton.textContent = 'Start';
}

function setWorkMode() {
    isWorkMode = true;
    timeLeft = workTime;
    resetTimer();
    workButton.classList.add('active');
    breakButton.classList.remove('active');
}

function setBreakMode() {
    isWorkMode = false;
    timeLeft = breakTime;
    resetTimer();
    breakButton.classList.add('active');
    workButton.classList.remove('active');
}

// Event Listeners
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workButton.addEventListener('click', setWorkMode);
breakButton.addEventListener('click', setBreakMode);

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.body.dataset.theme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.dataset.theme = savedTheme;
themeToggle.innerHTML = savedTheme === 'dark' ? 
    '<i class="fas fa-sun"></i>' : 
    '<i class="fas fa-moon"></i>';

// Initial setup
updateTimer();
workButton.classList.add('active'); 