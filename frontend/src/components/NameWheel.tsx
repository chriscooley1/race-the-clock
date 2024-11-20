import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

interface NameWheelProps {
  names: string[];
  isSpinning: boolean;
  spinData: { targetDegrees: number; spinRevolutions: number } | null;
  onNameSelected: (name: string) => void;
  stopSpinning: () => void;
}

const NameWheel: React.FC<NameWheelProps> = ({
  names,
  isSpinning,
  spinData,
  onNameSelected,
  stopSpinning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();
  const canvasSize = 500;
  const radius = canvasSize / 2 - 30;
  const [lastLandedDegrees, setLastLandedDegrees] = useState<number>(0); // Store last landed position
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add a white background circle first
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = theme.backgroundColor; // Use theme background color
      ctx.fill();

      const segmentAngle = 360 / names.length;

      names.forEach((name, index) => {
        const startAngle = (index * segmentAngle * Math.PI) / 180;
        const endAngle = ((index + 1) * segmentAngle * Math.PI) / 180;

        // Draw wheel segment
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, canvasSize / 2);
        ctx.arc(canvasSize / 2, canvasSize / 2, radius, startAngle, endAngle);
        ctx.closePath();

        // Set segment color with theme-aware contrast
        const hue = (index * 360) / names.length;
        ctx.fillStyle = `hsl(${hue}, 70%, ${theme.isDarkMode ? '60%' : '70%'})`;
        ctx.fill();

        // Draw segment border
        ctx.strokeStyle = theme.isDarkMode ? '#444444' : '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw name text
        ctx.save();
        ctx.translate(canvasSize / 2, canvasSize / 2);
        const textAngle = startAngle + (segmentAngle * Math.PI) / 360;
        ctx.rotate(textAngle);
        ctx.textAlign = "right";
        ctx.fillStyle = theme.isDarkMode ? '#FFFFFF' : '#000000'; // Use theme text color
        ctx.font = "16px Arial";
        ctx.fillText(name, radius - 10, 0);
        ctx.restore();
      });
    };

    drawWheel();
  }, [names, radius, theme.isDarkMode, theme.backgroundColor]); // Add theme dependencies

  useEffect(() => {
    if (isSpinning && spinData) {
      const { targetDegrees, spinRevolutions } = spinData;
      const totalRotation = spinRevolutions * 360 + targetDegrees;

      controls.start({
        rotate: [lastLandedDegrees, totalRotation], // Start from last landed position
        transition: {
          duration: 5,
          ease: "easeInOut",
        },
      });

      setTimeout(() => {
        const degreesPerSlice = 360 / names.length;
        // Adjust for the starting position (top of the wheel is 270 degrees)
        const adjustedDegrees = (totalRotation + 270) % 360; // Use totalRotation here
        // Calculate the selected index based on the adjusted degrees
        const selectedIndex =
          Math.round(adjustedDegrees / degreesPerSlice) % names.length; // Change from Math.floor to Math.round

        // Update last landed degrees for the next spin
        setLastLandedDegrees(totalRotation % 360);

        onNameSelected(names[selectedIndex]);
        stopSpinning();
      }, 5000);
    }
  }, [
    isSpinning,
    spinData,
    controls,
    names,
    onNameSelected,
    stopSpinning,
    lastLandedDegrees,
  ]);

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 z-10 size-0 -translate-x-1/2 border-x-[20px] border-t-[40px] border-x-transparent border-t-red-500"></div>
      <div className="relative" style={{ backgroundColor: 'transparent' }}>
        {names.length === 0 ? (
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ color: theme.displayTextColor || theme.textColor }}
          >
            <p>No names added yet. Please click the + button to add names.</p>
          </div>
        ) : (
          <motion.div animate={controls} className="inline-block">
            <canvas ref={canvasRef} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NameWheel;
