document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const questionContainerElement = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const timerElement = document.getElementById('time');
    const endScreenElement = document.getElementById('end-screen');
    const initialsElement = document.getElementById('initials');
    const submitButton = document.getElementById('submit-btn');
    const highScoresContainer = document.getElementById('high-scores-container');
    const highScoresList = document.getElementById('high-scores');
    const resetButton = document.getElementById('reset-btn');
  
  
    let shuffledQuestions, currentQuestionIndex;
    let quizTimer = 60; // Timer set for 60 seconds
    let timerId;
    let score = 0; // Initialize score
  
    startButton.addEventListener('click', startGame);
    submitButton.addEventListener('click', saveScore);
    resetButton.addEventListener('click', resetGame);
  
    function startGame() {
      startButton.classList.add('hide');
      shuffledQuestions = questions.sort(() => Math.random() - .5);
      currentQuestionIndex = 0;
      questionContainerElement.classList.remove('hide');
      setNextQuestion();
      startTimer();
      score = 0; // Reset score at the start
    }
  
    function startTimer() {
      timerElement.textContent = quizTimer;
      timerId = setInterval(() => {
        quizTimer--;
        timerElement.textContent = quizTimer;
        if (quizTimer <= 0) {
          clearInterval(timerId);
          endGame();
        }
      }, 1000);
    }
  
    function setNextQuestion() {
      resetState();
      showQuestion(shuffledQuestions[currentQuestionIndex]);
    }
  
    function showQuestion(question) {
      questionElement.textContent = question.question;
      question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
          button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
      });
    }
  
    function resetState() {
      clearStatusClass(document.body);
      while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
      }
    }
  
    function selectAnswer(e) {
      const selectedButton = e.target;
      const correct = selectedButton.dataset.correct;
      setStatusClass(document.body, correct);
      Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
      });
      if (correct) {
        score += 10; // Add score for correct answer
      } else {
        score -= 5; // Subtract score for incorrect answer
      }
      if (shuffledQuestions.length > currentQuestionIndex + 1) {
        setTimeout(() => {
          currentQuestionIndex++;
          setNextQuestion();
        }, 1000);
      } else {
        setTimeout(endGame, 1000);
      }
    }
  
    function setStatusClass(element, correct) {
      clearStatusClass(element);
      if (correct) {
        element.classList.add('correct');
      } else {
        element.classList.add('wrong');
      }
    }
  
    function clearStatusClass(element) {
      element.classList.remove('correct');
      element.classList.remove('wrong');
    }