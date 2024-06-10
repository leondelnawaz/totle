// dailyPuzzle.js

function generateDailyPuzzleNumbers() {
    const numbers = [];
    numbers.push(100); // Always include 100
    numbers.push(50);  // Always include 50
    numbers.push(Math.floor(Math.random() * 9 + 1) * 10); // A random multiple of 10 between 10 and 90

    while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 8) + 2; // Random numbers between 2 and 9
        numbers.push(num);
    }

    return numbers;
}

function generateDailyTargetNumber(numbers) {
    const addSubOps = ['+', '-'];
    const mulOp = '*';
    const divOp = '/';
    let target = 0;
    let expression = '';

    // Attempt to generate a valid target number using all numbers and required operations
    for (let i = 0; i < 1000; i++) {
        let expr = `${numbers[0]}`;
        const remainingNumbers = numbers.slice(1);

        let usedAdd = false;
        let usedSub = false;
        let usedMul = false;
        let usedDiv = false;

        while (remainingNumbers.length > 0) {
            let op;
            if (!usedMul) {
                op = mulOp;
                usedMul = true;
            } else if (!usedDiv) {
                // Ensure division results in a whole number
                op = divOp;
                let num;
                do {
                    num = remainingNumbers.shift();
                } while (numbers[0] % num !== 0);
                expr += ` ${op} ${num}`;
                usedDiv = true;
                continue;
            } else if (!usedAdd) {
                op = addSubOps[Math.floor(Math.random() * 2)];
                usedAdd = true;
            } else if (!usedSub) {
                op = addSubOps[Math.floor(Math.random() * 2)];
                usedSub = true;
            } else {
                op = addSubOps[Math.floor(Math.random() * addSubOps.length)];
            }
            const num = remainingNumbers.shift();
            expr += ` ${op} ${num}`;
        }

        try {
            target = eval(expr); // Evaluate the expression
            if (Number.isInteger(target) && target >= 100 && target <= 999) {
                expression = expr;
                break;
            }
        } catch (e) {
            continue; // If an error occurs, try a new expression
        }
    }

    return { target, expression };
}

function extractOperations(expression) {
    // Extract operations from the expression
    const operations = expression.match(/[+\-*/]/g);
    return operations;
}

