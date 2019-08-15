let lengthSession = 2; // integer only, 1-60
let lengthBreak = 1; // integer only, 1-60
let seconds = lengthSession * 60;
let minutes = seconds / 60;
let interval;
let sessionOn = false;
let breakOn = false;
let pauseOn = false; // add to the first condistional in display timer label
let clockStatus = "off"; // off, on, pause

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
const sessionLength = document.querySelector("#session-length");
const breakLength = document.querySelector("#break-length");
const displayLength = () => {
  sessionLength.textContent = lengthSession;
  breakLength.textContent = lengthBreak;
  timeLeft.textContent = `${leadingZero(lengthSession)}:00`;
};

const sessionUp = document.querySelector("#session-increment");
const sessionDown = document.querySelector("#session-decrement");
const breakUp = document.querySelector("#break-increment");
const breakDown = document.querySelector("#break-decrement");

const updateSession = up => {
  if (up) {
    lengthSession < 60 ? (lengthSession += 1) : (lengthSession = 60);
  } else {
    lengthSession > 1 ? (lengthSession -= 1) : (lengthSession = 1);
  }
  displayLength();
};

const updateBreak = up => {
  if (up) {
    lengthBreak < 60 ? (lengthBreak += 1) : (lengthBreak = 60);
  } else {
    lengthBreak > 1 ? (lengthBreak -= 1) : (lengthBreak = 1);
  }
  displayLength();
};

sessionUp.addEventListener("click", e => updateSession(true), false);
sessionDown.addEventListener("click", e => updateSession(false), false);
breakUp.addEventListener("click", e => updateBreak(true), false);
breakDown.addEventListener("click", e => updateBreak(false), false);

// #20: If the timer is running and I click the element with id="start_stop", the countdown should pause.
// #21: If the timer is paused and I click the element with id="start_stop", the countdown should resume running from the point at which it was paused.
// #22: When a session countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a break has begun.
// #23: When a session countdown reaches zero (NOTE: timer MUST reach 00:00), a new break countdown should begin, counting down from the value currently displayed in the id="break-length" element.
// #24: When a break countdown reaches zero (NOTE: timer MUST reach 00:00), and a new countdown begins, the element with the id of timer-label should display a string indicating a session has begun.
// #25: When a break countdown reaches zero (NOTE: timer MUST reach 00:00), a new session countdown should begin, counting down from the value currently displayed in the id="session-length" element.
// #26: When a countdown reaches zero (NOTE: timer MUST reach 00:00), a sound indicating that time is up should play. This should utilize an HTML5 audio tag and have a corresponding id="beep".
// #27: The audio element with id="beep" must be 1 second or longer.
// #28: The audio element with id of beep must stop playing and be rewound to the beginning when the element with the id of reset is clicked.

// Progress Bar
// 1 min === 60000 milliseconds
let sessionInMilli = lengthSession * 60000;
let breakInMilli = lengthBreak * 60000;

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

// this function shouldn't be a function, need to wrap into the startStop eventLisenter
let hardNow = new Date().getTime();
const pressPlayPause = () => {
  let deadline = lengthSession * 60000 + hardNow;
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
const startStop = document.querySelector("#start-stop");
startStop.addEventListener("click", e => {
  // play.classList.toggle("toggle-hide");
  // pause.classList.toggle("toggle-hide");
  if (!sessionOn) {
    interval = setInterval(pressPlayPause, 100); /// 1000 is 1 sec
    sessionOn = true;
    circle.animate(1); // progress bar
    timerLabel.textContent = displayTimerLabel();
  }
});

pause.addEventListener("click", e => {
  clearInterval(interval);
  circle.animate().stop(); // progress bar
});

// #11: When I click the element with the id of reset, any running timer should be stopped,
// the value within id="break-length" should return to 5, the value within id="session-length" should return to 25,
// and the element with id="time-left" should reset to it's default state.
const reset = () => {
  lengthSession = 25;
  lengthBreak = 5;
  clockStatus = "off";
  play.classList.remove("toggle");
  pause.classList.add("toggle");
  displayLength();
  circle.set(0);
};
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", e => reset());

displayLength();
