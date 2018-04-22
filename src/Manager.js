import path from 'path';
import { err, warn } from './utils';
import { constants } from './constants';
import { ensureTrailingSpace } from './fileUtils';

export default class Manager {
    constructor(dbConn, dest) {
        if (!dbConn) {
            err('Expected dbConn in Manager constructor');
        }
        this.dbConn = dbConn;
        this.dest = ensureTrailingSpace(path.resolve(dest));
        this.destDupes = ensureTrailingSpace(path.resolve(`${dest}${constants.DUPE_DIR_SUFFIX}`));
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
        return this.collection(constants.FILES_COLLECTION).update(criteria, doc2, { upsert: true, w: 1 });
    }

    /**
     * @param {doc} s source doc
     * @param {doc} t target doc
     * @return {promise}
     */
    async saveDupe(s, t) {
        const sourceDoc = { ...s };
        const targetDoc = { ...t };
        if (sourceDoc._id) {
            delete sourceDoc._id;
        }
        if (targetDoc._id) {
            delete targetDoc._id;
        }
        const criteria = { 'sourceDoc.fullPath': sourceDoc.fullPath };
        const dbDoc = { sourceDoc, targetDoc };

        const writeResult = await this.collection(constants.DUPES_COLLECTION)
            .update(criteria, dbDoc, { upsert: true, w: 1 });

        if (writeResult.result.upserted) {
            warn(`Saved dupe record ${sourceDoc.fullPath} ${targetDoc.fullPath}`);
        }
    }
}
