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
  console.log("Adjusting color:", color, "for type:", type); // Debugging line
  if (!type || type.toLowerCase() === "none") {
    return color;
  }

  const rgb = hexToRgb(color);
  let adjusted: RGB;

  switch (type.toLowerCase()) {
    case "protanopia":
      adjusted = [
        0.567 * rgb[0] + 0.433 * rgb[1],
        0.558 * rgb[0] + 0.442 * rgb[1],
        0.242 * rgb[0] + 0.758 * rgb[2],
      ];
      break;
    case "protanomaly":
      adjusted = [
        0.817 * rgb[0] + 0.183 * rgb[1],
        0.333 * rgb[0] + 0.667 * rgb[1],
        0.125 * rgb[0] + 0.875 * rgb[2],
      ];
      break;
    case "deuteranopia":
      adjusted = [
        0.625 * rgb[0] + 0.375 * rgb[1],
        0.7 * rgb[0] + 0.3 * rgb[1],
        0.3 * rgb[0] + 0.7 * rgb[2],
      ];
      break;
    case "deuteranomaly":
      adjusted = [
        0.8 * rgb[0] + 0.2 * rgb[1],
        0.258 * rgb[0] + 0.742 * rgb[1],
        0.142 * rgb[0] + 0.858 * rgb[2],
      ];
      break;
    case "tritanopia":
      adjusted = [
        0.95 * rgb[0] + 0.05 * rgb[2],
        0.433 * rgb[0] + 0.567 * rgb[1],
        0.475 * rgb[0] + 0.525 * rgb[2],
      ];
      break;
    case "tritanomaly":
      adjusted = [
        0.967 * rgb[0] + 0.033 * rgb[2],
        0.733 * rgb[0] + 0.267 * rgb[1],
        0.183 * rgb[0] + 0.817 * rgb[2],
      ];
      break;
    case "achromatopsia": {
      const grayscale = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
      adjusted = [grayscale, grayscale, grayscale];
      break;
    }
    case "anomalous trichromacy": {
      adjusted = [
        0.8 * rgb[0] + 0.2 * rgb[1],
        0.2 * rgb[0] + 0.8 * rgb[1],
        0.2 * rgb[0] + 0.2 * rgb[1] + 0.6 * rgb[2],
      ];
      break;
    }
    default:
      return color;
  }

  console.log("Original RGB:", rgb);
  console.log("Adjusted RGB:", adjusted);

  const result = rgbToHex(
    Math.round(adjusted[0]),
    Math.round(adjusted[1]),
    Math.round(adjusted[2]),
  );
  console.log("Adjusted color:", result);
  return result;
}
