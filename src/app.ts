import "./sass/main.scss";

import Data from "../assets/data.json";
import { fetchQuestions, Question } from "./quiz";

export class App {
  private message: string;

  constructor(msg: string) {
    this.message = msg;
  }

  public printHello(id: string) {
    const container = document.getElementById(id);
    if (!!container) {
      container.innerHTML = this.message;
      //const a = "aaaa";
    } else {
      console.error(`<element id="${id}" ...> does not exist !`);
    }
  }
}

const appInstance = new App("Hello Webpack and TypeScript ♥");
appInstance.printHello("app");
console.log(Data);

console.log("Hello Webpack and TypeScript ♥");

let Questions: Question[] = [];
const ques = document.getElementById("ques") as HTMLDivElement;

// Other variables and functions go here...

async function init() {
  try {
    Questions = await fetchQuestions();
    console.log("🚀 ~ init ~ Questions:", Questions);
    // Load the first question after fetching the data
    //fetchQuestions();
  } catch (error) {
    console.error(error);
    ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
  }
}

init();

// let Questions: any[] = [];
// const ques = document.getElementById("ques") as HTMLDivElement;

// async function fetchQuestions() {
//   try {
//     const response = await fetch("https://opentdb.com/api.php?amount=10");
//     if (!response.ok) {
//       throw new Error(`Something went wrong!! Unable to fetch the data`);
//     }
//     const data = await response.json();
//     Questions = data.results;
//   } catch (error) {
//     console.log(error);
//     ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
//   }
// }
// fetchQuestions();

let currQuestion = 0;
let score = 0;

if (Questions.length === 0) {
  ques.innerHTML = `<h5>Please Wait!! Loading Questions...</h5>`;
}

function loadQues() {
  const opt = document.getElementById("opt") as HTMLDivElement;
  let currentQuestion: string = Questions[currQuestion].question;
  if (currentQuestion.indexOf('"') > -1) {
    currentQuestion = currentQuestion.replace(/"/g, '"');
  }
  if (currentQuestion.indexOf("'") > -1) {
    currentQuestion = currentQuestion.replace(/&#039;/g, "'");
  }
  ques.innerText = currentQuestion;
  opt.innerHTML = "";
  const correctAnswer: string = Questions[currQuestion].correct_answer;
  const incorrectAnswers: string[] = Questions[currQuestion].incorrect_answers;
  const options: string[] = [correctAnswer, ...incorrectAnswers];
  options.sort(() => Math.random() - 0.5);
  options.forEach((option) => {
    let optionText = option;
    if (optionText.indexOf('"') > -1) {
      optionText = optionText.replace(/"/g, '"');
    }
    if (optionText.indexOf("'") > -1) {
      optionText = optionText.replace(/'/g, "'");
    }
    const choicesdiv = document.createElement("div");
    const choice = document.createElement("input");
    const choiceLabel = document.createElement("label");
    choice.type = "radio";
    choice.name = "answer";
    choice.value = option;
    choiceLabel.textContent = optionText;
    choicesdiv.appendChild(choice);
    choicesdiv.appendChild(choiceLabel);
    opt.appendChild(choicesdiv);
  });
}

setTimeout(() => {
  loadQues();
  if (Questions.length === 0) {
    ques.innerHTML = `<h5 style='color: red'>Unable to fetch data, Please try again!!</h5>`;
  }
}, 2000);

function loadScore() {
  const totalScore = document.getElementById("score") as HTMLDivElement;
  totalScore.textContent = `You scored ${score} out of ${Questions.length}`;
  totalScore.innerHTML += "<h3>All Answers</h3>";
  Questions.forEach((el, index) => {
    totalScore.innerHTML += `<p>${index + 1}. ${el.correct_answer}</p>`;
  });
}

function nextQuestion() {
  if (currQuestion < Questions.length - 1) {
    currQuestion++;
    loadQues();
  } else {
    document.getElementById("opt")?.remove();
    document.getElementById("ques")?.remove();
    document.getElementById("btn")?.remove();
    loadScore();
  }
}

// function checkAns() {
//   const selectedAns = document.querySelector('input[name="answer"]:checked');
//   if (selectedAns === Questions[currQuestion].correct_answer) {
//     score++;
//   }
//   nextQuestion();
// }
function checkAnswer(selectedAns: string): void {
  const correctAns = Questions[currQuestion].correct_answer;
  console.log("🚀 ~ Questions:", Questions);
  if (selectedAns === correctAns) {
    score++;
  }
  nextQuestion();
}

const selectedAns = (
  document.querySelector('input[name="answer"]:checked') as HTMLInputElement
)?.value;

//checkAnswer(selectedAns, correctAns);

const btn = document.getElementById("btn") as HTMLButtonElement;

btn.addEventListener("click", () => checkAnswer(selectedAns));

console.log("Score: ", score);
