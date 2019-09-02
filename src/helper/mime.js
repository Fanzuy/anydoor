const path = require('path');
const mineType = {
    'css': 'text/css',
    'git=': 'image/gif',
    'html': 'text/html',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'js': 'text/javascript',
    'json': 'application/json',
    'pdf': 'application/pdf',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'swf': 'application/x-shockwave-flash',
    'tiff': 'image/tiff',
    'txt': 'text/plain',
    'wav': 'audio/x-wav',
    'wma': 'audio/x-ms-wma',
    'wmv': 'audio/x-ms-wmv',
    'xml': 'text/xml'
};
module.exports = (filePath) => {
    let ext = path.extname(filePath).split('.').pop().toLocaleLowerCase();
    if (!ext) {
        ext = filePath;
    }
    return mineType[ext] || mineType['txt'];
};