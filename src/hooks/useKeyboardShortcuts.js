// src/hooks/useKeyboardShortcuts.js
import { useEffect, useCallback } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * @param {Object} shortcuts - Object with key combinations and callbacks
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export const useKeyboardShortcuts = (shortcuts = {}, enabled = true) => {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Get modifier keys
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? event.metaKey : event.ctrlKey;
    
    // Build key combination string
    const key = event.key.toLowerCase();
    const combo = [];
    
    if (modKey) combo.push('mod');
    if (event.shiftKey) combo.push('shift');
    if (event.altKey) combo.push('alt');
    combo.push(key);
    
    const comboString = combo.join('+');
    
    // Check if we have a handler for this combination
    if (shortcuts[comboString]) {
      event.preventDefault();
      event.stopPropagation();
      shortcuts[comboString](event);
      return;
    }
    
    // Also check for single keys (like 'escape')
    if (shortcuts[key] && !modKey && !event.shiftKey && !event.altKey) {
      shortcuts[key](event);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);

  return null;
};

/**
 * Get the display name for a shortcut based on platform
 */
export const getShortcutDisplay = (shortcut) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';
  
  return shortcut
    .replace('mod', modKey)
    .replace('shift', isMac ? '⇧' : 'Shift')
    .replace('alt', isMac ? '⌥' : 'Alt')
    .split('+')
    .map(key => key.charAt(0).toUpperCase() + key.slice(1))
    .join('+');
};

export default useKeyboardShortcuts;
