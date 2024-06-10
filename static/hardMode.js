// hardMode.js

function generateTargetNumberHard(inputNumbers) {
    const maxNum = Math.max(...inputNumbers);
    let iterations = 0;
    let targetNumber = 0;
  
    while (iterations < 1000) {
        const target = Math.floor(Math.random() * (maxNum * 4 - maxNum * 3 + 1)) + maxNum * 3;
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

function loadHardMode() {
    console.log("Hard mode loaded");
}

document.addEventListener("DOMContentLoaded", function() {
    loadHardMode();
});

module.exports = {
    generateTargetNumberHard
};
