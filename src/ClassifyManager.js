import path from 'path';
import trash from 'trash';
import { constants } from './constants';
import { notice, log, warn, isValidUniqueAttribute } from './utils';
import { copyFile, hashFile, getFileSize, renameUntilUnique, getFileName } from './fileUtils';
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
        };

        if (!sourceDoc.size) {
            throw new Error(`Empty file ${sourceDoc.name}`);
        }

        const targetDoc = await super.findOne({ size: sourceDoc.size });

        if (targetDoc && targetDoc.name) {
            warn(`${sourceDoc.name} is filesize dupe for existing doc: ${targetDoc.name}`);
            this.processDupe(targetDoc, sourceDoc);
        } else {
            log(`${sourceDoc.name} is size-unique`);
            this.processUnique(sourceDoc, constants.uniqueAttribute.SIZE);
        }
    }

    async processDupe(targetDoc, sourceDoc) {
        const hashesMatch = await this.checkHashMatch(targetDoc, sourceDoc);
        if (hashesMatch) {
            warn(`${sourceDoc.name} is hash dupe for existing doc: ${targetDoc.name}`);
        } else {
            this.processUnique(sourceDoc, constants.uniqueAttribute.HASH);
        }
    }

    async processUnique(sourceDoc, uniqueAttribute) {
        if (!isValidUniqueAttribute(uniqueAttribute)) {
            throw new Error(`Invalid unique attribute ${uniqueAttribute}`);
        }
        const updatedDoc = Object.assign({}, sourceDoc);
        updatedDoc.fullPath = this.calculateDestination(sourceDoc);

        log(`Moving ${sourceDoc.name} to ${updatedDoc.fullPath}`);

        await copyFile(sourceDoc.fullPath, updatedDoc.fullPath);

        const copiedSize = getFileSize(updatedDoc.fullPath);
        if (sourceDoc.size === copiedSize) {
            updatedDoc.archivedName = getFileName(updatedDoc.fullPath);
            log(`Upserting ${sourceDoc.name} as ${updatedDoc.archivedName}`);
            await super.upsert({ [uniqueAttribute]: sourceDoc[uniqueAttribute] }, updatedDoc);
            warn(`Moved & trashing ${sourceDoc.fullPath}`);
            await trash(sourceDoc.fullPath);
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
    async checkHashMatch(targetDoc, sourceDoc) {
        let existingMd5hash;
        const newMd5hash = await hashFile(sourceDoc.fullPath);

        if (targetDoc.md5hash) {
            existingMd5hash = targetDoc.md5hash;
        } else {
            if (!(targetDoc.fullPath && typeof targetDoc.fullPath === 'string')) {
                throw new Error('Expected targetDoc.fullPath to exist and be a string.');
            }
            existingMd5hash = await hashFile(targetDoc.fullPath);
            const updatedDoc = Object.assign({}, targetDoc, { md5hash: existingMd5hash });
            super.update({ _id: updatedDoc._id }, updatedDoc);
        }

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
