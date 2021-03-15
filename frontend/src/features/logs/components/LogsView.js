import React from 'react';

import './LogsView.css';

export const LogItemView = ({ data }) => (
  <div>{data.dateString} {data.severity} {data.message}</div>
);

export const LogListView = ({ logs }) => {
  return (
    <div className='LogsView-Container'>
      {
        (logs.map((log) => (
          <LogItemView key={log.id} data={log} />
        )))
      }
    </div>
  );
};
