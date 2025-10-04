// src/hooks/useSwipeGesture.js
import { useState } from 'react';

/**
 * Custom hook for handling swipe gestures on mobile
 * @param {Function} onSwipeLeft - Callback for left swipe
 * @param {Function} onSwipeRight - Callback for right swipe
 * @returns {Object} - Touch event handlers
 */
export const useSwipeGesture = (onSwipeLeft, onSwipeRight) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const minSwipeDistance = 50; // Minimum distance for swipe to register
  
  const onTouchStart = (e) => {
    setTouchEnd(0); // Reset end position
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
    
    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };
  
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

export default useSwipeGesture;
