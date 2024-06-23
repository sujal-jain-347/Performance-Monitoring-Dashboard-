import React, { useEffect } from 'react';
import drawCircle from './utilities/canvasLoadAnimation';

const Mem = ({ memData }) => {
  const { totalMem, usedMem, memUseage, freeMem, memWidgetId } = memData;

  useEffect(() => {
    const canvas = document.querySelector(`.${memWidgetId}`);
    drawCircle(canvas, memUseage * 100);
  }, [memData]);

  const totalMemInGB = (totalMem / 1073741824).toFixed(2);
  const freeMemInGB = (freeMem / 1073741824).toFixed(2);

  return (
    <div className="col-sm-3 mem">
      <h3>Memory Usage</h3>
      <div className="canvas-wrapper">
        <canvas className={memWidgetId} width="200" height="200"></canvas>
        <div className="mem-text">
          {memUseage * 100}%
        </div>
      </div>
      <div>
        Total Memory: {totalMemInGB}GB
      </div>
      <div>
        Free Memory: {freeMemInGB}GB
      </div>
    </div>
  );
};

export default Mem;
