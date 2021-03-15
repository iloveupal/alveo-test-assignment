import React from 'react';

import './LogsStatisticsView.css';

export const LogsStatisticsView = ({
  statistics,
}) => {
  return (
    <div className='LogsStatisticsView-Container'>
      <div>INFO: {statistics.INFO}</div>
      <div>WARNING: {statistics.WARNING}</div>
      <div>ERROR: {statistics.ERROR}</div>
    </div>
  )
}
