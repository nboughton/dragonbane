export const roll = (size: number): number => Math.floor(Math.random() * size) + 1;

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T;
