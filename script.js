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
    let quizTimer = 60; 
    let timerId;
    let score = 0; 
  
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
      score = 0; 
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
        score += 10; 
      } else {
        score -= 5; 
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
  
    function endGame() {
      clearInterval(timerId);
      questionContainerElement.classList.add('hide');
       highScoresContainer.style.display = 'none';
      endScreenElement.classList.remove('hide');
  
    }
  
    function displayHighScores() {
      const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
      highScores.sort((a, b) => b.score - a.score);
      highScoresList.innerHTML = ''; 
  
      
      if (highScores.length > 0) {
        const highestScore = highScores[0];
        highScoresList.innerHTML += `<li>Highest Score: ${highestScore.initials} - ${highestScore.score}</li>`;
      }
  
        const currentScoreDisplay = document.querySelector('#current-score');
      if (!currentScoreDisplay) {
        const currentScoreElement = document.createElement('div');
        currentScoreElement.id = 'current-score';
        currentScoreElement.textContent = `Your Score: ${score}`;
        highScoresContainer.appendChild(currentScoreElement);
      } else {
        currentScoreDisplay.textContent = `Your Score: ${score}`;
      }
    }
  
    function saveScore() {
      const initials = initialsElement.value.trim();
      if (initials !== '') {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        const newScore = { score: score, initials: initials };
  
              if (!highScores.length || score > highScores[0].score) {
       
          highScores.unshift(newScore); 
          highScores.sort((a, b) => b.score - a.score); 
          highScores.splice(5); 
  
        localStorage.setItem('highScores', JSON.stringify(highScores));
        initialsElement.value = '';
        endScreenElement.classList.add('hide');
        highScoresContainer.style.display = 'block';
        displayHighScores(); 
      } else {
        alert('Please enter your initials!');
      }
    }
  
    function resetGame() {
   
      clearInterval(timerId);
      quizTimer = 60;
      timerElement.textContent = 'Time: 0s'; 
      
      score = 0;
  
      // Reset the display of various elements
      questionContainerElement.classList.add('hide'); 
      endScreenElement.classList.add('hide'); 
      highScoresContainer.style.display = 'none'; 
      startButton.classList.remove('hide'); 
  
      
      clearStatusClass(document.body);
      document.querySelectorAll('.btn').forEach(button => {
        clearStatusClass(button);
      });
  
  
      initialsElement.value = '';
  
 
      highScoresList.innerHTML = '';
      displayHighScores();
    }
  
    const questions = [
      {
        question: 'What is 2 + 2?',
        answers: [
          { text: '4', correct: true },
          { text: '22', wrong: false }
        ]
      },
      {
        question: 'What is the capital of France?',
        answers: [
          { text: 'London', wrong: false },
          { text: 'Paris', correct: true },
          { text: 'Berlin', wrong: false },
          { text: 'Rome', wrong: false }
        ]
      },
      {
        question: 'Which planet is known as the Red Planet?',
        answers: [
          { text: 'Mars', correct: true },
          { text: 'Venus', wrong: false },
          { text: 'Jupiter', wrong: false },
          { text: 'Mercury', wrong: false }
        ]
      },
      {
        question: 'What is the chemical symbol for water?',
        answers: [
          { text: 'H2O', correct: true },
          { text: 'CO2', wrong: false },
          { text: 'O2', wrong: false },
          { text: 'H2SO4', wrong: false }
        ]
      },
      {
        question: 'Who wrote the play "Romeo and Juliet"?',
        answers: [
          { text: 'William Shakespeare', correct: true },
          { text: 'Charles Dickens', wrong: false },
          { text: 'Jane Austen', wrong: false },
          { text: 'Mark Twain', wrong: false }
        ]
      },
      {
        question: 'What is the largest mammal?',
        answers: [
          { text: 'Elephant', wrong: false },
          { text: 'Blue Whale', correct: true },
          { text: 'Giraffe', wrong: false },
          { text: 'Hippopotamus', wrong: false }
        ]
      },
      {
        question: 'Which country is famous for the Taj Mahal?',
        answers: [
          { text: 'India', correct: true },
          { text: 'China', wrong: false },
          { text: 'Egypt', wrong: false },
          { text: 'Brazil', wrong: false }
        ]
      },
      {
        question: 'What is the powerhouse of the cell?',
        answers: [
          { text: 'Nucleus', wrong: false },
          { text: 'Mitochondria', correct: true },
          { text: 'Chloroplast', wrong: false },
          { text: 'Ribosome', wrong: false }
        ]
      },
      {
        question: 'What is the tallest mountain in the world?',
        answers: [
          { text: 'Mount Everest', correct: true },
          { text: 'K2', wrong: false },
          { text: 'Kangchenjunga', wrong: false },
          { text: 'Makalu', wrong: false }
        ]
      },
      {
        question: 'Which gas do plants use for photosynthesis?',
        answers: [
          { text: 'Carbon Dioxide', correct: true },
          { text: 'Oxygen', wrong: false },
          { text: 'Nitrogen', wrong: false },
          { text: 'Hydrogen', wrong: false }
        ]
      }
    ];
  
    displayHighScores(); 
  });
  