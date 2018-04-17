import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import Promise from 'bluebird';
import md5 from 'md5';

import { constants } from './constants';

const readFile = Promise.promisify(fs.readFile);

const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
    return false;
};

export function fileExists(fullPath) {
    return fs.existsSync(fullPath);
}

/**
 * @param {string} source
 * @param {string} target
 * @return {promise}
 */
export async function copyFile(source, target) {
    if (fileExists(target)) {
        throw new Error(`Target ${target} exists`);
    }

    await ensureDirectoryExistence(target);

    const rd = fs.createReadStream(source);
    const wr = fs.createWriteStream(target);

    return new Promise((resolve, reject) => {
        rd.on('error', reject);
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    }).catch((error) => {
        rd.destroy();
        wr.end();
        throw error;
    });
}

export async function moveFile(source, target) {
    if (fileExists(target)) {
        throw new Error(`Target ${target} exists`);
    }

    await ensureDirectoryExistence(target);
    return new Promise((resolve, reject) => {
        fs.rename(source, target, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function getMimeType(filePath) {
    return mime.lookup(filePath);
}

export function isImage(filePath) {
    const m = getMimeType(filePath);
    return (m.indexOf(constants.mimeTypePrefix.IMAGE) > -1);
}

export async function hashFile(filePath) {
    const newFile = await readFile(filePath);
    const md5hash = md5(newFile);
    return md5hash;
}

export function getFileSize(filePath) {
    return fs.statSync(filePath).size;
}

/**
 * Increment integer suffix on the end of a file name
 * e.g. adds _1, or if exists, increments to _2 ... _n
 */
export function calcSuffix(name) {
    let na = name;
    const radix = 10;
    try {
        const num = parseInt(/__([0-9]*)$/.exec(name)[1], radix) + 1;
        const suff = `__${num}`;
        na = `${na.substring(0, na.length - suff.length)}${suff}`;
    } catch (e) {
        // Initial suffix
        na += '__1';
    }
    return na;
}

export function ensureTrailingSpace(str) {
    return str + ((str.substr(-1) === '/') ? '' : '/');
}

export function renameUntilUnique(filePath) {
    let pa;
    const p = path.parse(filePath);
    const dir = ensureTrailingSpace(p.dir);
    const ext = p.ext.toLowerCase();
    const { name } = p;
    pa = `${dir}${name}${ext}`;

    if (fileExists(pa)) {
        const candidate = `${dir}${calcSuffix(name)}${ext}`;
        pa = renameUntilUnique(candidate);
    }
    return pa;
}

export function getFileName(filePath) {
    const p = path.parse(filePath);
    return `${p.name}${p.ext}`;
}
