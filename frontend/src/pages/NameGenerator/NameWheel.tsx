import React, { useRef, useEffect } from "react";

interface NameWheelProps {
  names: string[];
  isSpinning: boolean;
  rotation: number;
}

const NameWheel: React.FC<NameWheelProps> = ({ names, isSpinning, rotation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

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
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.fillText(name, radius - 5, 0);
        ctx.restore();
      });

      // Draw stationary pointer
      ctx.save();
      ctx.translate(centerX, centerY - radius - 10);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-10, -10);
      ctx.lineTo(10, -10);
      ctx.closePath();
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.restore();
    };

    drawWheel();
  }, [names, isSpinning, rotation]);

  return <canvas ref={canvasRef} width={300} height={300} className="name-wheel" id="nameWheel" />;
};

export default NameWheel;
