// src/components/PracticeMode/StarRating.jsx
import React, { useState, useEffect } from 'react';

const StarRating = ({ stars, animated = true }) => {
  const [visibleStars, setVisibleStars] = useState(0);
  
  useEffect(() => {
    if (!animated) {
      setVisibleStars(stars);
      return;
    }
    
    // Animate stars one by one
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleStars(current);
      
      if (current >= stars) {
        clearInterval(interval);
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [stars, animated]);
  
  return (
    <div className="flex justify-center gap-2 my-6">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`
            text-5xl md:text-6xl transition-all duration-300
            ${star <= visibleStars 
              ? 'scale-100 opacity-100 text-yellow-400 animate-bounce' 
              : 'scale-0 opacity-0 text-gray-300 dark:text-gray-600'}
          `}
          style={{
            animationDelay: star <= visibleStars ? `${(star - 1) * 0.1}s` : '0s',
            animationDuration: '0.6s'
          }}
        >
          {star <= visibleStars ? '⭐' : '☆'}
        </div>
      ))}
    </div>
  );
};

export default StarRating;
