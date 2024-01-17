//Query Selectors
var highscoresOL = document.querySelector("#highscores")
var clearButton = document.querySelector("#clear")
var feedbackDiv = document.querySelector("#feedback")

function getHighScores() {     //Function to retive high scores from local storage
    var highScores = JSON.parse(localStorage.getItem("scores"))
    return highScores   //retuns all high scores as a parsed object; scores: {[initails:"", scpre:0]...&SO ON}
}

function renderHighscores(highScores) {
    highscoresOL.innerHTML = ""
    if (highScores.length < 1) {  //If there are no high scores then dispaly "There are no highsores yet"
        var highScoreH3 = document.createElement("h3")
        highScoreH3.textContent = `There are no highsores yet`
        highscoresOL.appendChild(highScoreH3)
        return
    }
    highScores.sort((a, b) => b.score - a.score) //sort scores highest to lowest
    highScores.forEach((score) => {  //render each score as a LI
        var highScoreLI = document.createElement("li")
        highScoreLI.textContent = `${score.initials} - ${score.score}` //Add text to each LI
        highscoresOL.appendChild(highScoreLI)
    });
}

function clearHighScores() {
    if (getHighScores() < 1) {
        renderFeedback("There are currently no high scores", "red", 3000)  //render feedback
        return //exit function
    }
    localStorage.setItem("scores", "[]")  //Reset all high scores
    renderHighscores(getHighScores()) //Rerender after they have been reset
    renderFeedback("All high scores have been reset", "green", 3000)
}

function renderFeedback(message, color, duration) {
    feedbackDiv.classList.remove("hide")
    feedbackDiv.textContent = message  //display feedback message
    feedbackDiv.style.color = color    //set the color of the feedback message

    setTimeout(() => {
        feedbackDiv.classList.add("hide")
    }, duration) //make feedback message disapear after x amout of time
}

renderHighscores(getHighScores())  //Renders high scores on inital page load

//Event listeners
clearButton.addEventListener("click", clearHighScores)