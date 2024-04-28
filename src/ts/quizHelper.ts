import { Question } from "./questionService";

export function calculateScore(
  questions: Question[],
  answers: Map<number, string>
): number {
  let score = 0;
  questions.forEach((question, index) => {
    if (answers.has(index) && answers.get(index) === question.answer) {
      score++;
    }
  });
  return score;
}

// Function to check if the provided answer is correct
export function checkAnswer(
  question: Question,
  userAnswer: string
): { correct: boolean; correctAnswer?: string } {
  const correctAnswer = userAnswer === question.answer;
  if (!correctAnswer) {
    return { correct: false, correctAnswer: question.answer };
  }
  return { correct: true };
}

// Function to find the card with the correct answer
export function findCardWithCorrectAnswer(answer: string): Element | null {
  const corr = Array.from(document.querySelectorAll(`.card h3`))
    .find((e) => e.textContent === answer)
    .closest(".card");
  console.log(" correct Card:", corr);
  return corr;
}
