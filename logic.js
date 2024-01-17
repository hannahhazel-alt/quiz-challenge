//Start screen selectors
var startScreen = document.querySelector("#start-screen")
var startButton = document.querySelector("#start")

//Questions Selectors
var questionsDiv = document.querySelector("#questions")
var questionTitle = document.querySelector("#question-title")
var questionChoises = document.querySelector("#choices")

//Feedback Selectors
var feedbackDiv = document.querySelector("#feedback")

//End Screen Selectors
var endScreenDiv = document.querySelector("#end-screen")
var finalScoreSpan = document.querySelector("#final-score")
var submitButton = document.querySelector("#submit")
var initialsInput = document.querySelector("#initials")
var playAgainButton = document.querySelector("#play-again")

//Timer Selectors
var timerEL = document.querySelector("#time")
var timerDiv = document.querySelector(".timer")

//Global Time variables
var timeLeft = 80
var timePenalty = 15

//Global Question variables
var questionsAlreadyAsked = []
var currentQuestion;

//Global Score variables
var score = 0
var scoreIncrement = 11;

//Function to start or to restart the quiz 
function startQuiz() {
    questionsAlreadyAsked = []
    score = 0
    timeLeft = 80
    startScreen.remove()
    questionsDiv.classList.remove("hide")
    timerDiv.classList.remove("hide")
    timerDiv.style.color = "black"
    endScreenDiv.classList.add("hide")
    startTimer()
    renderQuestionAndAnswers(getRandomQuestion())
}

//Function in controll of the timer
function startTimer() {
    timerEL.textContent = `${timeLeft} Secconds remaining`
    var timeInterval = setInterval(function () {
        if (timeLeft >= 10) {
            timerEL.textContent = `${timeLeft} Secconds remaining`
        } else if (timeLeft < 10 && timeLeft > 1) {
            timerDiv.style.color = "red"
            timerEL.textContent = `${timeLeft} Seccond remaining`
        } else if (timeLeft === 1) {
            timerEL.textContent = `${timeLeft} Seccond remaining`
        } else {
            endQuiz()
        }

        if (!endScreenDiv.classList.contains("hide")) {
            timerDiv.classList.add("hide")
            clearInterval(timeInterval)
        }
        timeLeft--
    }, 1000);
}

//Function to pick a random question from questions.js
function getRandomQuestion() {
    var randomIndex = Math.floor(Math.random() * quizQuestions.length)
    while (questionsAlreadyAsked.includes(randomIndex)) {
        randomIndex = Math.floor(Math.random() * quizQuestions.length)
    }
    questionsAlreadyAsked.push(randomIndex)
    var randQuestionData = quizQuestions[randomIndex]
    currentQuestion = randQuestionData
    return randQuestionData
}

function renderQuestionAndAnswers(currentQuestion) {
    questionChoises.innerHTML = ""
    questionTitle.textContent = currentQuestion.question
    currentQuestion.answers.forEach((answer, i) => {
        var answerBTN = document.createElement("button")
        answerBTN.setAttribute("data-index", i)
        answerBTN.textContent = `${i + 1}. ${answer}`
        questionChoises.appendChild(answerBTN)
    });

}

//function to check the selected answer
function onAnswerSelect(e) {
    if (questionsAlreadyAsked.length >= quizQuestions.length) {
        endQuiz()
        return
    }
    var element = e.target
    if (element.matches("button") === true) {
        var index = parseInt(element.getAttribute("data-index"));
        var correctAnswerIndex = currentQuestion.correctAnswer
        console.log(index, correctAnswerIndex)
        if (index === correctAnswerIndex) {
            score += scoreIncrement
            renderFeedback("Correct!", "green", 1000, true)
        } else {
            timeLeft -= timePenalty
            renderFeedback("Incorrect!", "red", 1000, true)
        }
        renderQuestionAndAnswers(getRandomQuestion())
    }
}

//Function for end of quiz 
function endQuiz() {
    questionsDiv.classList.add("hide")
    endScreenDiv.classList.remove("hide")
    finalScoreSpan.textContent = score
    initialsInput.value = ""
}

//Function to handel score submission
function handelSubmitScore() {
    if (initialsInput.value.length < 2) {
        renderFeedback("You initials must be 2 characters.", "red", 3000)
        return
    }
    var submitData = {
        initials: initialsInput.value,
        score
    }
    var prevScores = JSON.parse(localStorage.getItem("scores"))
    if (!prevScores) prevScores = [];
    localStorage.setItem("scores", JSON.stringify([...prevScores, submitData]))
    renderFeedback("You score has been submitted", "green", 3000)

}

//Function to render the visual feedback and to play audio 
function renderFeedback(message, color, duration, audio = false) {
    if (audio) {
        if (color === "green") {
            var audio = new Audio('assets/sfx/correct.wav');
            audio.play();
        } else if (color === "red") {
            var audio = new Audio('assets/sfx/incorrect.wav');
            audio.play();
        }
    }

    feedbackDiv.classList.remove("hide")
    feedbackDiv.textContent = message
    feedbackDiv.style.color = color

    setTimeout(() => {
        feedbackDiv.classList.add("hide")
    }, duration)
}

//Global Event Listeners
startButton.addEventListener("click", startQuiz)
questionChoises.addEventListener("click", onAnswerSelect)
submitButton.addEventListener("click", handelSubmitScore)
playAgainButton.addEventListener("click", startQuiz)