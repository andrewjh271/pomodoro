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
let timerCount = 0;

const timer = document.querySelector('#timer');
timer.textContent = prettifyDate();

let currentlyWorking = true;
let extraTime = false;
let newSession = true;

let startTime;

// let gradientTimer;

const extra = document.querySelector('.extra');

let currentSession = 0;
//background-image: linear-gradient(-45deg, #762ada, #13d4e2 0%, #762ada 60%);

// let topDiamond = document.querySelector('#top-diamond', ':before');
// console.log(topDiamond);
const rootElement = document.documentElement;
// topDiamond.style = 'background-image: linear-gradient(-45deg, #762ada, #13d4e2 70%, #762ada 80%)';
// console.log(getComputedStyle(rootElement).getPropertyValue('--linear-background-top'));
// rootElement.style.setProperty('--linear-background-top', 'linear-gradient(-45deg, #762ada, #13d4e2 100%, #762ada 80%)');

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
            resetGradient();
            startTime = +sessionTime.textContent;
            newSession = false;
          }
          // setTimeout(function() {timerOn = setInterval(decreaseSecond, 100)}, 900);
          timerOn = setInterval(decreaseSecond, 100);
          // gradientTimer = setInterval(updateGradient, 100)
          pausePlay.classList.remove('fa-play')
          pausePlay.classList.add('fa-pause')
          if(currentlyWorking) sessionTitle.classList.add('active-session');
          else breakTitle.classList.add('active-break');
          break;
        } else {
          clearInterval(timerOn);
          timerOn = null;
          // clearInterval(gradientTimer);
          pausePlay.classList.remove('fa-pause')
          pausePlay.classList.add('fa-play')
          if(currentlyWorking) sessionTitle.classList.remove('active-session');
          else breakTitle.classList.remove('active-break');
          break;
        }
      } else {
        pausePlay.classList.add('fa-pause')
        pausePlay.style = ('color: gray');
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
          setTimeout(function() {timerOn = setInterval(decreaseSecond, 100)}, 900);
        } else {
          seconds = 60 * +sessionTime.textContent;
          date.setSeconds(seconds);
          timer.textContent = prettifyDate();
          resetGradient();
          // gradientTimer = setInterval(updateGradient, 100)
          startTime = +sessionTime.textContent;
          currentlyWorking = true;
          pausePlay.classList.remove('fa-pencil-alt');
          sessionTitle.classList.add('active-session');
          breakTitle.classList.remove('active-break');
          setTimeout(function() {timerOn = setInterval(decreaseSecond, 100)}, 900);
        }
      }
      break;
    case('reset'):
      resetGradient();
      newSession = true;
      clearInterval(timerOn);
      timerOn = null;
      // clearInterval(gradientTimer);
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
      pausePlay.style = ('color: gray');
      break;
  }
  // date = new Date(0);
  // date.setSeconds(seconds);
  // timer.textContent = prettifyDate();
}
// function incrementDate() {
//   if(timerCount == 10) {
//     timerCount = 0;
//     decreaseSecond();
//   } else timerCount++;
//   updateGradient();
// }
function decreaseSecond() {
  date.setMilliseconds(date.getMilliseconds() - 100);
  if (date.getMinutes() === 0 && date.getSeconds() === 0) {
    if(currentlyWorking) {
      updateSessionCount();
      pausePlay.classList.remove('fa-pause');
      pausePlay.classList.add('fa-mug-hot');
      pausePlay.style = ('color: chocolate');
    } else {
      pausePlay.classList.remove('fa-pause');
      pausePlay.classList.add('fa-pencil-alt');
    }
    // clearInterval(gradientTimer);
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
  // console.log(remainingTime);
  let progress = 1 - (remainingTime / (startTime * 60 * 1000));
  console.log(progress);

  let colorTwoStart = progress * 2 * 100;

  if (colorTwoStart >= 100) {
    colorTwoStart = 100;
  }

  let colorThreeStart = 60 + progress * 40;

  let colorVariable = progress * 1.1 * 100;
  console.log(colorVariable);

  // console.log(colorTwoStart)
  // console.log(colorThreeStart)

  // rootElement.style.setProperty('--linear-background-top',
  //   `linear-gradient(225deg,#13d4e2, #8672a1 ${colorTwoStart}%, #13d4e2 ${colorThreeStart}%)`);
  // rootElement.style.setProperty('--linear-background-bottom', 
  //   `linear-gradient(-45deg, #762ada, #13d4e2 ${colorTwoStart}%, #762ada ${colorThreeStart}%`);

  rootElement.style.setProperty('--linear-background-top',
    `linear-gradient(225deg,red, blue ${colorTwoStart}%, red ${colorThreeStart}%)`);


  rootElement.style.setProperty('--linear-background-top',
    `linear-gradient(222deg, #02ddec -70%, #de1af8 ${colorVariable}%, #02ddec 120%)`);
  rootElement.style.setProperty('--linear-background-bottom', 
  `linear-gradient(142deg, #02ddec -30%, #de1af8 ${colorVariable}%, #02ddec 170%)`);
  
}
function resetGradient() {
  rootElement.style.setProperty('--linear-background-top',
    `linear-gradient(222deg, #02ddec -70%, #de1af8 0%, #02ddec 120%)`);
  rootElement.style.setProperty('--linear-background-bottom', 
    `linear-gradient(142deg, #02ddec -30%, #de1af8 0%, #02ddec 170%)`);
}
