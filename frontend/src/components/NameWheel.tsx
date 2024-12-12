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
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (names.length === 0) {
        // Draw a single segment for empty wheel
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, canvasSize / 2);
        ctx.arc(canvasSize / 2, canvasSize / 2, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "#b0f2ff";
        ctx.fill();
        ctx.stroke();

        // Add "Add names" text
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = theme.isDarkMode ? "#FFFFFF" : "#000000";
        ctx.font = "20px Arial";
        ctx.fillText("Click + to add names", canvasSize / 2, canvasSize / 2);
        ctx.restore();
        return;
      }

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
          duration: 8,
          ease: [0.32, 0, 0.24, 1],
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
        const selectedName = names[selectedIndex];

        console.log("Arrow Position (degrees):", normalizedDegrees);
        console.log("Selected Index:", selectedIndex);
        console.log("Selected Name:", selectedName);

        setLastLandedDegrees(totalRotation % 360);
        onNameSelected(selectedName);
        stopSpinning();
      }, 8000);
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
    <div className="relative inline-block">
      <div className="absolute left-1/2 top-0 z-10 size-0 -translate-x-1/2 border-x-[20px] border-t-[40px] border-x-transparent border-t-black"></div>
      <motion.div animate={controls} className="inline-block">
        <canvas ref={canvasRef} />
      </motion.div>
    </div>
  );
};

export default NameWheel;
