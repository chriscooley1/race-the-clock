import React, { useRef, useEffect } from "react";

interface NameWheelProps {
  names: string[];
  isSpinning: boolean;
  selectedName: string | null;
}

const NameWheel: React.FC<NameWheelProps> = ({ names, isSpinning, selectedName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel segments
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
      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.fillText(name, radius - 5, 0);
      ctx.restore();
    });

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX - 10, centerY - radius - 20);
    ctx.lineTo(centerX + 10, centerY - radius - 20);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    // Rotate canvas if spinning
    if (isSpinning) {
      const rotation = performance.now() / 1000 * 2 * Math.PI;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
      requestAnimationFrame(() => canvasRef.current?.click());
    }

  }, [names, isSpinning, selectedName]);

  return <canvas ref={canvasRef} width={300} height={300} className="name-wheel" />;
};

export default NameWheel;
