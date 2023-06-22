const { createLogger, transports, format } = require("winston");

const dlogger = createLogger({
  transports: [
    new transports.File({
      filename: "db-error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: "db.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = { dlogger };
