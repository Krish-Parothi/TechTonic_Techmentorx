/**
 * Random integer between min and max (inclusive)
 */
export const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Random float between min and max
 */
export const randomFloat = (min, max) =>
  Math.random() * (max - min) + min;

/**
 * Random array element
 */
export const randomElement = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * Random boolean with probability
 */
export const randomBoolean = (probability = 0.5) =>
  Math.random() < probability;

/**
 * Shuffle array (Fisher-Yates)
 */
export const shuffle = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
