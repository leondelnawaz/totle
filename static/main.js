// main.js

function generateInputNumbers() {
  let inputNumbers = [];
  let numberCounts = {};
  let pairs = 0;

  while (inputNumbers.length < 9) {
      let num = Math.floor(Math.random() * 9) + 1;
      if (!numberCounts[num]) {
          numberCounts[num] = 1;
          inputNumbers.push(num);
      } else if (numberCounts[num] === 1 && pairs < 2) {
          numberCounts[num]++;
          inputNumbers.push(num);
          pairs++;
      }
  }
  return inputNumbers;
}

function getCombinations(arr, min, max) {
  let result = [];
  for (let i = min; i <= max; i++) {
      result = result.concat(combine(arr, i));
  }
  return result;
}

function combine(arr, len) {
  if (len === 1) return arr.map(el => [el]);
  let result = [];
  arr.forEach((el, i) => {
      let smallerCombos = combine(arr.slice(i + 1), len - 1);
      smallerCombos.forEach(combo => {
          result.push([el].concat(combo));
      });
  });
  return result;
}

function checkAutoSubmit(inputNumbers, selectedIndices, targetNumber) {
  const selectedNumbers = Array.from(selectedIndices).map(index => inputNumbers[index]);
  const currentSum = selectedNumbers.reduce((a, b) => a + b, 0);
  return currentSum === targetNumber;
}

