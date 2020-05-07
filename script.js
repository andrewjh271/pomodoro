const sessionTime = document.querySelector('#set-session');
const breakTime = document.querySelector('#set-break');

const sessionTitle = document.querySelector('#session-title');
const breakTitle = document.querySelector('#break-title');

sessionTime.textContent = 25;
breakTime.textContent = 5;

buttons = document.querySelectorAll('button')
buttons.forEach((button) => button.addEventListener('click', buttonClick));
pausePlay = document.querySelector('i');

// let seconds = 60 * sessionTime.textContent;
let seconds = 5;
let date = new Date(0);
date.setSeconds(seconds);
let timeString = prettifyDate();
console.log(timeString);

let timerOn;

const timer = document.querySelector('#timer');
timer.textContent = prettifyDate();

let currentlyWorking = true;
let extraTime = false;
const extra = document.querySelector('.extra');

let currentSession = 0;
session = [];
session[0] = document.querySelector('.session0');
session[1] = document.querySelector('.session1');
session[2] = document.querySelector('.session2');
session[3] = document.querySelector('.session3');

function buttonClick(e) {
  console.log(e.target.id);
  let target = e.target.id;
  if(!target) return;
  switch(target) {
    case('session-up'):
      sessionTime.textContent = +sessionTime.textContent + 1;
      break;
    case('session-down'):
      sessionTime.textContent -= 1;
      break;
    case('break-up'):
      breakTime.textContent = +breakTime.textContent + 1;
      break;
    case('break-down'):
      breakTime.textContent -= 1;
      break;
    case('pause-play'):
      if(!extraTime) {
        if(!timerOn) {
          timerOn = setInterval(decreaseSecond, 1000);
          pausePlay.classList.remove('fa-play')
          pausePlay.classList.add('fa-pause')
          if(currentlyWorking) sessionTitle.classList.add('active-title');
          else breakTitle.classList.add('active-title');
          break;
        } else {
          clearInterval(timerOn);
          timerOn = null;
          pausePlay.classList.remove('fa-pause')
          pausePlay.classList.add('fa-play')
          if(currentlyWorking) sessionTitle.classList.remove('active-title');
          else breakTitle.classList.remove('active-title');
          break;
        }
      } else {
        if(currentlyWorking) {
          seconds = 60 * +breakTime.textContent;
          currentlyWorking = false;
          pausePlay.classList.remove('fa-mug-hot');
          sessionTitle.classList.remove('active-title');
          breakTitle.classList.add('active-title');
        } else {
          seconds = 60 * +sessionTime.textContent;
          currentlyWorking = true;
          pausePlay.classList.remove('fa-pencil-alt');
          sessionTitle.classList.add('active-title');
          breakTitle.classList.remove('active-title');
        }
        pausePlay.classList.add('fa-pause')
        clearInterval(timerOn);
        date = new Date(0);
        date.setSeconds(seconds);
        timer.textContent = prettifyDate();
        timerOn = setInterval(decreaseSecond, 1000);
        extraTime = false;
        extra.classList.add('extra-hidden');
      }
      break;
    case('reset'):
      clearInterval(timerOn);
      timerOn = null;
      seconds = 60 * +sessionTime.textContent;
      date = new Date(0);
      date.setSeconds(seconds);
      timer.textContent = prettifyDate();
      currentlyWorking = true;
      extraTime = false;
      extra.classList.add('extra-hidden');
      session.forEach((session) => {
        session.classList.remove('fas');
        session.classList.add('far');
      })
      sessionTitle.classList.remove('active-title');
      breakTitle.classList.remove('active-title');
      pausePlay.classList.remove('fa-pause')
      pausePlay.classList.remove('fa-pencil-alt');
      pausePlay.classList.remove('fa-mug-hot');
      pausePlay.classList.add('fa-play')
      break;
  }
  // date = new Date(0);
  // date.setSeconds(seconds);
  // timer.textContent = prettifyDate();
}

function decreaseSecond() {
  date.setSeconds(date.getSeconds() - 1);
  if (date.getMinutes() === 0 &&
    date.getSeconds() === 0) {
    if(currentlyWorking) {
      updateSessionCount();
      pausePlay.classList.remove('fa-pause');
      pausePlay.classList.add('fa-mug-hot');
    } else {
      pausePlay.classList.remove('fa-pause');
      pausePlay.classList.add('fa-pencil-alt');
    }
    clearInterval(timerOn);
    timerOn = setInterval(increaseSecond, 1000);
    extraTime = true;
    extra.classList.remove('extra-hidden');
    extra.textContent = `Extra Time: ${prettifyDate()}`;
  }
  timer.textContent = prettifyDate();
}
function increaseSecond() {
  date.setSeconds(date.getSeconds() + 1);
  extra.textContent = `Extra Time: ${prettifyDate()}`;
}
function prettifyDate() {
  return date.toISOString().substr(14, 5)
}
function updateSessionCount() {
  session[currentSession].classList.remove('far');
  session[currentSession].classList.add('fas');
  currentSession++;
  if(currentSession == 4) {
    window.addEventListener('click', clearSessionCount);
  }
}
function clearSessionCount() {
  session.forEach((session) => {
    session.classList.remove('fas');
    session.classList.add('far');
  })
}


