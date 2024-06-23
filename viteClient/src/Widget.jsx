import React from 'react';
import Cpu from './Cpu';
import Mem from './Mem';
import Info from './Info';
import './widget.css';

const Widget = ({ data }) => {
  const { freeMem, totalMem, usedMem, memUseage, osType, upTime, cpuModel, numCores, cpuSpeed, cpuLoad, macA, isActive } = data;

  const cpuWidgetId = `cpu-widget-${macA}`;
  const memWidgetId = `mem-widget-${macA}`;

  const cpu = { cpuLoad, cpuWidgetId };
  const mem = { totalMem, usedMem, memUseage, freeMem, memWidgetId };
  const info = { macA, osType, upTime, cpuModel, numCores, cpuSpeed };

  return (
    <div className="widget col-sm-12">
      {!isActive && <div className="not-active">Offline</div>}
      <Cpu cpuData={cpu} />
      <Mem memData={mem} />
      <Info infoData={info} />
    </div>
  );
};

export default Widget;
