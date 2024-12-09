import { collectionColorSchemes } from "../constants/colorSchemes";

interface BubbleTextProps {
  children: React.ReactNode;
  className?: string;
}

const BubbleText: React.FC<BubbleTextProps> = ({ children, className = "" }) => {
  // Convert children to string to handle individual characters
  const text = children?.toString() || "";
  
  // Keep track of non-space characters for color indexing
  let colorIndex = 0;

  return (
    <span className={className}>
      {text.split("").map((char, index) => {
        // Only increment color index for non-space characters
        const currentColorIndex = char === " " ? colorIndex : colorIndex++;
        
        return (
          <span
            key={index}
            style={{
              color: "transparent",
              WebkitTextStroke: "2px black",
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
              fontWeight: "bold",
              background: char === " " ? "transparent" : collectionColorSchemes[currentColorIndex % collectionColorSchemes.length].backgroundColor,
              WebkitBackgroundClip: char === " " ? "unset" : "text",
              backgroundClip: char === " " ? "unset" : "text",
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default BubbleText;
