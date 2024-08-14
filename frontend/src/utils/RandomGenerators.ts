import { names } from "./NameList";

export const generateRandomNames = (quantity: number): string[] => {
  let result: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    result.push(randomName);
  }
  return result;
};

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
