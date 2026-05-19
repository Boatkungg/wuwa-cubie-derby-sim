import { random as defaultRandom } from "./random";


export function modulo(a: number, b: number): number {
  return ((a % b) + b) % b;  
}

/**
 * Shuffles the elements of an array in random order using the Fisher-Yates algorithm.
 * @param array The input array to be shuffled.
 * @returns A new array with the elements of the input array shuffled in random order.
 */
export function shuffleArray<T>(array: T[], randomFn: () => number = defaultRandom): T[] {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j]!, shuffledArray[i]!];
  }
  return shuffledArray;
}

export function formatMapName(fnname: string): string {
  const spaced = fnname.replace(/([A-Z0-9]+)/g, " $1").trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
