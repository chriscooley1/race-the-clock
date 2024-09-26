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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      names.forEach((name, index) => {
        const startAngle = (index / names.length) * 2 * Math.PI;
        const endAngle = ((index + 1) / names.length) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = `hsl(${(index * 360) / names.length}, 70%, 70%)`;
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((startAngle + endAngle) / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(name, radius - 10, 0);
        ctx.restore();
      });
    };

    drawWheel();
  }, [names]);

  useEffect(() => {
    if (isSpinning) {
      const targetAngle = onSpin();
      const totalSlices = names.length;

      // Log the initial target angle
      console.log("Target Angle (radians):", targetAngle);
      console.log("Target Angle (degrees):", targetAngle * (180 / Math.PI));

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

        // Normalize rotation to [0, 2π]
        const normalizedRotation = (targetAngle + Math.PI) % (2 * Math.PI);

        // Calculate the slice angle (size of each name slice)
        const sliceAngle = (2 * Math.PI) / totalSlices;

        // Log the calculated slice angle and adjusted rotation
        console.log("Slice Angle (radians):", sliceAngle);
        console.log("Normalized Rotation (radians):", normalizedRotation);

        // Calculate the final index of the selected name
        const selectedIndex = Math.floor(normalizedRotation / sliceAngle) % totalSlices;

        // Log the final selected index and the selected name
        console.log("Selected Index:", selectedIndex);
        console.log("Selected Name:", names[selectedIndex]);

        onNameSelected(names[selectedIndex]); // Set the selected name
      }, 5000);
    }
  }, [isSpinning, controls, onSpin, names, onNameSelected, stopSpinning]);

  return (
    <div style={{ position: "relative", width: canvasSize, height: canvasSize }}>
      <motion.div
        animate={controls} // Attach the motion controls to this div
        style={{ display: "inline-block" }} // Center the canvas
      >
        <canvas ref={canvasRef} />
      </motion.div>
      {/* Add the fixed downward-pointing arrow */}
      <div className="arrow"></div>
    </div>
  );
};

export default NameWheel;
