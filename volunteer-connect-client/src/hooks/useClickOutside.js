import { useEffect } from 'react';

/**
 * A custom hook that triggers a handler when a click is detected outside of the referenced element.
 * @param {React.RefObject} ref - The ref of the element to monitor.
 * @param {Function} handler - The function to call when a click outside is detected.
 */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default useClickOutside;