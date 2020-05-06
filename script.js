let seconds = 60 * 1;

let date = new Date(0);
date.setSeconds(seconds);
let timeString = prettifyDate();
console.log(timeString);

function prettifyDate() {
  return date.toISOString().substr(14, 5)
}

function decreaseSecond() {
  date.setSeconds(date.getSeconds() - 1);
  if (date.getMinutes() === 0 &&
    date.getSeconds() === 0) {
    clearInterval(timerOn);
  }
  console.log(prettifyDate());
  timer.textContent = prettifyDate();
}

let timerOn = setInterval(decreaseSecond, 1000);


const timer = document.querySelector('#timer')
const setSession = document.querySelector('#session')

// setSession.textContent = 

