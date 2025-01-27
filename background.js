let timer;
let sessionDuration = 25 * 60; 
let breakDuration = 5 * 60; 
let timeLeft = sessionDuration;
let isSessionActive = false;
let sessionCount = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ sessionCount: 0 });
});


function startTimer() {
  if (isSessionActive) return;
  isSessionActive = true;
  timer = setInterval(updateTimer, 1000);
  
}


function stopTimer() {
  clearInterval(timer);
  isSessionActive = false;
}


function updateTimer() {
  timeLeft--;


  if (timeLeft <= 0) {
    timeLeft = isSessionActive === true ? breakDuration : sessionDuration;
    isSessionActive = !isSessionActive;
    notifyUser();
    updateSessionCount();
  }

  chrome.storage.local.set({ timeLeft: timeLeft });
}

function notifyUser() {
  let message = isSessionActive ? 'Take a break!' : 'Back to work!';
  let title = isSessionActive ? 'Break Time' : 'Pomodoro Session';
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: title,
    message: message
  });

  let audio = new Audio('sounds/happy-bell.wav');
  audio.play();
}


function updateSessionCount() {
  chrome.storage.local.get('sessionCount', function(data) {
    let newSessionCount = data.sessionCount + 1;
    chrome.storage.local.set({ sessionCount: newSessionCount });
  });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setTimer') {
    sessionDuration = message.sessionDuration * 60;
    breakDuration = message.breakDuration * 60;
    sendResponse({ status: 'Timer set successfully' });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    startTimer();
  } else if (message.action === 'stop') {
    stopTimer();
  }
});
