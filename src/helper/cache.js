const {cache} = require('../config/defaultConfig');

function refreshRes(stats, res) {
    const {maxAge, expires, cacheControl, lastModified, etag} = cache;

    //Expires标头包含的日期/时间之后，响应被视为失效。
    // 无效日期（如值0）表示过去的日期，表示资源已过期。
    if (expires) {//绝对时间
        res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString());
    }

    //对于不会更改的应用程序中的文件，通常可以通过发送下面的响应标头来添加积极的缓存。这包括应用程序提供的静态文件，例如图像，CSS文件和JavaScript文件。
    if (cacheControl) {//相对时间
        res.setHeader('Cache-Control', `public,max-age=${maxAge}`)
    }

    //Last-Modified响应HTTP报头包含在其原始服务器认为该资源的最后修改日期和时间。它用作验证器，以确定接收或存储的资源是否相同。
    if (lastModified) {
        res.setHeader('Last-Modified', stats.mtime.toUTCString())
    }

    //所述ETagHTTP响应报头为资源的特定版本的标识符。它可以让缓存更高效并节省带宽，因为如果内容没有更改，Web服务器不需要重新发送完整响应。
    if (etag) {
        res.setHeader('Etag', `${stats.size}-${stats.mtime}`);
    }
}

module.exports = function isFresh(stats, req, res) {
    refreshRes(stats, res);
    const lastModified = req.headers['if-modified-since'];
    const etag = req.headers['if-none-match'];

    if (!lastModified && !etag) {
        return false;
    }
    if (lastModified && lastModified !== res.getHeader('last-Modified')) {
        return false;
    }
    if (etag && etag !== res.getHeader('Etag')) {
        return false;
    }
    return true;
};