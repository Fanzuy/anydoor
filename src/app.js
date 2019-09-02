const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const conf = require('./config/defaultConfig');

const server = http.createServer((req, res)=>{
    const filepath = path.join(conf.root, req.url);
    fs.stat(filepath,(err,stats)=>{
        if (err){
            res.statusCode = 404;
            res.setHeader('Content-type', 'text/plain');
            res.end(`${filepath} is not a directory or a file`)
        }
        if (stats.isFile()){
            res.statusCode = 200;
            res.setHeader('Content-type', 'text/plain');
            // fs.readFile(filepath,(err,data)=>{
            //     res.end(data);
            // });
            fs.createReadStream(filepath).pipe(res);
        }else if (stats.isDirectory()){
            fs.readdir(filepath,(err,files)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','text/plain');
                res.end(files.join(','))
            })
        }
    })

});

server.listen(conf.post, conf.hostname,()=>{
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`)
})