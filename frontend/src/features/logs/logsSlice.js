import { createSlice } from '@reduxjs/toolkit';
import * as logsApi from './logsApi';
import { calculateStatistics, parseLog } from './logsUtils';

export const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    logs: [],
    statistics: {
      ERROR: 0,
      WARNING: 0,
      INFO: 0,
    },
  },
  reducers: {
    setLogs: (state, action) => {
      state.logs = action.payload;
    },
    setStatistics: (state, action) => {
      state.statistics = action.payload;
    },
  },
});

export const { setLogs, setStatistics } = logsSlice.actions;

export const getLogsAsync = async (dispatch) => {
  const {logs, newLogsAvailable} = await logsApi.getLogs();

  if (!newLogsAvailable) {
    return;
  }

  const parsedLogs = logs.map(parseLog);

  dispatch(setLogs(parsedLogs));
  dispatch(setStatistics(calculateStatistics(parsedLogs)));
}

export default logsSlice.reducer;
