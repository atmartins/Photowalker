import walk from 'walk';
import fs from 'fs';
import { err, warn, log, notice } from './utils';
import { constants } from './constants';
import ClassifyManager from './ClassifyManager';

export async function walker({
    dbClient,
    src,
    dest,
}) {
    const dbConn = dbClient.db(constants.DB_NAME);
    const count = dbConn.collection(constants.FILES_COLLECTION).find().count();
    if (!count || count < 1) {
        throw new Error('Database is empty, is that expected?');
    }

    const ManagerClass = ClassifyManager;
    const manager = new ManagerClass(dbConn, dest);
    const wk = walk.walk(src);

    wk.on('file', (root, fileStats, next) => {
        try {
            if (constants.IGNORE_FILENAMES.includes(fileStats.name)) {
                notice(`----- Ignoring ${fileStats.name}`);
                next();
            } else {
                fs.readFile(fileStats.name, () => {
                    notice(`Managing ${fileStats.name}`);
                    manager.manageFile(root, fileStats);
                    next();
                });
            }
        } catch (e) {
            err(`${fileStats.name} unable to process. ${e}`, e);
        }
    });

    wk.on('errors', (root, nodeStatsArray, next) => {
        warn('walker error, does dest exist?');
        next();
    });

    wk.on('end', () => {
        log('All done');
        setTimeout(() => (dbClient.close()), 100000); // delay so db operations can finish up
    });
}
