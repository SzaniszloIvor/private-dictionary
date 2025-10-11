import React from 'react';
import { Star } from 'lucide-react';

/**
 * Favorite toggle button component
 * Displays a star icon that can be clicked to toggle favorite status
 * 
 * @param {boolean} isFavorite - Current favorite status
 * @param {Function} onClick - Click handler
 * @param {string} size - Button size: 'sm', 'md', 'lg'
 * @param {boolean} disabled - Disable button
 * @param {string} className - Additional CSS classes
 */
const FavoriteButton = ({ 
  isFavorite, 
  onClick, 
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        ${isFavorite 
          ? 'bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600' 
          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-110 cursor-pointer'
        }
        focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:ring-offset-2
        ${className}
      `}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Kedvencekből eltávolítás' : 'Hozzáadás a kedvencekhez'}
    >
      <Star
        size={iconSizes[size]}
        className={`
          transition-all duration-200
          ${isFavorite 
            ? 'fill-white text-white' 
            : 'fill-none text-gray-600 dark:text-gray-300'
          }
        `}
        strokeWidth={2}
      />
    </button>
  );
};

export default FavoriteButton;
