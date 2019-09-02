const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const mine = require('../helper/mime');
const compress = require('../helper/compress');
const range = require('../helper/range');
const isFresh = require('../helper/cache');


const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(tplPath, 'utf-8');
const template = Handlebars.compile(source);

module.exports = async function (req, res, filepath,config) {
    try {
        const stats = await stat(filepath);
        if (stats.isFile()) {
            const contentType = mine(filepath);
            res.setHeader('Content-type',contentType);

            if (isFresh(stats,req, res)){                                   //判断是否走缓存
                res.statusCode=304;
                res.end();
                return
            }

            let rs;                                                         //分段传输range
            const {code, start, end} = range(stats.size, req, res);
            if (code === 200){//无法处理
                res.statusCode = 200;
                rs = fs.createReadStream(filepath);
            }else {//可以处理
                res.statusCode = 206;
                rs = fs.createReadStream(filepath,{start:start,end:end});
            }
            if (filepath.match(config.compress)){                           //进行压缩
                rs = compress(rs, req, res);
            }


            rs.pipe(res);
        } else if (stats.isDirectory()) {
            const files = await readdir(filepath);
            const dir = path.relative(config.root, filepath);//从a到b的相对路径
            console.log(dir);
            const data = {
                title: path.basename(filepath),
                dir: dir ? `/${dir}` : '',
                files: files.map(file=> {
                    return {
                        file: file,
                        icon: mine(file)
                    }
                })
            };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(template(data));
        }
    } catch (e) {
        console.error(e);
        res.statusCode = 404;
        res.setHeader('Content-type', 'text/plain');
        res.end(`${filepath} is not a directory or a file\n ${e.toString()}`)
    }

};