document.addEventListener("DOMContentLoaded", function() {
    const dailyPuzzleButton = document.getElementById('dailyPuzzleButton');
    dailyPuzzleButton.addEventListener('click', startDailyPuzzle);

    function startDailyPuzzle() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('daily-puzzle-screen').style.display = 'block';
        setupDailyPuzzle();
    }

    function setupDailyPuzzle() {
        const numbers = generateDailyPuzzleNumbers();
        const { target, expression } = generateDailyTargetNumber(numbers);

        document.getElementById('daily-target-number').textContent = target;

        const inputNumbersContainer = document.querySelector('.input-numbers');
        inputNumbersContainer.innerHTML = '';
        numbers.forEach(num => {
            const numberButton = document.createElement('button');
            numberButton.classList.add('number-button');
            numberButton.textContent = num;
            numberButton.dataset.selected = 'false';
            numberButton.addEventListener('click', () => toggleNumberSelection(numberButton));
            inputNumbersContainer.appendChild(numberButton);
        });

        const requiredOperations = extractOperations(expression);
        const operationsContainer = document.querySelector('.operations');
        operationsContainer.innerHTML = '';
        requiredOperations.forEach(op => {
            const operationButton = document.createElement('button');
            operationButton.classList.add('operation-button');
            operationButton.textContent = op;
            operationButton.dataset.selected = 'false';
            operationButton.addEventListener('click', () => toggleOperationSelection(operationButton));
            operationsContainer.appendChild(operationButton);
        });

        // Add unlimited bracket buttons
        const openBracketButton = document.createElement('button');
        openBracketButton.classList.add('operation-button');
        openBracketButton.textContent = '(';
        openBracketButton.addEventListener('click', () => appendToExpression('('));
        operationsContainer.appendChild(openBracketButton);

        const closeBracketButton = document.createElement('button');
        closeBracketButton.classList.add('operation-button');
        closeBracketButton.textContent = ')';
        closeBracketButton.addEventListener('click', () => appendToExpression(')'));
        operationsContainer.appendChild(closeBracketButton);

        const expressionBox = document.querySelector('.expression-box');
        expressionBox.textContent = '';
        
        const liveResult = document.getElementById('live-result');
        liveResult.textContent = '0';

        const checkSolutionButton = document.getElementById('checkSolutionButton');
        checkSolutionButton.addEventListener('click', () => checkSolution(numbers, target));

        const resetPuzzleButton = document.getElementById('resetPuzzleButton');
        resetPuzzleButton.addEventListener('click', resetExpression);

        const homeButtonPuzzle = document.getElementById('homeButtonPuzzle');
        homeButtonPuzzle.addEventListener('click', goHome);
    }

    function toggleNumberSelection(button) {
        const isSelected = button.dataset.selected === 'true';
        if (isSelected) {
            button.style.backgroundColor = '#4caf50'; // Green
            button.dataset.selected = 'false';
            removeFromExpression(button.textContent);
        } else {
            button.style.backgroundColor = '#d3d3d3'; // Grey
            button.dataset.selected = 'true';
            appendToExpression(button.textContent);
        }
        evaluateExpression();
    }

    function toggleOperationSelection(button) {
        const isSelected = button.dataset.selected === 'true';
        if (isSelected) {
            button.style.backgroundColor = ''; // Default
            button.dataset.selected = 'false';
            removeFromExpression(button.textContent);
        } else {
            button.style.backgroundColor = '#d3d3d3'; // Grey
            button.dataset.selected = 'true';
            appendToExpression(button.textContent);
        }
        evaluateExpression();
    }

    function appendToExpression(value) {
        const expressionBox = document.querySelector('.expression-box');
        expressionBox.textContent += ` ${value}`;
        evaluateExpression();
    }

    function removeFromExpression(value) {
        const expressionBox = document.querySelector('.expression-box');
        const currentExpression = expressionBox.textContent.trim().split(' ');
        const valueIndex = currentExpression.indexOf(value);
        if (valueIndex > -1) {
            currentExpression.splice(valueIndex, 1);
        }
        expressionBox.textContent = currentExpression.join(' ');
        evaluateExpression();
    }

    function resetExpression() {
        const expressionBox = document.querySelector('.expression-box');
        expressionBox.textContent = '';

        const numberButtons = document.querySelectorAll('.number-button');
        numberButtons.forEach(button => {
            button.style.backgroundColor = '#4caf50'; // Reset to Green
            button.dataset.selected = 'false';
        });

        const operationButtons = document.querySelectorAll('.operation-button');
        operationButtons.forEach(button => {
            button.style.backgroundColor = ''; // Reset to default
            button.dataset.selected = 'false';
        });

        const liveResult = document.getElementById('live-result');
        liveResult.textContent = '0';
    }

    function evaluateExpression() {
        const expressionBox = document.querySelector('.expression-box');
        const liveResult = document.getElementById('live-result');
        const expression = expressionBox.textContent.trim();

        try {
            const result = eval(expression);
            liveResult.textContent = result;
        } catch (error) {
            liveResult.textContent = 'Error';
        }
    }

    function checkSolution(numbers, targetNumber) {
        const expressionBox = document.querySelector('.expression-box');
        const expression = expressionBox.textContent.trim();

        try {
            const result = eval(expression);
            if (result === targetNumber) {
                alert("Correct! You've solved the daily puzzle.");
            } else {
                alert("Incorrect solution. Try again.");
            }
        } catch (error) {
            alert("Invalid expression. Please check your input.");
        }
    }

    function goHome() {
        document.getElementById('daily-puzzle-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
    }
});
