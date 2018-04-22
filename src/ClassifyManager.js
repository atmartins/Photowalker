import path from 'path';
import { constants } from './constants';
import { notice, log, warn, err, isValidUniqueAttribute } from './utils';
import { moveFile, hashFile, getFileSize, renameUntilUnique, getFileName } from './fileUtils';
import Manager from './Manager';

export default class ClassifyManager extends Manager {
    async manageFile(root, fileStats) {
        notice(`Classifying ${fileStats.name}`);

        const sourceDoc = {
            dev: fileStats.dev,
            mode: fileStats.mode,
            nlink: fileStats.nlink,
            uid: fileStats.uid,
            gid: fileStats.gid,
            rdev: fileStats.rdev,
            blksize: fileStats.blksize,
            ino: fileStats.ino,
            size: fileStats.size,
            blocks: fileStats.blocks,
            atimeMs: fileStats.atimeMs,
            mtimeMs: fileStats.mtimeMs,
            ctimeMs: fileStats.ctimeMs,
            birthtimeMs: fileStats.birthtimeMs,
            atime: fileStats.atime,
            mtime: fileStats.mtime,
            ctime: fileStats.ctime,
            birthtime: fileStats.birthtime,
            name: fileStats.name, // original file name
            type: fileStats.type,
            fullPath: path.resolve(path.join(root, fileStats.name)),
            archivedName: null,
            md5hash: null,
            _id: null,
        };

        if (!sourceDoc.size) {
            throw new Error(`Empty file ${sourceDoc.name}`);
        }

        const targetDoc = await super.findOne({ size: sourceDoc.size });

        if (targetDoc && targetDoc.name) {
            warn(`${sourceDoc.name} is filesize dupe for existing doc: ${targetDoc.fullPath}`);
            try {
                await this.processDupe(sourceDoc, targetDoc);
            } catch (e) {
                err('while processing dupe', e);
            }
        } else {
            log(`${sourceDoc.name} is size-unique`);
            try {
                await this.processUnique(sourceDoc, constants.uniqueAttribute.SIZE);
            } catch (e) {
                err('while processing unique', e);
            }
        }
    }

    async processDupe(sourceDoc, targetDoc) {
        if (targetDoc.size < constants.MAX_SIZE_TO_HASH_IN_BYTES) {
            let hashesMatch;
            try {
                hashesMatch = await this.checkHashMatch(sourceDoc, targetDoc);
                if (hashesMatch) {
                    this.fileDupeAway(sourceDoc, targetDoc);
                } else {
                    this.processUnique(sourceDoc, constants.uniqueAttribute.HASH);
                }
            } catch (e) {
                err('Problem checking hash match', e);
            }
        } else {
            this.fileDupeAway(sourceDoc, targetDoc);
        }
    }

    // Move the duplicate doc to a sibling archive directory
    // so it's out of the way and clean-up can occur.
    async fileDupeAway(sourceDoc, targetDoc) {
        const dupeDoc = Object.assign({}, sourceDoc);
        const _targetDoc = Object.assign({}, targetDoc);

        dupeDoc.fullPath = `${this.destDupes}${dupeDoc.name}`;
        moveFile(sourceDoc.fullPath, dupeDoc.fullPath);
        super.saveDupe(dupeDoc, _targetDoc);
    }

    async processUnique(sourceDoc, uniqueAttribute) {
        if (!isValidUniqueAttribute(uniqueAttribute)) {
            throw new Error(`Invalid unique attribute ${uniqueAttribute}`);
        }
        const updatedDoc = Object.assign({}, sourceDoc);
        updatedDoc.fullPath = this.calculateDestination(sourceDoc);

        // TODO fall back to copyFile if move can't proceed...
        log(`Moving ${sourceDoc.fullPath} to ${updatedDoc.fullPath}`);
        await moveFile(sourceDoc.fullPath, updatedDoc.fullPath);

        const movedSize = getFileSize(updatedDoc.fullPath);
        if (sourceDoc.size === movedSize) {
            updatedDoc.archivedName = getFileName(updatedDoc.fullPath);
            log(`Upserting ${sourceDoc.name} as ${updatedDoc.archivedName}`);
            await super.upsert({ [uniqueAttribute]: sourceDoc[uniqueAttribute] }, updatedDoc);
        } else {
            throw new Error(`Failed to copy file, sizes should match. sourceDoc.size: ${sourceDoc.size} | copiedSize: ${copiedSize}`);
        }
    }

    calculateDestination(doc) {
        notice(`Calculating destination for ${this.dest}${doc.name}`);
        return renameUntilUnique(`${this.dest}${doc.name}`);
    }


    /**
     * @param {string} fPath
     * @return {promise}
     */
    async checkHashMatch(sourceDoc, targetDoc) {
        let existingMd5hash;
        let newMd5hash;
        newMd5hash = await hashFile(sourceDoc.fullPath);
        existingMd5hash = await hashFile(targetDoc.fullPath);
        return (newMd5hash && existingMd5hash && newMd5hash === existingMd5hash);
    }
}

// fileStats example:
// {
// dev: 16777220,
// mode: 33188,
// nlink: 1,
// uid: 501,
// gid: 20,
// rdev: 0,
// blksize: 4096,
// ino: 10889391,
// size: 12,
// blocks: 8,
// atimeMs: 1523657566000,
// mtimeMs: 1523657566000,
// ctimeMs: 1523657566000,
// birthtimeMs: 1523657563000,
// atime: 2018-04-13T22:12:46.000Z,
// mtime: 2018-04-13T22:12:46.000Z,
// ctime: 2018-04-13T22:12:46.000Z,
// birthtime: 2018-04-13T22:12:43.000Z,
// name: 'test.txt',
// type: 'file'
// }
