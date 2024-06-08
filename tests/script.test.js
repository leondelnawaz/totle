const { generateInputNumbers, generateTargetNumber, checkAutoSubmit } = require('../static/script');

// Mock necessary DOM elements and methods
document.body.innerHTML = `
  <div class="target">0</div>
  <div class="numbers"></div>
  <div class="score">Score: 0</div>
  <div class="timer">Time Left: 60s</div>
`;

describe('Totle Game Functions', () => {
  test('generateInputNumbers should generate 9 unique numbers with at most 2 pairs', () => {
    const inputNumbers = generateInputNumbers();
    console.log('Generated Input Numbers:', inputNumbers);
    expect(inputNumbers.length).toBe(9);
    const numCounts = {};
    inputNumbers.forEach(num => {
      numCounts[num] = (numCounts[num] || 0) + 1;
    });
    const pairCount = Object.values(numCounts).filter(count => count === 2).length;
    expect(pairCount).toBeLessThanOrEqual(2);
  });

  test('generateTargetNumber should generate a valid target number in easy mode', () => {
    const inputNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const targetNumber = generateTargetNumber(inputNumbers, 'easy');
    console.log('Generated Target Number (Easy):', targetNumber);
    expect(targetNumber).toBeGreaterThanOrEqual(10);
    expect(targetNumber).toBeLessThanOrEqual(25);
  });

  test('generateTargetNumber should generate a valid target number in hard mode', () => {
    const inputNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const targetNumber = generateTargetNumber(inputNumbers, 'hard');
    const maxNum = Math.max(...inputNumbers);
    console.log('Generated Target Number (Hard):', targetNumber);
    expect(targetNumber).toBeGreaterThanOrEqual(maxNum * 3);
    expect(targetNumber).toBeLessThanOrEqual(maxNum * 4);
  });

  test('checkAutoSubmit should correctly check if selected numbers match the target', () => {
    const inputNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const selectedIndices = new Set([0, 1, 2]);
    const targetNumber = 6; // 1 + 2 + 3
    const result = checkAutoSubmit(inputNumbers, selectedIndices, targetNumber);
    console.log('Check Auto Submit Result:', result);
    expect(result).toBe(true);
  });

  test('checkAutoSubmit should correctly return false if selected numbers do not match the target', () => {
    const inputNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const selectedIndices = new Set([0, 1, 2]);
    const targetNumber = 10; // 1 + 2 + 3 does not equal 10
    const result = checkAutoSubmit(inputNumbers, selectedIndices, targetNumber);
    console.log('Check Auto Submit Result (False Case):', result);
    expect(result).toBe(false);
  });
});
