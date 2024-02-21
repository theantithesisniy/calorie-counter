const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

let isError = false;

// function cleanInputString (str) {    // set an input element to be a number, JavaScript receives a string value.
//     const strArray = str.split('');
//     const cleanStrArray = [];
//     for (let i = 0; i < strArray.length; i++) {
//         if (!["+", "-", " "].includes(strArray[i])) {
//             cleanStrArray.push(strArray[i])
//         }
//     }
// }

function cleanInputString(str) {
    const regex = /[+\s-]/g;  // \s any whitespace character [] - character class
    return str.replace(regex, '');
}

function isInvalidInput(str) {
    const regex = /\d+e\d+/i; // i - for uppercase, + allows to match a pattern that occurs one or more times
    return str.match(regex);
}

function addEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    let entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;  // returns a nodeList of all the elm that match the sel
    const HTMLString = `
        <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
        <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
        <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
        <input type="number" 
                min="0" 
                id="${entryDropdown.value}-${entryNumber}-calories" 
                placeholder="Calories"/>
    `;
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

function getCaloriesFromInputs(list) {      // list be the result of query sel which will return NodeList
    let calories = 0;
    for (const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);

        if (invalidInputMatch) {
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal);
    }
    return calories;
}

function calculateCalories(e) {
    e.preventDefault();
    isError = false;

    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]'); // ret number inputs that are in the #breakfast element.
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    if (isError) {
        return
    }
    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    let surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
    output.innerHTML = `
        <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
        <hr>
        <p>${budgetCalories} Calories Budgeted</p>
        <p>${consumedCalories} Calories Consumed</p>
        <p>${exerciseCalories} Calories Exercise</p>
    `;
    output.classList.remove('hide');
}

function clearForm() {
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));  // converts it to an array
    for (const container of inputContainers) {
        container.innerHTML = '';
    }
    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
}

addEntryButton.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit', calculateCalories);
clearButton.addEventListener('click', clearForm);