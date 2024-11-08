import React from "react";

interface WheelSegmentProps {
  name: string;
  index: number; // index for unique identification
  angle: number; // Angle for the text positioning (not used here but kept for consistency)
  radius: number; // Radius of the wheel for text positioning (not used here but kept for consistency)
  onRemove: () => void;
  onEdit: (newName: string) => void;
}

const WheelSegment: React.FC<WheelSegmentProps> = ({
  name,
  index,
  onRemove,
  onEdit,
}) => {
  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEdit(e.target.value);
  };

  return (
    <li className="mb-2 flex items-center">
      <input
        type="text"
        value={name}
        onChange={handleEdit}
        className="font-teacher mr-2 grow rounded border border-current bg-white p-2 text-base text-black"
        placeholder="Edit name"
        title={`Edit name ${index + 1}`}
      />
      <button
        type="button"
        onClick={onRemove}
        className="rounded bg-red-500 px-2 py-1 text-white transition duration-300 hover:bg-red-600"
      >
        Remove
      </button>
    </li>
  );
};

export default WheelSegment;
