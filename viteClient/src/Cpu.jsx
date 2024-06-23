import React, { useEffect } from 'react';
import drawCircle from './utilities/canvasLoadAnimation';

const Cpu = ({ cpuData }) => {
  useEffect(() => {
    const canvas = document.querySelector(`.${cpuData.cpuWidgetId}`);
    drawCircle(canvas, cpuData.cpuLoad);
  }, [cpuData]);

  return (
    <div className="col-sm-3 cpu">
      <h3>CPU load</h3>
      <div className="canvas-wrapper">
        <canvas className={cpuData.cpuWidgetId} width="200" height="200"></canvas>
        <div className="cpu-text">{cpuData.cpuLoad}%</div>
      </div>
    </div>
  );
};

export default Cpu;
