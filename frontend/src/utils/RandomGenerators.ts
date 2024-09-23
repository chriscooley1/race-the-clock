import { periodicTable } from "./periodicTable";

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

export function generateNumberSenseImages(count: number): { url: string; svg: string; count: number }[] {
  return Array.from({ length: count }, () => {
    const randomCount = Math.floor(Math.random() * count) + 1;
    return {
      url: generateCountingSvg(randomCount),
      svg: generateCountingSvg(randomCount),
      count: randomCount
    };
  });
}

function generateCountingSvg(count: number): string {
  const shapes = ["circle", "square", "triangle"];
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      ${Array.from({ length: count }, (_, i) => {
        const x = 30 + (i % 3) * 70;
        const y = 30 + Math.floor(i / 3) * 70;
        switch (randomShape) {
          case "circle":
            return `<circle cx="${x}" cy="${y}" r="20" fill="blue" />`;
          case "square":
            return `<rect x="${x - 20}" y="${y - 20}" width="40" height="40" fill="green" />`;
          case "triangle":
            return `<polygon points="${x},${y - 20} ${x - 20},${y + 20} ${x + 20},${y + 20}" fill="red" />`;
        }
      }).join("")}
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

export const generatePeriodicTableElements = (count: number): string[] => {
  const elements = Object.values(periodicTable);
  const shuffled = elements.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(element => 
    JSON.stringify({ symbol: element.symbol, name: element.name, atomicNumber: element.atomicNumber })
  );
};
