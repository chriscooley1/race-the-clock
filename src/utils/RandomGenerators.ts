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
