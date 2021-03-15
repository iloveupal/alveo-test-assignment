import { useDispatch } from 'react-redux';
import { useEffect } from "react";
import { getLogsAsync } from './logsSlice';

const createPoller = () => {
  let keepPolling = false;
  
  const start = async (polledFunction) => {
    keepPolling = true;
    while (keepPolling === true) {
      await polledFunction();
    }
  };

  const stop = () => {
    keepPolling = false;
  }

  return {
    start,
    stop,
  }
}

const pollerInstance = createPoller();

export const useLogsService = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    pollerInstance.start(async () => dispatch(getLogsAsync));
    return () => {
      pollerInstance.stop();
    }
  }, [dispatch]);
};
