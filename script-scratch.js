// I wanted to move away from relying on setInterval to update the timer dispaly and gradient, since it seems that it stops updating when the browser tab or window have not been in focus for a while. The basic idea was subtracting two Dates, and getting either the time remaining or percent completed that way, which did basically work. However, this was making the timer appear to skip, because I was still using a setInterval to update the timer (it was now getting it's value from the two Dates, so would have persisted regardless of whether the browser tab was focused), which was offset from the milliseconds of the Date subtraction function. I broke this iteration of the program experimenting with getting rid of the setInterval altogether and changing it into a boolean that checked if milliseconds == 0, and updated the timer display if so. I think it would work, but I would have to change a LOT of code. Plus I still needed to keep track of the time elapsed during a pause, and account for that as well. I think if I wanted to get this working right the best thing would be to basically start from scratch, which right now I think is not in my best interest. This was a Pair Programming project (even though the vast majority was just me), and the code is extra chaotic because of that.


const sessionTime = document.querySelector('#set-session');
const breakTime = document.querySelector('#set-break');

const sessionTitle = document.querySelector('#session-title');
const breakTitle = document.querySelector('#break-title');

sessionTime.textContent = 25;
breakTime.textContent = 5;

buttons = document.querySelectorAll('button')
buttons.forEach((button) => button.addEventListener('click', buttonClick));
pausePlay = document.querySelector('i');

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
            let minutes = sessionTime.textContent;
            targetTime = new Date(0);
            targetTime.setMinutes(minutes);
            startTime = new Date();
            resetGradient();
            newSession = false;
          }
          timerOn = 'session';
          calculate_time_session(timerOn);
          timerGradient = setInterval(updateGradient, 100);


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
      minutes = +sessionTime.textContent;
      timerDate = new Date(0);
      timerDate.setMinutes(minutes);
      timer.textContent = prettifyDate(timerDate);
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
  if (timerDate.getMinutes() === 0 && timerDate.getSeconds() === 0) {
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
    clearInterval(timerGradient);
    startTime = new Date(0);
    timerOn = setInterval(increaseSecond, 1000);
    extraTime = true;
    extra.classList.remove('extra-hidden');
    extra.textContent = `Extra Time: ${prettifyDate(calculate_time_break())}`;
    timer.textContent = '00:00';
  }
  else timer.textContent = prettifyDate(calculate_time_session('timer'));
}
function increaseSecond() {
  extra.textContent = `Extra Time: ${prettifyDate(calculate_time_break())}`;
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
function updateGradient(progressPercent) {
  colorVariable = progressPercent;
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
function calculate_time_session (timerOn) {
  while(timerOn = 'session') {
    currentTime = new Date();


    let progress = currentTime.getTime() - startTime.getTime();
    let progressPercent = progress / targetTime.getTime() * 100;
    console.log(progressPercent + '%');

    timerDate = new Date(0);
    timerDate.setMilliseconds(targetTime.getTime() - progress);

    if(timerDate.getMilliseconds() == 0) {
      timer.textContent = prettifyDate(timerDate)
    }
    updateGradient(progressPercent);
  }
}
function calculate_time_break() {
  currentTime = new Date();
  let progress = currentTime.getTime() - startTime.getTime();
  timerDate = new Date(0);
  timerDate.setMilliseconds(progress);
  return timerDate;
}