const dateTimeRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(,\d{3})?/g;
const severityRegex = /(ERROR|INFO|WARNING)/g;
const logMessageRegex = /(?<=(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(,\d{3})? (ERROR|INFO|WARNING) )(.*)/g;

export const parseLog = (logLine) => {
  const dateString = logLine.match(dateTimeRegex)[0];
  const severity = logLine.match(severityRegex)[0];
  const message = logLine.match(logMessageRegex)[0];

  return {
    dateString,
    severity,
    message,
    id: dateString,
  };
};

export const calculateStatistics = (parsedLogsList) => {
  return parsedLogsList.reduce((acc, curr) => {
    acc[curr.severity]+=1;
    return acc;
  }, {
    INFO: 0,
    ERROR: 0,
    WARNING: 0,
  });
};
