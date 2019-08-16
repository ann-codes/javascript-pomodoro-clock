const sound = new Audio("sound.mp3");
let sessionLength = 2; // integer only, 1-60
let breakLength = 1; // integer only, 1-60
let sessionTime = sessionLength * 60;
let breakTime = breakLength * 60;
let sessionInterval;
let breakInterval;
let sessionOn = false;
let breakOn = false;
let pauseOn = false; // add to the first condistional in display timer label

// leading zero helper
const leadingZero = num => (num < 10 ? "0" + num : num);
const timerLabel = document.querySelector("#timer-label");

// ------------------------ controls for changing session and break lengths
const lengthSession = document.querySelector("#session-length");
const lengthBreak = document.querySelector("#break-length");
const displayLengthChoice = () => {
  lengthSession.textContent = sessionLength;
  lengthBreak.textContent = breakLength;
  if (!sessionOn && !breakOn) {
    timeLeft.textContent = `${leadingZero(sessionLength)}:00`;
  }
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
  displayLengthChoice();
};

const updateBreak = up => {
  if (up) {
    breakLength < 60 ? (breakLength += 1) : (breakLength = 60);
  } else {
    breakLength > 1 ? (breakLength -= 1) : (breakLength = 1);
  }
  displayLengthChoice();
};

const canEditLength = canEdit => {
  if (!canEdit) {
    upDown.forEach(e => e.classList.add("toggle-hide"));
  } else {
    upDown.forEach(e => e.classList.remove("toggle-hide"));
  }
};

sessionUp.addEventListener("click", e => updateSession(true), false);
sessionDown.addEventListener("click", e => updateSession(false), false);
breakUp.addEventListener("click", e => updateBreak(true), false);
breakDown.addEventListener("click", e => updateBreak(false), false);

// #21: If the timer is paused and I click the element with id="start_stop",
// the countdown should resume running from the point at which it was paused.
// #26: When a countdown reaches zero (00:00), a sound indicating that time is up should play.
// This should utilize an HTML5 audio tag and have a corresponding id="beep".
// #27: The audio element with id="beep" must be 1 second or longer.
// #28: The audio element with id of beep must stop playing and be rewound to the beginning when the element with the id of reset is clicked.

// Progress Bar
// 1 min === 60000 milliseconds
let sessionInMilli = sessionLength * 60000;
let breakInMilli = breakLength * 60000;

const ProgressBar = require("progressbar.js");

var line = new ProgressBar.Line("#container");
const circle = new ProgressBar.Circle(container, {
  strokeWidth: 2,
  easing: "linear",
  duration: sessionInMilli,
  color: "white",
  trailColor: "#f5493d",
  trailWidth: 2,
  svgStyle: null
});

// circleFor the breaks ### use later
// const circleBreak = new ProgressBar.Circle(container, {
//   strokeWidth: 2,
//   easing: "linear",
//   duration: breakInMilli,
//   color: "#00ff33",
//   trailColor: "white",
//   trailWidth: 2,
//   svgStyle: null
// });

const timeLeft = document.querySelector("#time-left");

// Testing with setInterval Only
const runSession = () => {
  sessionOn = true;
  sessionTime = sessionTime - 1;
  let mins = Math.floor(sessionTime / 60);
  let secs = Math.floor(sessionTime % 60);
  let countdown = `${leadingZero(mins)}:${leadingZero(secs)}`;
  if (sessionTime >= 0) {
    timeLeft.textContent = countdown;
    timerLabel.textContent = "Be Productive!";
  }
  if (sessionTime === 0) {
    sessionOn = false;
    sound.play(); // maybe different sfx?
    clearInterval(sessionInterval);
    sessionTime = sessionLength * 60;
    breakInterval = setInterval(runBreak, 40); // remember to change back to 1000
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
  }
  if (breakTime === 0) {
    breakOn = false;
    sound.play(); // maybe different sfx?
    clearInterval(breakInterval);
    breakTime = breakLength * 60;
    sessionInterval = setInterval(runSession, 40); // remember to change back to 1000
  }
};

runBreak();

// redo to not have toggle?
const play = document.querySelector(".fa-play-circle");
const pause = document.querySelector(".fa-pause-circle");
play.addEventListener(
  "click",
  e => {
    play.classList.toggle("toggle-hide");
    pause.classList.toggle("toggle-hide");
    canEditLength(false);
    if (!sessionOn) {
      // sessionOn = true;
      pauseOn = false;
      breakOn = false;
      sessionInterval = setInterval(runSession, 40); // remember to change back to 1000
      circle.animate(1); // progress bar
    }
    if (sessionOn && pauseOn) {
      pauseOn = false;
      sessionOn = false;
      breakOn = false;
      sessionInterval = setInterval(runSession, 40); // remember to change back to 1000
      circle.animate(1);
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
      sessionOn = false;
      breakOn = false;
      clearInterval(sessionInterval);
      clearInterval(breakInterval);
      circle.animate().stop(); // progress bar
    }
  },
  false
);

// #11: When I click the element with the id of reset, any running timer should be stopped,
// the value within id="break-length" should return to 5, the value within id="session-length" should return to 25,
// and the element with id="time-left" should reset to it's default state.
// reset controls
const reset = () => {
  clearInterval(sessionInterval);
  clearInterval(breakInterval);
  sessionLength = 25;
  breakLength = 5;
  sessionOn = false;
  breakOn = false;
  pauseOn = false;
  displayLengthChoice();
  canEditLength(true);
  circle.set(0);
  play.classList.remove("toggle-hide");
  pause.classList.add("toggle-hide");
};
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", e => reset());


displayLengthChoice();
timerLabel.textContent =  "Let's Get Started!";
timeLeft.textContent = `${leadingZero(sessionLength)}:00`;
