import React from 'react';
import { useState, useEffect } from 'react';

const ErrorMessage = ({ message }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
        setIsVisible(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);
  return (
    <>
        {
            isVisible && message &&
            <div className="fixed bottom-0 right-0 p-8 bg-red-500 text-white mb-1 mr-1">
            {message}
          </div>
        }
    </>
  );
};

export default ErrorMessage;