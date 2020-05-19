const sessionTime = document.querySelector('#set-session');
const breakTime = document.querySelector('#set-break');

const sessionTitle = document.querySelector('#session-title');
const breakTitle = document.querySelector('#break-title');

sessionTime.textContent = 1;
breakTime.textContent = 1;

buttons = document.querySelectorAll('button')
buttons.forEach((button) => button.addEventListener('click', buttonClick));
pausePlay = document.querySelector('i');

let minutes;
// let minutes = sessionTime.textContent;
// let targetTime = new Date(0);
// targetTime.setMinutes(minutes);
// let timeString = prettifyDate(targetTime);

let timerOn;

const timer = document.querySelector('#timer');
timer.textContent = '25:00';

let currentlyWorking = true;
let extraTime = false;
let newSession = true;
let startTime;
let targetTime;
let currentTime;

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
            minutes = sessionTime.textContent;
            targetTime = new Date(0);
            targetTime.setMinutes(minutes);
            startTime = new Date();
            resetGradient();
            newSession = false;
          }
          timerOn = setInterval(decreaseSecond, 1000)
          if(currentlyWorking)
            timerGradient = setInterval(updateGradient, 100);


          pausePlay.classList.remove('fa-play')
          pausePlay.classList.add('fa-pause')
          if(currentlyWorking) sessionTitle.classList.add('active-session');
          else breakTitle.classList.add('active-break');
          break;
        } else {
          clearInterval(timerOn);
          timerOn = null;
          clearInterval(timerGradient)
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
        extraTime = false;
        extra.classList.add('extra-hidden');
        if(currentlyWorking) {
          minutes = +breakTime.textContent;
          targetTime = new Date(0);
          targetTime.setMinutes(minutes);
          startTime = new Date();
          currentlyWorking = false;
          pausePlay.classList.remove('fa-mug-hot');
          sessionTitle.classList.remove('active-session');
          breakTitle.classList.add('active-break');
          timer.textContent = prettifyDate(targetTime);
          timerOn = setInterval(decreaseSecond, 1000);
        } else {
          minutes = +sessionTime.textContent;
          targetTime = new Date(0);
          targetTime.setMinutes(minutes);
          startTime = new Date();
          currentlyWorking = true;
          pausePlay.classList.remove('fa-pencil-alt');
          sessionTitle.classList.add('active-session');
          breakTitle.classList.remove('active-break');
          resetGradient();
          timer.textContent = prettifyDate(targetTime);
          timerGradient = setInterval(updateGradient, 100)
          timerOn = setInterval(decreaseSecond, 1000);
        }
      }
      break;
    case('reset'):
      resetGradient();
      newSession = true;
      clearInterval(timerOn);
      timerOn = null;
      minutes = +sessionTime.textContent;
      targetTime = new Date(0);
      targetTime.setMinutes(minutes);
      timer.textContent = prettifyDate(targetTime);
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
  if (calculate_time_session() == "00:00") {
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
    startTime = new Date();
    extra.classList.remove('extra-hidden');
    extra.textContent = `Extra Time: ${calculate_extra_time()}`;
    clearInterval(timerOn);
    clearInterval(timerGradient);
    timerOn = setInterval(increaseSecond, 1000);
    extraTime = true;
    timer.textContent = '00:00';
  }
  else timer.textContent = calculate_time_session();
}
function increaseSecond() {
  extra.textContent = `Extra Time: ${calculate_extra_time()}`;
}
function prettifyDate(date) {
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
function resetGradient() {
  rootElement.style.setProperty('--linear-background-top',
    `linear-gradient(222deg, #02ddec -70%, #ee05db 0%, #02ddec 120%)`);
  rootElement.style.setProperty('--linear-background-bottom', 
    `linear-gradient(142deg, #02ddec -30%, #ee05db 0%, #02ddec 120%)`);
}
function updateGradient() {
  currentTime = new Date();


  let progress = currentTime.getTime() - startTime.getTime();
  let progressPercent = progress / targetTime.getTime() * 100;

  colorVariable = progressPercent;
  rootElement.style.setProperty('--linear-background-top',
    `linear-gradient(222deg, #02ddec -70%, #ee05db ${colorVariable}%, #02ddec 120%)`);
  rootElement.style.setProperty('--linear-background-bottom', 
  `linear-gradient(142deg, #02ddec -30%, #ee05db ${colorVariable * 1.2}%, #02ddec 120%)`);  
}
function calculate_time_session() {
  currentTime = new Date();


  let progress = currentTime.getTime() - startTime.getTime();

  let timerDate = new Date(0);
  timerDate.setSeconds(Math.round((targetTime.getTime() - progress) / 1000));
  console.log(timerDate)
  console.log(timerDate.getMilliseconds());
  return prettifyDate(timerDate)
}
function calculate_extra_time() {
  currentTime = new Date();
  let elapsed_time = currentTime.getTime() - startTime.getTime();
  elapsedDate = new Date(0);
  elapsedDate.setSeconds(Math.round(elapsed_time / 1000))
  return prettifyDate(elapsedDate);
}