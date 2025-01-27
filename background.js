let timer;
let sessionCount = 0;
let timeLeft = 25 * 60;
let breakTime = 5 * 60;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    startTimer();
  } else if (message.action === 'stop') {
    stopTimer();
  } else if (message.action === 'setTimer') {
    sessionDuration = message.sessionDuration * 60;
    breakDuration = message.breakDuration * 60;
    resetTimer();
  }
});

function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      chrome.storage.local.set({ timeLeft: timeLeft });
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      sessionCount++;
      chrome.storage.local.set({ sessionCount: sessionCount });
      chrome.runtime.sendMessage({ action: 'playSound' });
      resetTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  resetTimer();
}

function resetTimer() {
  timeLeft = sessionDuration;
  chrome.storage.local.set({ timeLeft: timeLeft });
  updateTimerDisplay();
}

function updateTimerDisplay() {
  chrome.storage.local.get(['timeLeft', 'sessionCount'], function(data) {
    let minutes = Math.floor(data.timeLeft / 60);
    let seconds = data.timeLeft % 60;
    chrome.runtime.sendMessage({
      action: 'updateDisplay',
      minutes: minutes,
      seconds: seconds,
      sessionCount: data.sessionCount
    });
  });
}
