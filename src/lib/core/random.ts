type RandomMode = "Math" | "Crypto";

const RANDOM_MODE: RandomMode = "Math";

export function random() {
  if (RANDOM_MODE === "Crypto") {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0]! / (0xffffffff + 1);
  } else {
    return Math.random();
  }
}
