import { periodicTable } from "./periodicTable";

export const generateRandomLetters = (quantity: number): string[] => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const result: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const randomLetter = letters.charAt(
      Math.floor(Math.random() * letters.length),
    );
    result.push(randomLetter);
  }
  return result;
};

export const generateRandomNumbers = (quantity: number): string[] => {
  const result: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const randomNumber = Math.floor(Math.random() * 100) + 1; // Random numbers from 1 to 100
    result.push(randomNumber.toString());
  }
  return result;
};

export const generateFullAlphabet = (): string[] => {
  const uppercase = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i),
  ); // A-Z
  const lowercase = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i),
  ); // a-z
  return [...uppercase, ...lowercase];
};

export const generateNumbersOneToHundred = (): string[] => {
  return Array.from({ length: 100 }, (_, i) => (i + 1).toString());
};

const operationSymbol = {
  multiplication: "×",
  addition: "+",
  subtraction: "−",
  division: "÷",
} as const;

export const generateMathProblems = (
  count: number,
  operation: keyof typeof operationSymbol,
): string[] => {
  const problems: string[] = [];
  for (let i = 0; i < count; i++) {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    let answer: number;
    switch (operation) {
      case "addition":
        answer = num1 + num2;
        break;
      case "subtraction":
        answer = num1 - num2;
        break;
      case "multiplication":
        answer = num1 * num2;
        break;
      case "division":
        answer = Math.round((num1 / num2) * 100) / 100; // Round to 2 decimal places
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
    problems.push(`${num1} ${operationSymbol[operation]} ${num2}|${answer}`);
  }
  return problems;
};

export function generateNumberSenseImages(
  count: number,
  color: string = "blue",
  shape: string = "circle",
): { url: string; svg: string; count: number } {
  const svg = generateCountingSvg(count, color, shape);
  return {
    url: svg,
    svg: svg,
    count: count,
  };
}

export function generateCountingSvg(
  count: number,
  color: string = "blue",
  shape: string = "circle",
  position: string = "random",
): string {
  const gridSize = 5; // 5x5 grid
  const cellSize = 40;
  const svgSize = gridSize * cellSize;

  let positions: { x: number; y: number }[];
  if (position === "random") {
    positions = getRandomPositions(count, gridSize);
  } else {
    positions = getPositionsByPreference(count, gridSize, position);
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">
      ${positions
        .map((pos) => {
          const x = pos.x * cellSize + cellSize / 2;
          const y = pos.y * cellSize + cellSize / 2;
          let shapeElement = "";
          switch (shape) {
            case "circle":
              shapeElement = `<circle cx="${x}" cy="${y}" r="${cellSize / 3}" fill="${color}" />`;
              break;
            case "square":
              shapeElement = `<rect x="${x - cellSize / 3}" y="${y - cellSize / 3}" width="${(cellSize * 2) / 3}" height="${(cellSize * 2) / 3}" fill="${color}" />`;
              break;
            case "triangle": {
              const size = (cellSize * 2) / 3;
              shapeElement = `<polygon points="${x},${y - size / 2} ${x - size / 2},${y + size / 2} ${x + size / 2},${y + size / 2}" fill="${color}" />`;
              break;
            }
          }
          return shapeElement;
        })
        .join("")}
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

function getRandomPositions(
  count: number,
  gridSize: number,
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const allPositions = Array.from({ length: gridSize * gridSize }, (_, i) => ({
    x: i % gridSize,
    y: Math.floor(i / gridSize),
  }));

  for (let i = 0; i < count; i++) {
    if (allPositions.length === 0) break;
    const index = Math.floor(Math.random() * allPositions.length);
    positions.push(allPositions[index]);
    allPositions.splice(index, 1);
  }

  return positions;
}

function getPositionsByPreference(
  count: number,
  gridSize: number,
  preference: string,
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  let startX: number, startY: number;

  switch (preference) {
    case "1": // Top Left
      startX = 0;
      startY = 0;
      break;
    case "2": // Top Right
      startX = gridSize - 1;
      startY = 0;
      break;
    case "3": // Center
      startX = Math.floor(gridSize / 2);
      startY = Math.floor(gridSize / 2);
      break;
    case "4": // Bottom Left
      startX = 0;
      startY = gridSize - 1;
      break;
    case "5": // Bottom Right
      startX = gridSize - 1;
      startY = gridSize - 1;
      break;
    default:
      return getRandomPositions(count, gridSize);
  }

  for (let i = 0; i < count; i++) {
    positions.push({ x: startX, y: startY });
    if (startX < gridSize - 1) {
      startX++;
    } else {
      startX = 0;
      startY = (startY + 1) % gridSize;
    }
  }

  return positions;
}

export const generatePeriodicTableElements = (count: number): string[] => {
  const elements = Object.values(periodicTable);
  const shuffled = elements.sort(() => 0.5 - Math.random());
  return shuffled
    .slice(0, count)
    .map(
      (element) =>
        `${element.symbol} - ${element.name} - ${element.atomicNumber}`,
    );
};

export const generateScienceTerms = (count: number): string[] => {
  const scienceTerms = [
    "Atom",
    "Molecule",
    "Cell",
    "DNA",
    "Evolution",
    "Gravity",
    "Photosynthesis",
    "Ecosystem",
    "Energy",
    "Force",
    "Hypothesis",
    "Experiment",
    "Theory",
    "Velocity",
    "Acceleration",
    "Mass",
    "Volume",
    "Density",
    "Pressure",
    "Temperature",
  ];
  return shuffleArray(scienceTerms).slice(0, count);
};

export const generateNursingTerms = (count: number): string[] => {
  const nursingTerms = [
    "Vital Signs",
    "Blood Pressure",
    "Heart Rate",
    "Respiratory Rate",
    "Temperature",
    "Oxygen Saturation",
    "Medication Administration",
    "Intravenous Therapy",
    "Patient Assessment",
    "Wound Care",
    "Infection Control",
    "Pain Management",
    "Patient Education",
    "Documentation",
    "Cardiopulmonary Resuscitation (CPR)",
    "Electrocardiogram (ECG)",
    "Catheterization",
    "Diabetes Management",
    "Fall Prevention",
    "Palliative Care",
  ];

  const shuffled = nursingTerms.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const generateFullPeriodicTable = (): string[] => {
  return Object.values(periodicTable).map(
    (element) =>
      `${element.symbol} - ${element.name} - ${element.atomicNumber}`,
  );
};
