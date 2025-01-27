document.getElementById('start-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'start' });
});

document.getElementById('stop-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' });
});

document.getElementById('save-settings').addEventListener('click', () => {
  let sessionDuration = document.getElementById('session-duration').value;
  let breakDuration = document.getElementById('break-duration').value;
  
  chrome.runtime.sendMessage({
    action: 'setTimer',
    sessionDuration: sessionDuration,
    breakDuration: breakDuration
  });
});

chrome.storage.local.get(['timeLeft', 'sessionCount'], function(data) {
  let minutes = Math.floor(data.timeLeft / 60);
  let seconds = data.timeLeft % 60;
  document.getElementById('timer-display').innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  document.getElementById('session-count').innerText = `Sessions Completed: ${data.sessionCount}`;
});
