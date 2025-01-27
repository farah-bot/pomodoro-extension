document.getElementById('start-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'start' });
});

document.getElementById('stop-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stop' });
});

document.getElementById('save-settings').addEventListener('click', () => {
  let sessionDuration = document.getElementById('session-duration').value || 25; 
  let breakDuration = document.getElementById('break-duration').value || 5; 

  chrome.runtime.sendMessage({
    action: 'setTimer',
    sessionDuration: sessionDuration,
    breakDuration: breakDuration
  });
});


chrome.storage.local.get(['timeLeft', 'sessionCount'], function(data) {
  let timeLeft = data.timeLeft || 0;
  let sessionCount = data.sessionCount || 0;

  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;

  document.getElementById('timer-display').innerText = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  document.getElementById('session-count').innerText = `Sessions Completed: ${sessionCount}`;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'playSound') {
    let audio = new Audio(chrome.runtime.getURL('sounds/happy-bell.wav'));
    audio.play().catch(err => console.error('Error playing sound:', err));
  }
});
