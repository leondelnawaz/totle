// easyMode.js

function generateTargetNumberEasy(inputNumbers) {
    let iterations = 0;
    let targetNumber = 0;
  
    while (iterations < 1000) {
        const target = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // Change range to 10-20
        const combinations = getCombinations(inputNumbers, 3, 6);
        const validCombos = combinations.filter(combo => combo.reduce((a, b) => a + b, 0) === target);
  
        if (validCombos.length > 0) {
            targetNumber = target;
            return targetNumber;
        }
        iterations++;
    }
    return targetNumber;
}

function loadEasyMode() {
    console.log("Easy mode loaded");
}

document.addEventListener("DOMContentLoaded", function() {
    loadEasyMode();
});

module.exports = {
    generateTargetNumberEasy
};
