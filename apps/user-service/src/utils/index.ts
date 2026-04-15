export const generatePassword = (): string =>
  Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
