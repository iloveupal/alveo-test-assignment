import { configureStore } from '@reduxjs/toolkit';
import logsReducer from '../features/logs/logsSlice.js';


export default configureStore({
  reducer: {
    logs: logsReducer,
  },
});
