import { useEffect } from "react";

const FontPreloader = () => {
  useEffect(() => {
    const preloadFonts = async () => {
      const fonts = [
        new FontFace(
          "KG What The Teacher Wants",
          "url(/fonts/KGWhatTheTeacherWants.ttf)"
        ),
        new FontFace(
          "KG Shake It Off",
          "url(/fonts/KGShakeItOff.ttf)"
        ),
      ];

      try {
        await Promise.all(fonts.map(font => font.load()));
        fonts.forEach(font => document.fonts.add(font));
      } catch (err) {
        console.error("Error loading fonts:", err);
      }
    };

    preloadFonts();
  }, []);

  return null;
};

export default FontPreloader;
