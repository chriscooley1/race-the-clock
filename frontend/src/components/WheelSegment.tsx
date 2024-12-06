import React from "react";
import { useTheme } from "../context/ThemeContext";

interface WheelSegmentProps {
  name: string;
  index: number; // index for unique identification
  angle: number; // Angle for the text positioning (not used here but kept for consistency)
  radius: number; // Radius of the wheel for text positioning (not used here but kept for consistency)
  onRemove: () => void;
  onEdit: (newName: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

const WheelSegment: React.FC<WheelSegmentProps> = ({
  name,
  index,
  onRemove,
  onEdit,
  onDragStart,
  onDragOver,
  onDrop,
  
}) => {
  const { theme } = useTheme();

  return (
    <li
      className="mb-2 flex items-center"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e, index)}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => onEdit(e.target.value)}
        className={`font-teacher mr-2 grow rounded border border-current ${theme.isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"} p-2 text-base`}
        placeholder="Edit name"
        title={`Edit name ${index + 1}`}
      />
      <button
        type="button"
        onClick={onRemove}
        className="rounded border border-black bg-red-500 px-2 py-1 text-white transition duration-300 hover:bg-red-600"
      >
        Remove
      </button>
    </li>
  );
};

export default WheelSegment;
