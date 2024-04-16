import Data from "../../assets/data.json";
import { renderQuestion } from "./quiz";

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export let questions: Question[] = []; // Array to store all questions

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

// Render current question on the page
export async function renderCurrentQuestion(id: string) {
  const quizContainer = document.getElementById("quiz-container");
  if (quizContainer) {
    quizContainer.innerHTML = "";
  }

  try {
    questions = await fetchQuestions(id);
    if (quizContainer) {
      renderQuestion(id, questions, quizContainer);
    }
  } catch (error) {
    console.error("Error loading questions:", error);
    if (quizContainer) {
      quizContainer.textContent = "Error loading questions. Please try again.";
    }
  }
}
