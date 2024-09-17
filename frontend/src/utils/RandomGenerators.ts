export const generateRandomLetters = (quantity: number): string[] => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    result.push(randomLetter);
  }
  return result;
};

export const generateRandomNumbers = (quantity: number): string[] => {
  let result: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const randomNumber = Math.floor(Math.random() * 100) + 1; // Random numbers from 1 to 100
    result.push(randomNumber.toString());
  }
  return result;
};

export const generateFullAlphabet = (): string[] => {
  const uppercase = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z
  const lowercase = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)); // a-z
  return [...uppercase, ...lowercase];
};

export const generateNumbersOneToHundred = (): string[] => {
  return Array.from({ length: 100 }, (_, i) => (i + 1).toString());
};

const operationSymbol = {
  multiplication: "×",
  addition: "+",
  subtraction: "−",
  division: "÷"
} as const;

export const generateMathProblems = (count: number, operation: keyof typeof operationSymbol): string[] => {
  const problems: string[] = [];
  for (let i = 0; i < count; i++) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    problems.push(`${num1} ${operationSymbol[operation]} ${num2}`);
  }

  return problems;
};

export const generateRandomPictures = (count: number): string[] => {
  const pictures: string[] = [];
  for (let i = 0; i < count; i++) {
    // Replace this with an actual API call to get random images
    pictures.push(`https://picsum.photos/200/200?random=${i}`);
  }
  return pictures;
};
