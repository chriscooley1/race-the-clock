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
          family: "HappyWritingBoxes-NoLetters",
          url: "/fonts/HappyWritingBoxes-NoLetters.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingBoxes-Regular",
          url: "/fonts/HappyWritingBoxes-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingDots-Regular",
          url: "/fonts/HappyWritingDots-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingHandwriting-Regular",
          url: "/fonts/HappyWritingHandwriting-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingLetterFormation-Regular",
          url: "/fonts/HappyWritingLetterFormation-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingLetterMiniCircles-Regular",
          url: "/fonts/HappyWritingLetterMiniCircles-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingNeat-Regular",
          url: "/fonts/HappyWritingNeat-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingNeatGuides-Regular",
          url: "/fonts/HappyWritingNeatGuides-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingOutlineDashes-Regular",
          url: "/fonts/HappyWritingOutlineDashes-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingOutlineDots-Regular",
          url: "/fonts/HappyWritingOutlineDots-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingOutlines-Regular",
          url: "/fonts/HappyWritingOutlines-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingOutlinesDotsInside-Regular",
          url: "/fonts/HappyWritingOutlinesDotsInside-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingOutlinesThick-Regular",
          url: "/fonts/HappyWritingOutlinesThick-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingOutlinesTracing-Regular",
          url: "/fonts/HappyWritingOutlinesTracing-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingTracing-Regular",
          url: "/fonts/HappyWritingTracing-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingTracingGuides-Regular",
          url: "/fonts/HappyWritingTracingGuides-Regular.ttf",
          descriptors: { style: "normal", weight: "400" },
        },
        {
          family: "HappyWritingHandwriting-LinesOnly",
          url: "/fonts/HappyWritingHandwriting-LinesOnly.ttf",
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
