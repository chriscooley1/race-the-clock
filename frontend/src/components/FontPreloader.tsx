import { useEffect } from "react";

const FontPreloader = () => {
  useEffect(() => {
    const preloadFonts = async () => {
      const fonts = [
        {
          family: "KG What The Teacher Wants",
          url: "/fonts/KGWhatTheTeacherWants.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "KG Shake It Off",
          url: "/fonts/KGShakeItOff.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
      ];

      try {
        // Check if fonts are already loaded
        const loadedFonts = Array.from(document.fonts.values()).map((font) =>
          font.family.replace(/["']/g, ""),
        );

        const fontsToLoad = fonts.filter(
          (font) => !loadedFonts.includes(font.family),
        );

        if (fontsToLoad.length === 0) {
          console.log("All custom fonts already loaded");
          return;
        }

        // Load new fonts
        const fontFaces = await Promise.all(
          fontsToLoad.map(async (font) => {
            const fontFace = new FontFace(
              font.family,
              `url(${font.url})`,
              font.descriptors,
            );
            await fontFace.load();
            document.fonts.add(fontFace);
            return fontFace;
          }),
        );

        console.log(
          "Successfully loaded fonts:",
          fontFaces.map((f) => f.family).join(", "),
        );
      } catch (err) {
        console.error("Error loading fonts:", err);
        // Continue without custom fonts - fallback fonts will be used
      }
    };

    preloadFonts();
  }, []);

  return null;
};

export default FontPreloader;