document.addEventListener("DOMContentLoaded", function() {
  let score = 0;
  let bestScoreEasy = localStorage.getItem('bestScoreEasy') ? parseInt(localStorage.getItem('bestScoreEasy')) : 0;
  let bestScoreHard = localStorage.getItem('bestScoreHard') ? parseInt(localStorage.getItem('bestScoreHard')) : 0;
  let inputNumbers = [];
  let targetNumber = 0;
  let selectedIndices = new Set();
  let timerInterval;
  const initialTime = 60;
  let timeLeft = initialTime;
  let gameMode = 'easy';
  let isTimerRunning = false;

  const scoreElement = document.querySelector('.score');
  const targetElement = document.querySelector('.target');
  const timerElement = document.querySelector('.timer');
  const numbersContainer = document.querySelector('.numbers');
  const resetButton = document.getElementById('resetButton');
  const endButton = document.getElementById('endButton');

  const correctSound = new Audio('static/correct.mp3');
  const incorrectSound = new Audio('static/incorrect.mp3');

  resetButton.addEventListener('click', resetSelection);
  endButton.addEventListener('click', endCurrentRound);

  const easyButton = document.getElementById('easyButton');
  const hardButton = document.getElementById('hardButton');
  easyButton.addEventListener('click', () => setMode('easy'));
  hardButton.addEventListener('click', () => setMode('hard'));

  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', startGame);

  const restartButton = document.getElementById('restartButton');
  restartButton.addEventListener('click', restartGame);

  const homeButton = document.getElementById('homeButton');
  homeButton.addEventListener('click', goHome);

  easyButton.classList.add('active');

  function setMode(mode) {
      gameMode = mode;
      if (mode === 'easy') {
          easyButton.classList.add('active');
          hardButton.classList.remove('active');
          loadEasyMode();
      } else {
          easyButton.classList.remove('active');
          hardButton.classList.add('active');
          loadHardMode();
      }
  }

  function startGame() {
      score = 0;
      timeLeft = initialTime;
      isTimerRunning = false;
      document.getElementById('start-screen').style.display = 'none';
      document.getElementById('game-screen').style.display = 'block';
      generateNewRound();
      startTimer();
  }

  function restartGame() {
      score = 0;
      timeLeft = initialTime;
      isTimerRunning = false;
      document.getElementById('final-score-screen').style.display = 'none';
      document.getElementById('game-screen').style.display = 'block';
      generateNewRound();
      startTimer();
  }

  function goHome() {
      score = 0;
      timeLeft = initialTime;
      isTimerRunning = false;
      clearInterval(timerInterval);
      document.getElementById('final-score-screen').style.display = 'none';
      document.getElementById('start-screen').style.display = 'block';
  }

  function generateNewRound() {
      let attempts = 0;
      do {
          inputNumbers = generateInputNumbers();
          targetNumber = gameMode === 'easy' ? generateTargetNumberEasy(inputNumbers) : generateTargetNumberHard(inputNumbers);
          attempts++;
      } while (targetNumber === 0 && attempts < 10);

      if (targetNumber === 0) {
          alert("Failed to generate a valid target number after several attempts. Please reload the page.");
          return;
      }

      selectedIndices.clear();
      updateUI();

      if (!isTimerRunning) {
          timeLeft = initialTime;
          startTimer();
      }
  }

  function updateUI() {
      scoreElement.textContent = `Score: ${score}`;
      targetElement.textContent = targetNumber;
      timerElement.textContent = `Time Left: ${timeLeft}s`;
      numbersContainer.innerHTML = '';

      const circleRadius = 120;
      const centerX = 150;
      const centerY = 150;

      const targetCircle = document.createElement('div');
      targetCircle.classList.add('circle', 'target-circle');
      targetCircle.style.left = `${centerX - 40}px`;
      targetCircle.style.top = `${centerY - 40}px`;
      const targetText = document.createElement('div');
      targetText.classList.add('target');
      targetText.textContent = targetNumber;
      targetCircle.appendChild(targetText);
      numbersContainer.appendChild(targetCircle);

      inputNumbers.forEach((num, index) => {
          const angle = (index / 9) * (2 * Math.PI);
          const x = centerX + circleRadius * Math.cos(angle) - 30;
          const y = centerY + circleRadius * Math.sin(angle) - 30;
          const numberElement = document.createElement('div');
          numberElement.textContent = num;
          numberElement.classList.add('circle', 'number');
          numberElement.style.left = `${x}px`;
          numberElement.style.top = `${y}px`;
          numberElement.addEventListener('click', () => toggleNumber(index));
          numbersContainer.appendChild(numberElement);
      });
  }

  function toggleNumber(index) {
      const numberElements = document.querySelectorAll('.number');
      if (selectedIndices.has(index)) {
          selectedIndices.delete(index);
          numberElements[index].classList.remove('selected');
      } else {
          selectedIndices.add(index);
          numberElements[index].classList.add('selected');
      }

      checkAutoSubmit();
  }

  function resetSelection() {
      selectedIndices.clear();
      const numberElements = document.querySelectorAll('.number');
      numberElements.forEach(el => el.classList.remove('selected'));
  }

  function checkAutoSubmit() {
      const selectedNumbers = Array.from(selectedIndices).map(index => inputNumbers[index]);
      const currentSum = selectedNumbers.reduce((a, b) => a + b, 0);
      if (currentSum === targetNumber) {
          score++;
          correctSound.play();
          generateNewRound();
      }
  }

  function startTimer() {
      clearInterval(timerInterval);
      isTimerRunning = true;
      timerInterval = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
      if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endGame();
      } else {
          timeLeft--;
          timerElement.textContent = `Time Left: ${timeLeft}s`;
      }
  }

  function endGame() {
      isTimerRunning = false;
      document.getElementById('game-screen').style.display = 'none';
      document.getElementById('final-score-screen').style.display = 'block';

      document.querySelector('.final-score').textContent = `Final Score: ${score}`;

      if (gameMode === 'easy') {
          if (score > bestScoreEasy) {
              bestScoreEasy = score;
              localStorage.setItem('bestScoreEasy', bestScoreEasy);
          }
          document.querySelector('.best-score').textContent = `Best Score (Easy): ${bestScoreEasy}`;
      } else {
          if (score > bestScoreHard) {
              bestScoreHard = score;
              localStorage.setItem('bestScoreHard', bestScoreHard);
          }
          document.querySelector('.best-score').textContent = `Best Score (Hard): ${bestScoreHard}`;
      }
  }

  function endCurrentRound() {
      timeLeft = 0;
      updateTimer();
  }

  clearInterval(timerInterval);
});

module.exports = {
  generateInputNumbers,
  getCombinations,
  combine,
  checkAutoSubmit
};
