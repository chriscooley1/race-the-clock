import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface NameWheelProps {
  names: string[];
  isSpinning: boolean;
  onSpin: () => number;
  onNameSelected: (name: string) => void;
  stopSpinning: () => void;
}

const NameWheel: React.FC<NameWheelProps> = ({
  names,
  isSpinning,
  onSpin,
  onNameSelected,
  stopSpinning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();
  const canvasSize = 500;
  const radius = canvasSize / 2 - 30;  // Radius calculation

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const segmentAngle = (2 * Math.PI) / names.length;

      names.forEach((name, index) => {
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;

        // Draw wheel segment
        ctx.beginPath();
        ctx.moveTo(canvasSize / 2, canvasSize / 2);
        ctx.arc(canvasSize / 2, canvasSize / 2, radius, startAngle, endAngle);
        ctx.closePath();

        // Set segment color
        ctx.fillStyle = `hsl(${(index * 360) / names.length}, 70%, 70%)`;
        ctx.fill();

        // Draw name text in the middle of each segment
        ctx.save();
        ctx.translate(canvasSize / 2, canvasSize / 2);  // Move to center
        const textAngle = (startAngle + endAngle) / 2;  // Middle of the segment
        ctx.rotate(textAngle);  // Rotate to the correct angle
        ctx.textAlign = "right";  // Align text properly
        ctx.fillStyle = "black";  // Set text color
        ctx.font = "16px Arial";  // Set font
        ctx.fillText(name, radius - 10, 0);  // Position the text
        ctx.restore();  // Restore the canvas context state
      });
    };

    drawWheel();
  }, [names, radius]);  // Add "radius" to the dependency array

  useEffect(() => {
    if (isSpinning) {
      const targetAngle = onSpin();
      const totalSlices = names.length;

      // Use Framer Motion to animate the rotation
      controls.start({
        rotate: [0, targetAngle * (180 / Math.PI)], // Convert radians to degrees
        transition: {
          duration: 5, // Animation duration in seconds
          ease: "easeInOut", // Easing function for smooth start and stop
        },
      });

      // Stop spinning after the animation ends
      setTimeout(() => {
        stopSpinning();

        const normalizedRotation = (targetAngle + Math.PI) % (2 * Math.PI);
        const sliceAngle = (2 * Math.PI) / totalSlices;

        const selectedIndex = Math.floor(normalizedRotation / sliceAngle) % totalSlices;

        onNameSelected(names[selectedIndex]);  // Set the selected name
      }, 5000);
    }
  }, [isSpinning, controls, onSpin, names, onNameSelected, stopSpinning]);

  return (
    <div style={{ position: "relative", width: canvasSize, height: canvasSize }}>
      <motion.div animate={controls} style={{ display: "inline-block" }}>
        <canvas ref={canvasRef} />
      </motion.div>
      {/* Add the fixed downward-pointing arrow */}
      <div className="arrow"></div>
    </div>
  );
};

export default NameWheel;
