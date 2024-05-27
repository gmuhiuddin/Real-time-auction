import { useState, useEffect } from "react";

const CustomAlert = ({txt, isErrMsg}) => {

const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeout;
    if (visible) {
      timeout = setTimeout(() => {
        setVisible(false);
      }, 3000); // 3 seconds
    }

    return () => clearTimeout(timeout);
  }, [visible]);

  return (
    <div style={{ 
      backgroundColor: isErrMsg ? '#fff' : "#01d293",
      color: '#0E1930',
      padding: '10px',
      borderRadius: '5px',
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      fontSize: "1.2em",
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      {txt}
    </div>
  );
};

export default CustomAlert;