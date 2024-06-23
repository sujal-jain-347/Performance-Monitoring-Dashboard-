import React, { useState, useEffect } from 'react';
import './App.css';
import socket from './utilities/socketConnection';
import Widget from './Widget';

const App = () => {
  const [performanceData, setPerformanceData] = useState({});

  useEffect(() => {
    socket.on('data', (data) => {

      // Update state immutably
      setPerformanceData((prevData) => ({
        ...prevData,
        [data.macA]: data,
      }));
      
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off('data');
    };
  }, []);

  console.log(performanceData);
  
  const widgets = Object.entries(performanceData).map(([key, value]) => (
    <Widget key={key} data={value} />
  ));

  return (
    <div className="App">
      {widgets}
    </div>
  );
};

export default App;
