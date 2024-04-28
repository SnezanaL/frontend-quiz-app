import { Question, questions, renderCurrentQuestion } from "./questionService";
import {
  findCardWithCorrectAnswer,
  checkAnswer,
  calculateScore,
} from "./quizHelper";
import { addScoreCard, id } from "./app";
const errorIcon = require("../../assets/images/icon-error.svg") as string;

let currentQuestionIndex = 1;
let message = "";
let score = 0;

export function renderQuestion(
  id: string,
  questions: Question[],
  quizContainer: HTMLElement
): void {
  const question = questions[currentQuestionIndex];

  const questionDiv = document.createElement("div");
  const optionsDiv = document.createElement("div");
  optionsDiv.classList.add("row");
  const questionTitle = document.createElement("h4");
  const questNumber = document.createElement("p");
  questNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  questionDiv.classList.add("row");
  questionDiv.setAttribute("id", "question_div");

  const answers = new Map<number, string>(); // Store the answers provided by the user

  questionTitle.textContent = `${question.question}`;

  questionDiv.appendChild(questNumber);
  questionDiv.appendChild(questionTitle);

  const nextButton = document.createElement("button");

  // question.options.forEach((option: string) => {
  for (let i = 0; i < question.options.length; i++) {
    const option = question.options[i];
    // const optionInput = document.createElement("input");
    // optionInput.type = "radio";
    // optionInput.name = "options";
    // optionInput.value = option;
    // optionInput.addEventListener("change", () => {
    //   // Store the selected answer
    //   question.question = option;

    //   console.log("🚀 select question:", question);
    // });

    const card = document.createElement("div");
    console.log("🚀 ~ question.options.forEach ~ card:", card);
    const cardQuestion = document.createElement("h3");
    card.classList.add("card");
    card.classList.add("cardOption");

    cardQuestion.textContent = option;
    optionsDiv.appendChild(card);

    card.appendChild(cardQuestion);
    let selectedCard = document.querySelector(".selected");
    // if (!selectedCard) {
    //   //nextButton.disabled = true;
    // }

    card.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("click");
      let selected = document.querySelector(".selected");
      // Remove the selected class from all cards
      nextButton.disabled = false;
      divMessage.innerHTML = "";
      if (selected) {
        selected.classList.remove("selected");
      }
      card.classList.add("selected");
      // Store the selected answer
      answers.set(currentQuestionIndex, option);
      console.log("🚀 select question:", answers);
    });
  }

  // a bit delayed to make sure the cards are created
  setTimeout(() => {
    const cards = document.querySelectorAll(".cardOption");
    console.log("🚀 ~ //question.options.forEach ~ cards:", cards);
    for (let i = 0; i < cards.length; i++) {
      const letters = ["A", "B", "C", "D"];
      // add one letter to each card
      const card = cards[i];
      const optionLabel = document.createElement("div");
      const optionLetter = document.createElement("h3");
      optionLabel.classList.add("optionLabel");
      optionLetter.classList.add("optionLetter");
      optionLetter.textContent = letters[i];
      // card.appendChild(optionLabel);
      card.insertBefore(optionLabel, card.firstChild);
      optionLabel.appendChild(optionLetter);

      cards[i].addEventListener("click", () => {
        // Store the selected answer
        answers.set(currentQuestionIndex, question.options[i]);
      });
    }
  }, 10);

  nextButton.textContent = "Submit Answer";
  nextButton.addEventListener("click", () => {
    if (nextButton.textContent === "Submit Answer") {
      let selectedCard = document.querySelector(".selected");
      if (!selectedCard) {
        message = `<img src=${errorIcon}/> Please select an answer`;
        divMessage.innerHTML = message;
        return;
      } else {
        message = "";
      }
    }
    if (nextButton.textContent === "Next Question") {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        renderCurrentQuestion(id);
      } else {
        // End of questions
        quizContainer.innerHTML = "End of questions.";
      }
      // renderQuestion(id, questions, quizContainer);
      // return;
    } else {
      const checkIfCorrect = checkAnswer(
        question,
        answers.get(currentQuestionIndex) || ""
      );
      console.log("checkIfCorrect:", checkIfCorrect);
      let selectedCard = document.querySelector(".selected");
      if (!checkIfCorrect.correct) {
        const correctAnswer = checkIfCorrect.correctAnswer;
        const cards = document.querySelectorAll(".cardOption");

        const cardWithCorrectAnswer = findCardWithCorrectAnswer(correctAnswer);
        console.log("Card with correct answer:", cardWithCorrectAnswer);
        cardWithCorrectAnswer.classList.add("correct");

        //const selectedCard = document.querySelector(".selected");
        selectedCard.classList.add("wrong");
        selectedCard.classList.remove("selected");
        nextButton.textContent = "Next Question";
      } else {
        score++;
        selectedCard.classList.remove("selected");
        selectedCard.classList.add("correctAnswer");
        nextButton.textContent = "Next Question";
      }
    }
  });

  if (currentQuestionIndex === questions.length - 1) {
    nextButton.addEventListener("click", () => {
      displayScore(score, questions.length);
    });
  }

  console.log("answers:", answers);
  quizContainer.appendChild(questionDiv);
  quizContainer.appendChild(optionsDiv);
  optionsDiv.appendChild(nextButton);
  const divMessage = document.createElement("div");
  divMessage.id = "message";
  optionsDiv.appendChild(divMessage);
  addProgressBar();
}

// Add progress bar to the page
function addProgressBar(): void {
  const progress = document.createElement("div");
  progress.classList.add("progress");

  const progressBar = document.createElement("div");
  const quizContainer = document.getElementById("question_div");
  progressBar.classList.add("progress-bar");

  progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
  quizContainer.appendChild(progress);
  progress.appendChild(progressBar);
}

// Calculate the score based on the answers provided
function displayScore(score: number, totalQuestions: number): void {
  const quizContainer = document.getElementById("quiz-container");
  if (!quizContainer) {
    throw new Error("Quiz container not found");
  }
  const headerTitle = id;

  const scoreDisplay = addScoreCard(headerTitle, score, totalQuestions);
  console.log(" scoreDisplay:", scoreDisplay);
  quizContainer.style.display = "none";
  const main = document.querySelector("main");
  main.appendChild(scoreDisplay);

  // const scoreMessage = document.createElement("p");
  // scoreMessage.textContent = `You scored ${score} out of ${totalQuestions}!`;

  // quizContainer.appendChild(scoreMessage);
}
