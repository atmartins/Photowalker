import minimist from 'minimist';
import mongodb from 'mongodb';

import { notice, err, log, exit } from './utils';
import { constants } from './constants';
import { walker } from './walker';

const argv = minimist(process.argv.slice(2));

const { MongoClient } = mongodb;

const connectionString = argv.dbStr || `mongodb://localhost:27017/${constants.DB_NAME}`;
const suggestedMongoCmd = 'docker run --name pwalk -p 27017:27017 -v /my/own/datadir:/data/db -d mongo:latest';

if (!argv.src) {
    err('You must specify a source, use "--src=/my/dir"');
    exit();
}
if (!argv.dest) {
    err('You must specify a destination (to archive to), use "--dest=/my/dir"');
    exit();
}

async function main() {
    notice('main running...');
    // Connect to the db
    let dbClient;

    try {
        dbClient = await MongoClient.connect(connectionString);
    } catch (e) {
        err(`Couldn't connect to ${connectionString}. Perhaps you need to run something like 'npm run createMongo'? See https://hub.docker.com/_/mongo/ for more.`);
        exit();
    }

    try {
        log(`Mongo connected at ${connectionString}`);
        log(`Walker gonna walk, ${argv.src} to ${argv.dest}`);
        walker({
            dbClient,
            src: argv.src,
            dest: argv.dest,
        });
    } catch (e) {
        err('Error in main walker');
        exit();
    }
}

main();
