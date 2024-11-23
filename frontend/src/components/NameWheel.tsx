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

      // Add background circle
      ctx.beginPath();
      ctx.arc(canvasSize / 2, canvasSize / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = theme.backgroundColor;
      ctx.fill();

      const segmentAngle = 360 / names.length;

      // Start drawing from -90 degrees (top) instead of 0 degrees (right)
      const startOffset = -90 * (Math.PI / 180);

      console.log("--- Wheel Drawing Debug ---");
      console.log("Starting Offset (degrees):", -90);
      console.log("Segment Angle:", segmentAngle);

      names.forEach((name, index) => {
        const startAngle = startOffset + (index * segmentAngle * Math.PI) / 180;
        const endAngle =
          startOffset + ((index + 1) * segmentAngle * Math.PI) / 180;

        // Convert angles to degrees for logging
        const startDegrees = (startAngle * 180) / Math.PI;
        const endDegrees = (endAngle * 180) / Math.PI;

        console.log(`Segment ${index} (${name}):`, {
          start: startDegrees,
          end: endDegrees,
          middle: (startDegrees + endDegrees) / 2,
        });

        // Rest of the drawing code...
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, canvasSize / 2);
        ctx.arc(canvasSize / 2, canvasSize / 2, radius, startAngle, endAngle);
        ctx.closePath();

        const hue = (index * 360) / names.length;
        ctx.fillStyle = `hsl(${hue}, 70%, ${theme.isDarkMode ? "60%" : "70%"})`;
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(canvasSize / 2, canvasSize / 2);
        const textAngle = startAngle + (segmentAngle * Math.PI) / 360;
        ctx.rotate(textAngle);
        ctx.textAlign = "right";
        ctx.fillStyle = theme.isDarkMode ? "#FFFFFF" : "#000000";
        ctx.font = "16px Arial";
        ctx.fillText(name, radius - 10, 0);
        ctx.restore();
      });
    };

    drawWheel();
  }, [names, radius, theme.isDarkMode, theme.backgroundColor]);

  useEffect(() => {
    if (isSpinning && spinData) {
      const { targetDegrees, spinRevolutions } = spinData;
      const totalRotation = spinRevolutions * 360 + targetDegrees;

      controls.start({
        rotate: [lastLandedDegrees, totalRotation],
        transition: {
          duration: 5,
          ease: "easeInOut",
        },
      });

      setTimeout(() => {
        const degreesPerSlice = 360 / names.length;
        const adjustedDegrees = totalRotation % 360;
        const normalizedDegrees = (360 - (adjustedDegrees % 360)) % 360;

        console.log("--- Spin Completion Debug ---");
        console.log("Total Rotation:", totalRotation);
        console.log("Adjusted Degrees:", adjustedDegrees);
        console.log("Normalized Degrees:", normalizedDegrees);
        console.log("Degrees Per Slice:", degreesPerSlice);

        // Log where each segment starts and ends after spin
        names.forEach((name, index) => {
          const segmentStart = index * degreesPerSlice;
          const segmentEnd = (index + 1) * degreesPerSlice;
          console.log(`Segment ${index} (${name}):`, {
            start: segmentStart,
            end: segmentEnd,
            middle: (segmentStart + segmentEnd) / 2,
          });
        });

        // New selection calculation
        const selectedIndex = Math.floor(normalizedDegrees / degreesPerSlice);

        console.log("Arrow Position (degrees):", normalizedDegrees);
        console.log("Selected Index:", selectedIndex);
        console.log("Selected Name:", names[selectedIndex]);

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
      <div className="relative" style={{ backgroundColor: "transparent" }}>
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
