export const toDots = (value: number, max: number = 5): boolean[] => {
  const round = Math.round(value);
  return new Array(max).fill(false).map((_, index) => index < round);
};
