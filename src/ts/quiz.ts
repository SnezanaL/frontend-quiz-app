import Data from "../../assets/data.json";

// Define global variables
let questions: any[] = []; // Array to store all questions
let currentQuestionIndex = 1; // Index of the current question

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export async function fetchQuestions(quiz: string): Promise<Question[]> {
  try {
    const response = (await Data) as any;
    if (!response) {
      throw new Error(`Unable to fetch questions: ${response}`);
    }
    const data = await response.quizzes.find((q: any) => q.title === quiz)
      .questions;
    console.log("🚀 ~ fetchQuestions ~ data:", data);

    return data as Question[];
  } catch (error) {
    throw new Error(`Error fetching questions: ${error.message}`);
  }
}

export function calculateScore(
  questions: Question[],
  answers: Map<number, string>
): number {
  let score = 0;
  questions.forEach((question, index) => {
    console.log(
      "🚀 ~ questions.forEach ~ answers.get(index):",
      answers.get(index)
    );
    console.log(
      "🚀 ~ questions.forEach ~ answers.has(index):",
      answers.has(index)
    );
    if (answers.has(index) && answers.get(index) === question.answer) {
      score++;
    }
  });
  return score;
}

// Function to check if the provided answer is correct
function checkAnswer(
  question: Question,
  userAnswer: string
): { correct: boolean; correctAnswer?: string } {
  const correct = userAnswer === question.answer;
  if (!correct) {
    return { correct: false, correctAnswer: question.answer };
  }
  return { correct: true };
}

// Render current question on the page
export async function renderCurrentQuestion(id: string) {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";
  //questions = await fetchQuestions(id);

  try {
    questions = await fetchQuestions(id);
    renderQuestion(id, questions, quizContainer);
  } catch (error) {
    console.error("Error loading questions:", error);
    quizContainer.textContent = "Error loading questions. Please try again.";
  }
}

function renderQuestion(
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

  const selectedCard = document.querySelector(".selected");
  const nextButton = document.createElement("button");

  // question.options.forEach((option: string) => {
  for (let i = 0; i < question.options.length; i++) {
    const option = question.options[i];
    const optionInput = document.createElement("input");
    optionInput.type = "radio";
    optionInput.name = "options";
    optionInput.value = option;
    optionInput.addEventListener("change", () => {
      // Store the selected answer
      question.question = option;

      console.log("🚀 select question:", question);
    });

    const card = document.createElement("div");
    console.log("🚀 ~ question.options.forEach ~ card:", card);
    const cardQuestion = document.createElement("h3");
    card.classList.add("card");
    card.classList.add("cardOption");

    cardQuestion.textContent = option;
    optionsDiv.appendChild(card);
    card.appendChild(cardQuestion);

    if (!selectedCard) {
      nextButton.disabled = true;
    }

    card.addEventListener("click", () => {
      // Remove the selected class from all cards
      nextButton.disabled = false;

      if (selectedCard) {
        selectedCard.classList.remove("selected");
      }
      card.classList.add("selected");
      // Store the selected answer
      answers.set(currentQuestionIndex, option);
      console.log("🚀 select question:", answers);
    });

    // const optionLabel = document.createElement("label");
    // optionLabel.textContent = option;
    // optionLabel.appendChild(optionInput);

    // questionDiv.appendChild(optionLabel);
  }

  // Function to find the card with the correct answer
  function findCardWithCorrectAnswer(answer: string): Element | null {
    const corr = Array.from(document.querySelectorAll(`.card h3`))
      .find((e) => e.textContent === answer)
      .closest(".card");
    console.log(" correct Card:", corr);
    return corr;
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
      const checkIfCorrect = checkAnswer(question, question.question);
      console.log("checkIfCorrect:", checkIfCorrect);
      if (!checkIfCorrect.correct) {
        const correctAnswer = checkIfCorrect.correctAnswer;
        const cards = document.querySelectorAll(".cardOption");

        const cardWithCorrectAnswer = findCardWithCorrectAnswer(correctAnswer);
        console.log("Card with correct answer:", cardWithCorrectAnswer);
        cardWithCorrectAnswer.classList.add("correct");

        const selectedCard = document.querySelector(".selected");
        selectedCard.classList.add("wrong");
        selectedCard.classList.remove("selected");
        nextButton.textContent = "Next Question";
      }
    }
  });

  if (currentQuestionIndex === questions.length - 1) {
    nextButton.addEventListener("click", () => {
      const score = calculateScore(questions, answers);

      displayScore(score, questions.length);
    });
  }

  console.log("answers:", answers);
  quizContainer.appendChild(questionDiv);
  quizContainer.appendChild(optionsDiv);
  optionsDiv.appendChild(nextButton);
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

  const scoreMessage = document.createElement("p");
  scoreMessage.textContent = `You scored ${score} out of ${totalQuestions}!`;
  quizContainer.innerHTML = "";
  quizContainer.appendChild(scoreMessage);
}
