import winston from "winston";

const APP_NAME = process.env.APP_NAME || "STREAMER";
let LOG_LEVEL = process.env.LOG_LEVEL || "info";

if (
    !["error", "warn", "info", "verbose", "debug", "silly"].includes(LOG_LEVEL)
) {
    LOG_LEVEL = "info";
}

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            const date = new Date(timestamp);
            return `${date.toISOString()}|${level
                .toUpperCase()
                .substring(0, 3)}|${APP_NAME}|${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

export default logger;