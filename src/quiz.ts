// Define the Question type
export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

// Export the fetchQuestions function
export async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    if (!response.ok) {
      throw new Error(`Something went wrong!! Unable to fetch the data`);
    }
    const data = await response.json();
    console.log("🚀 ~ fetchQuestions ~ data:", data);
    return data.results;
  } catch (error: any) {
    throw new Error(
      `Something went wrong!! Unable to fetch the data: ${error.message}`
    );
  }
}

// Export the checkAnswer function
export function checkAnswer(selectedAns: string, correctAns: string): boolean {
  return selectedAns === correctAns;
}
