import React, { createContext, useState, useContext, useCallback } from 'react';
import ToastContainer from '../components/ToastContainer/ToastContainer';

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    
    // Automatically remove the toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};