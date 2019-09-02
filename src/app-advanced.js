const http = require('http');
const chalk = require('chalk');
const path = require('path');

const conf = require('./config/defaultConfig');
const route = require('./helper/route');
const openurl = require('./helper/openUrl');

class Server {
    constructor(config) {
        this.conf = Object.assign({}, conf, config);
    }

    start() {
        const server = http.createServer((req, res) => {
            const filepath = path.join(this.conf.root, req.url);
            // console.log(this.conf.root);
            // console.log(req.url);
            route(req, res, filepath, this.conf);
        });

        server.listen(this.conf.port, this.conf.hostname, () => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}`;
            console.info(`Server started at ${chalk.green(addr)}`);
            openurl(addr)//自动打开网址
        });
    }
}

module.exports = Server;

