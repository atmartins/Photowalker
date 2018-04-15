import path from 'path';
import { err } from './utils';
import { constants } from './constants';
import { ensureTrailingSpace } from './fileUtils';

export default class Manager {
    constructor(dbConn, dest) {
        if (!dbConn) {
            err('Expected dbConn in Manager constructor');
        }
        this.dbConn = dbConn;
        this.dest = ensureTrailingSpace(path.resolve(dest));
    }

    collection(name) {
        return this.dbConn.collection(name);
    }

    async save(doc) {
        return this.collection(constants.FILES_COLLECTION).insert(doc);
    }

    async findOne(criteria) {
        return this.collection(constants.FILES_COLLECTION).findOne(criteria);
    }

    async update(criteria, doc) {
        const doc2 = { ...doc };
        if (doc2._id) {
            delete doc2._id;
        }
        return this.collection(constants.FILES_COLLECTION).update(criteria, doc2);
    }

    async upsert(criteria, doc) {
        const doc2 = { ...doc };
        if (doc2._id) {
            delete doc2._id;
        }
        return this.collection(constants.FILES_COLLECTION).update(criteria, doc2, { upsert: true });
    }
}
