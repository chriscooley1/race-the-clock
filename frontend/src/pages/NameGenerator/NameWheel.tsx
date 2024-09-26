import React, { useRef, useEffect, useState } from "react";

interface NameWheelProps {
  names: string[];
  isSpinning: boolean;
  onSpin: () => number;
  onNameSelected: (name: string) => void;
}

const NameWheel: React.FC<NameWheelProps> = ({ names, isSpinning, onSpin, onNameSelected }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  const canvasSize = 500; // Increase this value to make the wheel larger

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

      // Draw wheel segments
      names.forEach((name, index) => {
        const startAngle = (index / names.length) * 2 * Math.PI - rotation;
        const endAngle = ((index + 1) / names.length) * 2 * Math.PI - rotation;

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

      // Draw stationary arrow
      ctx.save();
      ctx.translate(centerX, centerY - radius - 10);
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.closePath();
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };

    drawWheel();
  }, [names, rotation]);

  useEffect(() => {
    if (isSpinning) {
      const targetAngle = onSpin();
      const startTime = performance.now();
      const duration = 5000; // 5 seconds
  
      const animateWheel = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
  
        setRotation((prevRotation) => {
          const newRotation = (prevRotation + targetAngle * easeProgress) % (2 * Math.PI);
          return newRotation;
        });
  
        if (progress < 1) {
          requestAnimationFrame(animateWheel);
        } else {
          // Spinning has finished, determine the selected name
          const selectedIndex = Math.floor(((rotation % (2 * Math.PI)) / (2 * Math.PI)) * names.length);
          onNameSelected(names[selectedIndex]);
        }
      };
  
      requestAnimationFrame(animateWheel);
    }
  }, [isSpinning, onSpin, names, rotation, onNameSelected]);

  return (
    <canvas ref={canvasRef} />
  );
};

export default NameWheel;
