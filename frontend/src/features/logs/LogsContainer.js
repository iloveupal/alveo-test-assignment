import React from 'react';
import { useSelector } from 'react-redux';

import { LogsStatisticsView } from './components/LogsStatisticsView';
import { LogListView } from './components/LogsView';
import { useLogsService } from './logsHooks';


export const LogsContainer = () => {
  useLogsService();

  const logs = useSelector((state) => state.logs.logs);
  const statistics = useSelector((state) => state.logs.statistics);

  return (
    <div>
      <LogsStatisticsView statistics={statistics} />
      <LogListView logs={logs} />
    </div>
  );
};
