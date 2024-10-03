export const lightenColor = (color: string, amount: number): string => {
  const hex = color.replace("#", "");
  const rgb = parseInt(hex, 16);
  const r = Math.min(255, ((rgb >> 16) & 0xff) + 255 * amount);
  const g = Math.min(255, ((rgb >> 8) & 0xff) + 255 * amount);
  const b = Math.min(255, (rgb & 0xff) + 255 * amount);
  return `#${(((1 << 24) + (r << 16) + (g << 8) + b) | 0).toString(16).slice(1)}`;
};
