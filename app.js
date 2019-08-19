const beep = new Audio("sound.mp3");
let sessionLength = 2;
let breakLength = 1;
let sessionTime;
let breakTime;
let sessionInterval;
let breakInterval;
let sessionOn = false;
let breakOn = false;
let pauseOn = false;
let millisecs = 100; // for testing

// for testing
function status() {
  console.log(
    "session=" + sessionOn + " / break=" + breakOn + " / paused=" + pauseOn
  );
}

// ------------------------- leading zero helper
const leadingZero = num => (num < 10 ? "0" + num : num);

// ------------------------ controls for changing session and break lengths
const timerLabel = document.querySelector("#timer-label");
const lengthSession = document.querySelector("#session-length");
const lengthBreak = document.querySelector("#break-length");
const displayLengthAndSetTime = () => {
  sessionTime = sessionLength * 60;
  breakTime = breakLength * 60;
  lengthSession.textContent = sessionLength;
  lengthBreak.textContent = breakLength;
  timeLeft.textContent = `${leadingZero(sessionLength)}:00`;
};

const upDown = document.querySelectorAll(".up-down-buttons");
const sessionUp = document.querySelector("#session-increment");
const sessionDown = document.querySelector("#session-decrement");
const breakUp = document.querySelector("#break-increment");
const breakDown = document.querySelector("#break-decrement");

const updateSession = up => {
  if (up) {
    sessionLength < 60 ? (sessionLength += 1) : (sessionLength = 60);
  } else {
    sessionLength > 1 ? (sessionLength -= 1) : (sessionLength = 1);
  }
  displayLengthAndSetTime();
};

const updateBreak = up => {
  if (up) {
    breakLength < 60 ? (breakLength += 1) : (breakLength = 60);
  } else {
    breakLength > 1 ? (breakLength -= 1) : (breakLength = 1);
  }
  displayLengthAndSetTime();
};

const hideEditLength = hideEdit => {
  !hideEdit
    ? upDown.forEach(e => e.classList.add("toggle-hide"))
    : upDown.forEach(e => e.classList.remove("toggle-hide"));
};

sessionUp.addEventListener("click", e => updateSession(true), false);
sessionDown.addEventListener("click", e => updateSession(false), false);
breakUp.addEventListener("click", e => updateBreak(true), false);
breakDown.addEventListener("click", e => updateBreak(false), false);

// ------------------------ controls progress bar defaults
let circle = new ProgressBar.Circle(container, {
  strokeWidth: 2,
  easing: "linear",
  duration: 60 * millisecs * sessionLength,
  color: "white",
  trailColor: "#f5493d",
  trailWidth: 2,
  svgStyle: null
});

const runProgressBar = () => {
  if (sessionOn) {
    circle.animate(1);
  } else if (breakOn) {
    circle.animate(1, {
      duration: 60 * millisecs * breakLength,
      easing: "linear"
    });
  }
};

// ------------------------ run session and breaks functions
const timeLeft = document.querySelector("#time-left");
const runSession = () => {
  sessionOn = true;
  sessionTime = sessionTime - 1;
  let mins = Math.floor(sessionTime / 60);
  let secs = Math.floor(sessionTime % 60);
  let countdown = `${leadingZero(mins)}:${leadingZero(secs)}`;
  if (sessionTime >= 0) {
    timeLeft.textContent = countdown;
    timerLabel.textContent = "Be Productive!";
    // circle.animate(1); // progress bar
  }
  if (sessionTime === 0) {
    sessionOn = false;
    circle.set(0);
    beep.play(); // maybe different sfx?
    clearInterval(sessionInterval);
    clearInterval(breakInterval);
    sessionTime = sessionLength * 60;
    breakInterval = setInterval(runBreak, millisecs);
  }
};

const runBreak = () => {
  breakOn = true;
  breakTime = breakTime - 1;
  let minsB = Math.floor(breakTime / 60);
  let secsB = Math.floor(breakTime % 60);
  let countdownB = `${leadingZero(minsB)}:${leadingZero(secsB)}`;
  if (breakTime >= 0) {
    timeLeft.textContent = countdownB;
    timerLabel.textContent = "Time for a Break!";
    runProgressBar();
  }
  if (breakTime === 0) {
    breakOn = false;
    circle.set(0);
    beep.play(); // maybe different sfx?
    clearInterval(breakInterval);
    clearInterval(sessionInterval);
    breakTime = breakLength * 60;
    sessionInterval = setInterval(runSession, millisecs);
  }
};

// ------------------------ pause/play event listeners buttons
const play = document.querySelector(".fa-play-circle");
const pause = document.querySelector(".fa-pause-circle");
play.addEventListener(
  "click",
  e => {
    play.classList.toggle("toggle-hide");
    pause.classList.toggle("toggle-hide");
    hideEditLength(false);
    if (!sessionOn && !breakOn) {
      //initialized
      sessionOn = true;
      pauseOn = false;
      breakOn = false;
      sessionInterval = setInterval(runSession, millisecs);
      // intervalControl();
      runProgressBar();
      status();
    }
    if (pauseOn && sessionOn) {
      pauseOn = false;
      sessionInterval = setInterval(runSession, millisecs);
      runProgressBar();
      status();
    }
    if (pauseOn && breakOn) {
      pauseOn = false;
      sessionInterval = setInterval(runBreak, millisecs);
      runProgressBar();
      status();
    }
  },
  false
);

pause.addEventListener(
  "click",
  e => {
    play.classList.toggle("toggle-hide");
    pause.classList.toggle("toggle-hide");
    if ((sessionOn || breakOn) && !pauseOn) {
      pauseOn = true;
      // sessionOn = false;
      // breakOn = false;
      status();

      clearInterval(sessionInterval);
      clearInterval(breakInterval);
      circle.animate().stop();
    }
  },
  false
);

// ---------------------------------------------reset controls
const reset = () => {
  clearInterval(sessionInterval);
  clearInterval(breakInterval);
  sessionLength = 25;
  breakLength = 5;
  sessionOn = false;
  breakOn = false;
  pauseOn = false;
  displayLengthAndSetTime();
  hideEditLength(true);
  circle.set(0);
  play.classList.remove("toggle-hide");
  pause.classList.add("toggle-hide");
};
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", e => reset());

const start = () => {
  displayLengthAndSetTime();
  timerLabel.textContent = "Let's Get Started!";
};
window.onload = start();
