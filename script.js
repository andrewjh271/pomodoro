const sessionTime = document.querySelector('#set-session');
const breakTime = document.querySelector('#set-break');

const sessionTitle = document.querySelector('#session-title');
const breakTitle = document.querySelector('#break-title');

sessionTime.textContent = 25;
breakTime.textContent = 5;

buttons = document.querySelectorAll('button')
buttons.forEach((button) => button.addEventListener('click', buttonClick));
pausePlay = document.querySelector('i');

let seconds = 60 * sessionTime.textContent;
let date = new Date(0);
date.setSeconds(seconds);
let timeString = prettifyDate();
console.log(timeString);

let timerOn;
let timerCount = 0;

const timer = document.querySelector('#timer');
timer.textContent = prettifyDate();

let currentlyWorking = true;
let extraTime = false;
let newSession = true;

let startTime;

const extra = document.querySelector('.extra');

let currentSession = 0;

const rootElement = document.documentElement;

// console.log(getComputedStyle(rootElement).getPropertyValue('--linear-background-top'));

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
      if(+sessionTime.textContent < 59)
        sessionTime.textContent = +sessionTime.textContent + 1;
      break;
    case('session-down'):
      if(+sessionTime.textContent > 1)
        sessionTime.textContent -= 1;
      break;
    case('break-up'):
      if(+breakTime.textContent < 59)
        breakTime.textContent = +breakTime.textContent + 1;
      break;
    case('break-down'):
      if(+breakTime.textContent > 1)
        breakTime.textContent -= 1;
      break;
    case('pause-play'):
      if(!extraTime) {
        if(!timerOn) {
          if(newSession) {
            date = new Date(0);
            seconds = 60 * sessionTime.textContent;
            date.setSeconds(seconds);
            resetGradient();
            startTime = +sessionTime.textContent;
            newSession = false;
          }
          timerOn = setInterval(decreaseSecond, 100);
          pausePlay.classList.remove('fa-play')
          pausePlay.classList.add('fa-pause')
          if(currentlyWorking) sessionTitle.classList.add('active-session');
          else breakTitle.classList.add('active-break');
          break;
        } else {
          clearInterval(timerOn);
          timerOn = null;
          pausePlay.classList.remove('fa-pause')
          pausePlay.classList.add('fa-play')
          if(currentlyWorking) sessionTitle.classList.remove('active-session');
          else breakTitle.classList.remove('active-break');
          break;
        }
      } else {
        pausePlay.classList.add('fa-pause')
        pausePlay.style = ('color: #1f91a4');
        clearInterval(timerOn);
        date = new Date(0);
        extraTime = false;
        extra.classList.add('extra-hidden');
        if(currentlyWorking) {
          seconds = 60 * +breakTime.textContent;
          date.setSeconds(seconds);
          timer.textContent = prettifyDate();
          currentlyWorking = false;
          pausePlay.classList.remove('fa-mug-hot');
          sessionTitle.classList.remove('active-session');
          breakTitle.classList.add('active-break');
          timerOn = setInterval(decreaseSecond, 100);
        } else {
          seconds = 60 * +sessionTime.textContent;
          date.setSeconds(seconds);
          timer.textContent = prettifyDate();
          resetGradient();
          startTime = +sessionTime.textContent;
          currentlyWorking = true;
          pausePlay.classList.remove('fa-pencil-alt');
          sessionTitle.classList.add('active-session');
          breakTitle.classList.remove('active-break');
          timerOn = setInterval(decreaseSecond, 100);
        }
      }
      break;
    case('reset'):
      resetGradient();
      newSession = true;
      clearInterval(timerOn);
      timerOn = null;
      seconds = 60 * +sessionTime.textContent;
      date = new Date(0);
      date.setSeconds(seconds);
      timer.textContent = prettifyDate();
      currentlyWorking = true;
      currentSession = 0;
      extraTime = false;
      extra.classList.add('extra-hidden');
      session.forEach((session) => {
        session.classList.remove('fas');
        session.classList.add('far');
      })
      sessionTitle.classList.remove('active-session');
      breakTitle.classList.remove('active-break');
      pausePlay.classList.remove('fa-pause')
      pausePlay.classList.remove('fa-pencil-alt');
      pausePlay.classList.remove('fa-mug-hot');
      pausePlay.classList.add('fa-play')
      pausePlay.style = ('color: #1f91a4');
      break;
  }
}
function decreaseSecond() {
  date.setMilliseconds(date.getMilliseconds() - 100);
  if (date.getMinutes() === 0 && date.getSeconds() === 0) {
    if(currentlyWorking) {
      updateSessionCount();
      pausePlay.classList.remove('fa-pause');
      pausePlay.classList.add('fa-mug-hot');
      pausePlay.style = ('color: #7b3d07');
    } else {
      pausePlay.classList.remove('fa-pause');
      pausePlay.classList.add('fa-pencil-alt');
      pausePlay.style = ('color: rgb(208, 123, 15)')
    }
    clearInterval(timerOn);
    timerOn = setInterval(increaseSecond, 1000);
    extraTime = true;
    extra.classList.remove('extra-hidden');
    extra.textContent = `Extra Time: ${prettifyDate()}`;
  }
  if(currentlyWorking) updateGradient();
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
function updateGradient() {
  const remainingTime = date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();
  let progress = 1 - (remainingTime / (startTime * 60 * 1000));
  // console.log(progress);

  let colorVariable = progress * 100;
  console.log(colorVariable);

  rootElement.style.setProperty('--linear-background-top',
    `linear-gradient(222deg, #02ddec -70%, #ee05db ${colorVariable}%, #02ddec 120%)`);
  rootElement.style.setProperty('--linear-background-bottom', 
  `linear-gradient(142deg, #02ddec -30%, #ee05db ${colorVariable * 1.2}%, #02ddec 120%)`);  
}
function resetGradient() {
  rootElement.style.setProperty('--linear-background-top',
    `linear-gradient(222deg, #02ddec -70%, #ee05db 0%, #02ddec 120%)`);
  rootElement.style.setProperty('--linear-background-bottom', 
    `linear-gradient(142deg, #02ddec -30%, #ee05db 0%, #02ddec 120%)`);
}
