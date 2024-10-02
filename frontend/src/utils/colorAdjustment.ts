type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function adjustColorForColorblindness(
  color: string,
  type: string,
): string {
  const rgb = hexToRgb(color);
  let adjusted: RGB;

  switch (type) {
    case "Protanopia":
      adjusted = [
        0.567 * rgb[0] + 0.433 * rgb[1],
        0.558 * rgb[0] + 0.442 * rgb[1],
        0.242 * rgb[0] + 0.758 * rgb[2],
      ];
      break;
    case "Deuteranopia":
      adjusted = [
        0.625 * rgb[0] + 0.375 * rgb[1],
        0.7 * rgb[0] + 0.3 * rgb[1],
        0.3 * rgb[0] + 0.7 * rgb[2],
      ];
      break;
    case "Tritanopia":
      adjusted = [
        0.95 * rgb[0] + 0.05 * rgb[2],
        0.433 * rgb[0] + 0.567 * rgb[1],
        0.475 * rgb[0] + 0.525 * rgb[2],
      ];
      break;
    case "Achromatopsia": {
      const grayscale = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      adjusted = [grayscale, grayscale, grayscale];
      break;
    }
    default:
      return color;
  }

  return rgbToHex(
    Math.round(adjusted[0]),
    Math.round(adjusted[1]),
    Math.round(adjusted[2]),
  );
}
