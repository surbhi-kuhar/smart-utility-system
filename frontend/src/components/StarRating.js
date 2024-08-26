import React, { useState } from "react";

const StarRating = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(null);

  const handleClick = (index) => {
    onChange(index + 1);
  };

  const handleMouseOver = (index) => {
    setHoverValue(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          onClick={() => handleClick(index)}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          className={`h-8 w-8 cursor-pointer ${
            (hoverValue || value) > index ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927C9.432 1.77 10.568 1.77 10.951 2.927l1.429 4.4a1 1 0 00.949.675h4.631c1.073 0 1.52 1.374.734 2.08l-3.748 3.062a1 1 0 00-.293 1.057l1.429 4.4c.383 1.158-.99 2.115-2.016 1.42l-3.748-3.062a1 1 0 00-1.214 0L5.864 19.02c-1.026.695-2.399-.262-2.016-1.42l1.429-4.4a1 1 0 00-.293-1.057L1.236 10.08c-.786-.706-.339-2.08.734-2.08h4.631a1 1 0 00.949-.675l1.429-4.4z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
