module.exports = (totalSize, req, res) => {
    const range = req.headers['range'];
    if (!range) {
        return {
            code: 200
        }
    }
    const sizes = range.match(/bytes=(\d*)-(\d*)/);
    const end = sizes[2] || totalSize - 1;
    const start = sizes[1] || totalSize - end;

    if (start > end || start < 0 || end > totalSize) {
        return {
            code: 200
        }
    }
    //Accept-Ranges 返回值为 bytes，这代表了该服务器可以接受范围请求，这样我们就可以做断点下载的功能了。如果该值为 none，则代表不允许范围请求。
    // 在存在Accept-Ranges标题的情况下，浏览器可能尝试恢复中断的下载，而不是从头开始再次启动。
    res.setHeader('Accept-Ranges', 'bytes');

    //在HTTP协议中，响应首部 Content-Range 显示的是一个数据片段在整个文件中的位置。
    res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);

    //Content-Length实体报头指示实体主体的大小，以字节为单位，发送到接收方。
    res.setHeader('Content-length', end - start);

    //Server通过请求头中的Range: bytes=0-xxx来判断是否是做Range请求，
    // 如果这个值存在而且有效，则只发回请求的那部分文件内容，响应的状态码变成206，表示Partial Content，并设置Content-Range。
    // 如果无效，则返回416状态码，表明Request Range Not
    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    }
};