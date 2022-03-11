const {format, createLogger, transports } = require('winston');
const { combine, timestamp, prettyPrint } = format;

export const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), prettyPrint()),
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
    ],
});
