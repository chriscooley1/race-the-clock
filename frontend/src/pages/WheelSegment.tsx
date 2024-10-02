import React from "react";

interface WheelSegmentProps {
  name: string;
  index: number;   // index for unique identification
  angle: number;   // Angle for the text positioning (not used here but kept for consistency)
  radius: number;  // Radius of the wheel for text positioning (not used here but kept for consistency)
  onRemove: () => void;
  onEdit: (newName: string) => void;
}

const WheelSegment: React.FC<WheelSegmentProps> = ({ name, index, onRemove, onEdit }) => {

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEdit(e.target.value);
  };

  return (
    <li className="flex items-center mb-2">
      <input
        type="text"
        value={name}
        onChange={handleEdit}
        className="flex-grow mr-2 bg-white text-black border border-current rounded p-2 text-base font-caveat"
        placeholder="Edit name"
        title={`Edit name ${index + 1}`}
      />
      <button 
        type="button" 
        onClick={onRemove} 
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
      >
        Remove
      </button>
    </li>
  );
};

export default WheelSegment;
