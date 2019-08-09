let lengthSession = 25;
let lengthBreak = 5;
let clockActive = null; // true, false, null

const displayNote = () => {
  if (clockActive === null) {
    return "Let's Get Started!";
  } else if (clockActive === true) {
    return "Be Productive!";
  } else {
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

// #11: When I click the element with the id of reset, any running timer should be stopped,
// the value within id="break-length" should return to 5, the value within id="session-length" should return to 25,
// and the element with id="time-left" should reset to it's default state.
const reset = () => {
  lengthSession = 25;
  lengthBreak = 5;
  clockActive = null;
  displayLength();
};
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", e => reset());

// #18: When I first click the element with id="start_stop", the timer should begin running from the value currently displayed in id="session-length", even if the value has been incremented or decremented from the original value of 25.
// #19: If the timer is running, the element with the id of time-left should display the remaining time in mm:ss format (decrementing by a value of 1 and updating the display every 1000ms).
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
const ProgressBar = require("progressbar.js");

var line = new ProgressBar.Line("#container");
const circle = new ProgressBar.Circle(container, {
  strokeWidth: 2,
  easing: "linear",
  duration: 140000, // edit this based on time
  color: "white",
  trailColor: "#f5493d",
  trailWidth: 2,
  svgStyle: null
});

circle.animate(1);
