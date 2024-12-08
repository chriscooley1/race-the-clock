interface BubbleTextProps {
  children: React.ReactNode;
  gradient?: string;
  className?: string;
}

const BubbleText: React.FC<BubbleTextProps> = ({ 
  children, 
  gradient = "linear-gradient(45deg, #FF6B6B, #4ECDC4, #FFD93D, #FF6B6B)",
  className = ""
}) => {
  return (
    <span
      className={className}
      style={{
        background: gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextStroke: "2px black",
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
        fontWeight: "bold",
      }}
    >
      {children}
    </span>
  );
};

export default BubbleText;
