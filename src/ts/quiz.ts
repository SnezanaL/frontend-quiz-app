export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`Unable to fetch questions: ${response.statusText}`);
    }
    const data = await response.json();
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
    if (answers.has(index) && answers.get(index) === question.correctAnswer) {
      score++;
    }
  });
  return score;
}
