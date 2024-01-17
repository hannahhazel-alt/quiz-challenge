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
var questionsAlreadyAsked = []  //array to keep trak of questuions already asked, this will ensure that the same question doesnt get asked twice in one quiz
var currentQuestion;

//Global Score variables
var score = 0
var scoreIncrement = 11;

//-=======Functions========-

function startQuiz() {                      //Function to start or to restart the quiz
    questionsAlreadyAsked = []
    score = 0
    timeLeft = 80
    startScreen.remove()   //remove is used to unload this element from the DOM as it wont be used again until page is refreshed
    questionsDiv.classList.remove("hide")  //Hide class is removed to reveal elements
    timerDiv.classList.remove("hide")
    timerDiv.style.color = "black"
    endScreenDiv.classList.add("hide")  //Hide class is added to elelemets that will be revealed again at some point
    startTimer()
    renderQuestionAndAnswers(getRandomQuestion())  //renders the first question
}

function startTimer() {                          //Function in controll of the timer
    timerEL.textContent = `${timeLeft} Secconds remaining`  //update the current time left shown on the page
    var timeInterval = setInterval(function () {
        if (timeLeft >= 10) {
            timerEL.textContent = `${timeLeft} Secconds remaining`
        } else if (timeLeft < 10 && timeLeft > 1) {  //change font color to red if less then 10 secconds remain
            timerDiv.style.color = "red"
            timerEL.textContent = `${timeLeft} Seccond remaining`
        } else if (timeLeft === 1) {
            timerEL.textContent = `${timeLeft} Seccond remaining`
        } else { //time has ran out
            endQuiz()
        }

        if (!endScreenDiv.classList.contains("hide")) { // if the game is over 
            timerDiv.classList.add("hide")
            clearInterval(timeInterval)  //Clean up timer to save resorces
        }
        timeLeft--
    }, 1000);
}

function getRandomQuestion() {               //Function to pick a random question from questions.js
    var randomIndex = Math.floor(Math.random() * quizQuestions.length)  //pick a random index number
    while (questionsAlreadyAsked.includes(randomIndex)) {  //pick a new random number if the 1st one has alreay been asked
        randomIndex = Math.floor(Math.random() * quizQuestions.length)
    }
    questionsAlreadyAsked.push(randomIndex)  //update questionsAlreadyAsked array to include the newly genarated array index
    var randQuestionData = quizQuestions[randomIndex]
    currentQuestion = randQuestionData //i tried to avoid having currentQuestion as a global variabale but i didnt know how to get this into the event handeler :(
    return randQuestionData //retrun the random question, associated answers and correct answer
}

function renderQuestionAndAnswers(currentQuestion) {
    questionChoises.innerHTML = "" //removes previous buttons
    questionTitle.textContent = currentQuestion.question //render question text to page
    currentQuestion.answers.forEach((answer, i) => {  //render all answer options to page
        var answerBTN = document.createElement("button")
        answerBTN.setAttribute("data-index", i) //set a data-index so each button can be identified
        answerBTN.textContent = `${i + 1}. ${answer}` //add text to each button
        questionChoises.appendChild(answerBTN)
    });

}

function onAnswerSelect(e) {             //function to check the selected andwer, the click event is passed into this
    if (questionsAlreadyAsked.length >= quizQuestions.length) { //user has answered all questions so end quiz
        endQuiz()
        return
    }
    var element = e.target
    if (element.matches("button") === true) {
        var index = parseInt(element.getAttribute("data-index"));
        var correctAnswerIndex = currentQuestion.correctAnswer  //retive the index of the correct answer
        console.log(index, correctAnswerIndex)
        if (index === correctAnswerIndex) {  //answer was correct
            score += scoreIncrement //increase score
            renderFeedback("Correct!", "green", 1000, true)  //render feedback WITH audio
        } else {  //answer was incorrect
            timeLeft -= timePenalty //Decrese time
            renderFeedback("Incorrect!", "red", 1000, true)
        }
        renderQuestionAndAnswers(getRandomQuestion()) //Render the next question
    }
}

function endQuiz() {
    questionsDiv.classList.add("hide")
    endScreenDiv.classList.remove("hide")
    finalScoreSpan.textContent = score  //render the users score to the page
    initialsInput.value = "" //reset input incase this is the users 2nd or more play
}

function handelSubmitScore() {           //Function to handel score submission
    if (initialsInput.value.length < 2) {  //Make sure the input is more then 2 characters
        renderFeedback("You initials must be atleast 2 characters. Score NOT saved", "red", 3000)  //render feedback WITHOUT sound
        return
    }
    var submitData = {  //Build the sumbit data object
        initials: initialsInput.value,
        score
    }
    var prevScores = JSON.parse(localStorage.getItem("scores"))  //get previous scores
    if (!prevScores) prevScores = [];  //this is to prevent an error, if there are no scores then use a empty array
    localStorage.setItem("scores", JSON.stringify([...prevScores, submitData]))  //Save the new score and previous sores into local storage
    renderFeedback("You score has been submitted", "green", 3000)

}

function renderFeedback(message, color, duration, audio = false) {      //function to render the visual feedback and to play audio feedback if needed
    if (audio) {
        if (color === "green") { //play relevent audio depending on what is input to this function
            var audio = new Audio('assets/sfx/correct.wav');
            audio.play();
        } else if (color === "red") {
            var audio = new Audio('assets/sfx/incorrect.wav');
            audio.play();
        }
    }

    feedbackDiv.classList.remove("hide")
    feedbackDiv.textContent = message  //display feedback message
    feedbackDiv.style.color = color    //set the color of the feedback message

    setTimeout(() => {  //make feedback message disapear after x amout of time
        feedbackDiv.classList.add("hide")
    }, duration)
}

//Global Event Listeners
startButton.addEventListener("click", startQuiz)
questionChoises.addEventListener("click", onAnswerSelect)
submitButton.addEventListener("click", handelSubmitScore)
playAgainButton.addEventListener("click", startQuiz)