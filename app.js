let lengthSession = 1; // integer only, 1-60
let lengthBreak = 1; // integer only, 1-60
let clockStatus = "off"; // off, on, pause

const displayNote = () => {
  if (clockStatus === "off") {
    return "Let's Get Started!";
  } else if (clockStatus === "on") {
    return "Be Productive!";
  } else if (clockStatus === "break") {
    return "Time for a Break!";
  }
};

const timerLabel = document.querySelector("#timer-label");
timerLabel.textContent = displayNote(); // function this for later?

const sessionUp = document.querySelector("#session-increment");
const sessionDown = document.querySelector("#session-decrement");
const breakUp = document.querySelector("#break-increment");
const breakDown = document.querySelector("#break-decrement");

const sessionLength = document.querySelector("#session-length");
const breakLength = document.querySelector("#break-length");

const displayLength = () => {
  sessionLength.textContent = lengthSession;
  breakLength.textContent = lengthBreak;
  timeLeft.textContent = `${lengthSession}:00`;
};

sessionUp.addEventListener("click", e => {
  lengthSession < 60 ? (lengthSession += 1) : (lengthSession = 60);
  displayLength();
});
sessionDown.addEventListener("click", e => {
  lengthSession > 1 ? (lengthSession -= 1) : (lengthSession = 1);
  displayLength();
});
breakUp.addEventListener("click", e => {
  lengthBreak < 60 ? (lengthBreak += 1) : (lengthBreak = 60);
  displayLength();
});
breakDown.addEventListener("click", e => {
  lengthBreak > 1 ? (lengthBreak -= 1) : (lengthBreak = 1);
  displayLength();
});

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
const pressPlayPause = () => {
  let hardNow = new Date().getTime();
  const timer = setInterval(() => {
    let deadline = lengthSession * 60000 + hardNow;
    const nowForCalc = new Date().getTime();
    let diffNowDeadline = deadline - nowForCalc;
    let mins = Math.floor((diffNowDeadline % (1000 * 60 * 60)) / (1000 * 60));
    let secs = Math.floor((diffNowDeadline % (1000 * 60)) / 1000);
    if (diffNowDeadline > 0) {
      timeLeft.textContent = `${mins}:${secs}`;
    }
  }, 1000);
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
  if (clockStatus === "off") {
    pressPlayPause();
    clockStatus = "on";
    circle.animate(1);
    timerLabel.textContent = displayNote();
    console.log(clockStatus);
  } else if (clockStatus === "on") {
    circle.animate().stop();
    clockStatus = "pause";
    timerLabel.textContent = displayNote();
    console.log(clockStatus);
  }
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

const start = () => {
  displayLength();
};
window.onload = start();
