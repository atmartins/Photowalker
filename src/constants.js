export const constants = {
    DB_NAME: 'pwalk',
    FILES_COLLECTION: 'files',
    IGNORE_FILENAMES: ['.DS_Store'],
    uniqueAttribute: {
        SIZE: 'size',
        HASH: 'hash',
    },
    mimeTypePrefix: {
        AUDIO: 'audio/',
        APPLICATION: 'application/',
        IMAGE: 'image/',
        TEXT: 'text/',
        VIDEO: 'video/',
    },
    mimeTypes: {
        '.aac': 'audio/aac',
        '.abw': 'application/x-abiword',
        '.arc': 'application/octet-stream',
        '.azw': 'application/vnd.amazon.ebook',
        '.bin': 'application/octet-stream',
        '.bz': 'application/x-bzip',
        '.bz2': 'application/x-bzip2',
        '.csh': 'application/x-csh',
        '.css': 'text/css',
        '.csv': 'text/csv',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.eot': 'application/vnd.ms-fontobject',
        '.epub': 'application/epub+zip',
        '.es': 'application/ecmascript',
        '.htm': 'text/html',
        '.html': 'text/html',
        '.ics': 'text/calendar',
        '.jar': 'application/java-archive',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.mid': 'audio/midi',
        '.midi': 'audio/midi',
        '.mpkg': 'application/vnd.apple.installer+xml',
        '.odp': 'application/vnd.oasis.opendocument.presentation',
        '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
        '.odt': 'application/vnd.oasis.opendocument.text',
        '.oga': 'audio/ogg',
        '.ogx': 'application/ogg',
        '.otf': 'font/otf',
        '.pdf': 'application/pdf',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.rar': 'application/x-rar-compressed',
        '.rtf': 'application/rtf',
        '.sh': 'application/x-sh',
        '.swf': 'application/x-shockwave-flash',
        '.tar': 'application/x-tar',
        '.ts': 'application/typescript',
        '.ttf': 'font/ttf',
        '.vsd': 'application/vnd.visio',
        '.wav': 'audio/wav',
        '.weba': 'audio/webm',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.xhtml': 'application/xhtml+xml',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xml': 'application/xml',
        '.xul': 'application/vnd.mozilla.xul+xml',
        '.zip': 'application/zip',
        '.7z': 'application/x-7z-compressed',

        // video formats
        '.3g2': 'video/3gpp2',
        '.3gp': 'video/3gpp',
        '.avi': 'video/x-msvideo',
        '.flv': 'video/x-flv',
        '.m4v': 'video/mp4',
        '.mkv': 'video/x-matroska',
        '.mp4': 'video/mp4',
        '.mpeg': 'video/mpeg',
        '.mpg': 'video/mpeg',
        '.mpg2': 'video/mpeg',
        '.mov': 'video/quicktime',
        '.mts': 'video/mts',
        '.ogv': 'video/ogg',
        '.vob': 'video/x-ms-vob',
        '.webm': 'video/webm',
        '.wmv': 'video/x-ms-wmv',

        // image formats
        '.gif': 'image/gif',
        '.ico': 'image/x-icon',
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.tif': 'image/tiff',
        '.tiff': 'image/tiff',
        '.webp': 'image/webp',

        // raw:
        '.ARW': 'image/x-sony-arw',
        '.CR2': 'image/x-canon-cr2',
        '.CRW': 'image/x-canon-crw',
        '.DCR': 'image/x-kodak-dcr',
        '.DNG': 'image/x-adobe-dng',
        '.ERF': 'image/x-epson-erf',
        '.K25': 'image/x-kodak-k25',
        '.KDC': 'image/x-kodak-kdc',
        '.MRW': 'image/x-minolta-mrw',
        '.NEF': 'image/x-nikon-nef',
        '.ORF': 'image/x-olympus-orf',
        '.PEF': 'image/x-pentax-pef',
        '.RAF': 'image/x-fuji-raf',
        '.RAW': 'image/x-panasonic-raw',
        '.SR2': 'image/x-sony-sr2',
        '.SRF': 'image/x-sony-srf',
        '.X3F': 'image/x-sigma-x3f',
    },
};
