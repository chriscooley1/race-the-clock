import { collectionColorSchemes } from "../constants/colorSchemes";

interface BubbleTextProps {
  children: React.ReactNode;
  className?: string;
}

const BubbleText: React.FC<BubbleTextProps> = ({ children, className = "" }) => {
  // Convert children to string to handle individual characters
  const text = children?.toString() || "";

  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          style={{
            color: "transparent",
            WebkitTextStroke: "2px black",
            fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
            fontWeight: "bold",
            background: collectionColorSchemes[index % collectionColorSchemes.length].backgroundColor,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export default BubbleText;
