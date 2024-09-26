import React from "react";

interface WheelSegmentProps {
  name: string;
  index: number;
  onRemove: () => void;
  onEdit: (newName: string) => void;
}

const WheelSegment: React.FC<WheelSegmentProps> = ({ name, index, onRemove, onEdit }) => {
  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEdit(e.target.value);
  };

  return (
    <li key={index}>
      <input
        type="text"
        value={name}
        onChange={handleEdit}
        className="gen-custom-input"
        placeholder="Edit name"
        title={`Edit name ${index + 1}`}
      />
      <button type="button" onClick={onRemove} className="name-remove-button">
        Remove
      </button>
    </li>
  );
};

export default WheelSegment;
