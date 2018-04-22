import colors from 'colors';
import winston from 'winston';
import { constants } from './constants';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: './combined.log' }),
    ],
});

export const exit = () => (process.exit());

/* eslint-disable no-console */
export const err = (msg, e) => {
    console.error(colors.red.inverse(`ERROR: ${msg}`), '\n', e.stack ? colors.red(e.stack) : e);
    logger.error(msg, e);
};

export const warn = (msg) => {
    console.warn(colors.yellow.inverse(`WARN: ${msg}`));
    logger.warn(msg);
};

export const log = msg => (console.log(colors.green(`LOG: ${msg}`)));
export const notice = msg => (console.log(colors.white(`NOTICE: ${msg}`)));
/* eslint-enable no-console */

export function isValidUniqueAttribute(uniqueAttribute) {
    return (Object.values(constants.uniqueAttribute).includes(uniqueAttribute));
}
