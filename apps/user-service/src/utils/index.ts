export const generatePassword = (): string => {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '@$!%*?&';
  const all = lower + upper + digits + symbols;

  const rand = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

  const required = [rand(lower), rand(upper), rand(digits), rand(symbols)];
  const rest = Array.from({ length: 5 }, () => rand(all));

  return [...required, ...rest]
    .sort(() => Math.random() - 0.5)
    .join('');
};
