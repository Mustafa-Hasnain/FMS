// components/CustomButton.jsx
import React from 'react';

const CustomButton = ({ text, loading, type = 'button', onClick, className = '', onClickText = '' }) => {
  return (
    <button
      type={type}
      disabled={loading}
      onClick={onClick}
      className={`w-full bg-[#CDFF00] hover:bg-[#B9E600] text-black font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-orbitron ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
          {onClickText ? onClickText : text}
        </div>
      ) : (
        text
      )}
    </button>
  );
};

export default CustomButton;
