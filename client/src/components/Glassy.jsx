  // src/components/GlassCard.jsx
  import React from 'react';

  const GlassCard = ({ children }) => {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-30 p-6 shadow-lg">
        {children}
      </div>
    );
  };

  export default GlassCard;
