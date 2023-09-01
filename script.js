const categorySelect = document.getElementById('category');
const difficultySelect = document.getElementById('difficulty');
const typeSelect = document.getElementById('type');
const generateButton = document.getElementById('generate');
const triviaContainer = document.querySelector('.trivia');
const questionsContainer = document.getElementById('questions');
const submitButton = document.getElementById('submit');
const scoreContainer = document.getElementById('score');
const scoreValue = document.getElementById('scoreValue');
const newTriviaButton = document.getElementById('newTrivia');
const timerValueElement = document.getElementById('timerValue');
// TIMER
let timeLeft = 90;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timerValueElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
    }
}

function handleTimeout() {
    clearInterval(timerInterval);
    calculateScore(Array.from(questionsContainer.children));
    scoreContainer.style.display = 'block'; 
    scoreValue.textContent = 'Timeout! Your score will be displayed above.';
    submitButton.disabled = true;
}

// Fetch categories from API and populate dropdown
fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data => {
        data.trivia_categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    });

generateButton.addEventListener('click', generateTrivia);

function generateTrivia() {
    // Fetch trivia questions from API
    timeLeft = 90; // Reset the timer
    startTimer();
    const categoryId = categorySelect.value;
    const difficulty = difficultySelect.value;
    const type = typeSelect.value;
    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=${type}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayTrivia(data.results);
        });
}

// Funcion de la trivia 
function displayTrivia(questions) {
    
    if (questions.length === 0) {
        questionsContainer.innerHTML = '<p>No questions available for these settings. Please try different settings 😞 </p>';
        return;
    }
    triviaContainer.style.display = 'block';
    questionsContainer.innerHTML = '';

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
            <div class="answers">
                ${question.incorrect_answers.map(answer => `
                    <label>
                        <input type="radio" name="answer_${index}" value="${answer}">
                        ${answer}
                    </label>
                `).join('')}
                <label>
                    <input type="radio" name="answer_${index}" value="${question.correct_answer}">
                    ${question.correct_answer}
                </label>
            </div>
        `;
        questionsContainer.appendChild(questionElement);
    });

    submitButton.addEventListener('click', function () {
        clearInterval(timerInterval); // Stop the timer
        calculateScore(Array.from(questionsContainer.children)); // Pass the questions array
    });
}


// Funcion calculo score
function calculateScore(questions) {
    let score = 0;
    let answered = false;

    questions.forEach((question, index) => {
        const selectedAnswer = questions[index].querySelector('input:checked');
        if (selectedAnswer) {
            answered = true;
            const userAnswer = selectedAnswer.value;
            const correctAnswer = question.correct_answer;
            if (userAnswer === correctAnswer) {
                score += 100;
            }
        }
    });

    if (!answered) {
        scoreValue.textContent = 'No answers submitted.';
    } else {
        scoreValue.textContent = score;
    }

    scoreContainer.style.display = 'block';
}


// Funcion NUEVA TRIVIA
newTriviaButton.addEventListener('click', () => {
    triviaContainer.style.display = 'none';
    scoreContainer.style.display = 'none';
    questionsContainer.innerHTML = '';
    submitButton.disabled = true; // Disable the submit button until questions are generated again
});








