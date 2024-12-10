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
        {
          family: "Happy Writing Dots Regular",
          url: "/fonts/HappyWritingDots-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "Happy Writing Neat Regular",
          url: "/fonts/HappyWritingNeat-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "Happy Writing Outline Dashes Regular",
          url: "/fonts/HappyWritingOutlineDashes-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "Happy Writing Outline Dots Regular",
          url: "/fonts/HappyWritingOutlineDots-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "Happy Writing Outlines Regular",
          url: "/fonts/HappyWritingOutlines-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "Happy Writing Outlines Thick Regular",
          url: "/fonts/HappyWritingOutlinesThick-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "Happy Writing Tracing Regular",
          url: "/fonts/HappyWritingTracing-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "Happy Writing Tracing Guides Regular",
          url: "/fonts/HappyWritingTracingGuides-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
      ];

      try {
        const loadedFonts = Array.from(document.fonts.values()).map((font) =>
          font.family.replace(/["']/g, "")
        );

        const fontsToLoad = fonts.filter(
          (font) => !loadedFonts.includes(font.family)
        );

        if (fontsToLoad.length === 0) {
          console.log("All custom fonts already loaded");
          return;
        }

        const fontLoadPromises = fontsToLoad.map(async (font) => {
          try {
            const response = await fetch(font.url);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fontFace = new FontFace(
              font.family,
              `local("${font.family}"),
               url(${font.url.replace('.otf', '.woff2')}) format("woff2"),
               url(${font.url.replace('.otf', '.woff')}) format("woff"),
               url(${font.url}) format("opentype"),
               url(${font.url.replace('.otf', '.ttf')}) format("truetype")`
            );
            const loadedFont = await fontFace.load();
            document.fonts.add(loadedFont);
            console.log(`Successfully loaded font: ${font.family}`);
            return loadedFont;
          } catch (error) {
            console.warn(`Failed to load font ${font.family}:`, error);
            return null;
          }
        });

        const loadedFontFaces = await Promise.allSettled(fontLoadPromises);
        const successfulFonts = loadedFontFaces
          .filter((result) => result.status === "fulfilled" && result.value)
          .map((result) => (result as PromiseFulfilledResult<FontFace>).value.family);

        if (successfulFonts.length > 0) {
          console.log("Successfully loaded fonts:", successfulFonts.join(", "));
        }
      } catch (err) {
        console.error("Error in font loading process:", err);
      }
    };

    preloadFonts();
  }, []);

  return null;
};

export default FontPreloader;
