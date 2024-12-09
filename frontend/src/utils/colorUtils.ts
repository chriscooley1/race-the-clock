export const lightenColor = (color: string, amount: number): string => {
  if (!color || !color.startsWith("#")) return "#FFFFFF";
  try {
    // Ensure we have a valid 6-digit hex color
    const hex = color.replace("#", "").padEnd(6, "0");
    
    // Parse the RGB components
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    
    // Lighten each component
    const lightenComponent = (c: number) => 
      Math.min(255, Math.round(c + (255 - c) * amount));
    
    const lightR = lightenComponent(r);
    const lightG = lightenComponent(g);
    const lightB = lightenComponent(b);
    
    // Convert back to hex
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    
    return `#${toHex(lightR)}${toHex(lightG)}${toHex(lightB)}`;
  } catch (error) {
    console.error("Error lightening color:", error, "for color:", color);
    return "#FFFFFF";
  }
};

export const darkenColor = (color: string, amount: number): string => {
  const hex = color.replace("#", "");
  const rgb = parseInt(hex, 16);
  const r = Math.max(0, ((rgb >> 16) & 0xff) - Math.round(255 * amount));
  const g = Math.max(0, ((rgb >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (rgb & 0xff) - Math.round(255 * amount));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const getLuminance = (color: string): number => {
  const rgb = hexToRgb(color);
  const [r, g, b] = rgb.map((c) => {
    const normalized = c / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
};

export const getContrastYIQ = (hexcolor: string) => {
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};
