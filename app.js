const sound = new Audio("sound.mp3");
// sound.play() // maybe different sfx?
let sessionLength = 2; // integer only, 1-60
let breakLength = 1; // integer only, 1-60
let seconds = sessionLength * 60;
let interval;
let hardNow;
let sessionOn = false;
let breakOn = false;
let pauseOn = false; // add to the first condistional in display timer label

const displayTimerLabel = () => {
  if (!sessionOn && !breakOn) {
    return "Let's Get Started!";
  } else if (sessionOn && !breakOn) {
    return "Be Productive!";
  } else if (!sessionOn && breakOn) {
    return "Time for a Break!";
  }
};

// leading zero helper
const leadingZero = num => (num < 10 ? "0" + num : num);

const timerLabel = document.querySelector("#timer-label");
timerLabel.textContent = displayTimerLabel(); // function this for later?

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

const canEditLength = noEdit => {
  if (!noEdit) {
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

// Testing with setInterval Only
const runTimer = () => {
  // let totalSecs = sessionLength * 60;
  let secsLeft;
  seconds = seconds - 1;

  let mins = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  let countdown = `${leadingZero(mins)}:${leadingZero(secs)}`;

  console.log(countdown);
};
// setInterval(runTimer, 1000);

const timeLeft = document.querySelector("#time-left");
const pressPlayPause = () => {
  let deadline = sessionLength * 60000 + hardNow;
  const nowForCalc = new Date().getTime();
  let diffNowDeadline = deadline - nowForCalc;
  let mins = Math.floor((diffNowDeadline % (1000 * 60 * 60)) / (1000 * 60));
  let secs = Math.floor((diffNowDeadline % (1000 * 60)) / 1000);
  if (diffNowDeadline > 0) {
    timeLeft.textContent = `${leadingZero(mins)}:${leadingZero(secs)}`;
  }
};
// create pause function with clearInterval(x) and setting the paused time value as the new length
// (in mins and secs). When resuming, use restart pausePlay() with new

// redo to not have toggle?
const play = document.querySelector(".fa-play-circle");
const pause = document.querySelector(".fa-pause-circle");
play.addEventListener(
  "click",
  e => {
    hardNow = new Date().getTime();
    play.classList.toggle("toggle-hide");
    pause.classList.toggle("toggle-hide");
    canEditLength(false);
    if (!sessionOn) {
      sessionOn = true;
      pauseOn = false;
      breakOn = false;
      interval = setInterval(pressPlayPause, 100); /// 1000 is 1 sec
      circle.animate(1); // progress bar
      timerLabel.textContent = displayTimerLabel();
    }
    if (sessionOn && pauseOn) {
      pauseOn = false;
      sessionOn = false;
      breakOn = false;
      interval = setInterval(pressPlayPause, 100);
      circle.animate(1);
      timerLabel.textContent = displayTimerLabel();
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
      clearInterval(interval);
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
  hardNow = 0;
  clearInterval(interval);
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
timeLeft.textContent = `${leadingZero(sessionLength)}:00`;
