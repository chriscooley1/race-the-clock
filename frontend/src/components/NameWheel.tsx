import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const segmentAngle = 360 / names.length;

      names.forEach((name, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;
        console.log(`${name} startAngle: ${startAngle} endAngle: ${endAngle}`);

        // Draw wheel segment
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, canvasSize / 2);
        ctx.arc(
          canvasSize / 2,
          canvasSize / 2,
          radius,
          (startAngle * Math.PI) / 180,
          (endAngle * Math.PI) / 180,
        );
        ctx.closePath();

        // Set segment color
        ctx.fillStyle = `hsl(${(index * 360) / names.length}, 70%, 70%)`;
        ctx.fill();

        // Draw name text
        ctx.save();
        ctx.translate(canvasSize / 2, canvasSize / 2);
        const textAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
        ctx.rotate(textAngle);
        ctx.textAlign = "right";
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(name, radius - 10, 0);
        ctx.restore();
      });
    };

    drawWheel();
  }, [names, radius]);

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
        const selectedIndex = Math.floor(adjustedDegrees / degreesPerSlice);

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
      <div className="relative">
        {names.length === 0 ? (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="text-gray-500">
              No names added yet. Please click the + button to add names.
            </p>
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
